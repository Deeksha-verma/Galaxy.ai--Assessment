import { runs } from "@trigger.dev/sdk/v3";
import { prisma } from "../common/services/database.service";
import * as workflowService from "../workflow/workflow.service";
import { ensureUserSync } from "../user/user.service";
import { runLLMTask } from "../../trigger/llm-task";
import { cropImageTask } from "../../trigger/crop-image-task";
import { extractFrameTask } from "../../trigger/extract-frame-task";

// Minimal types for DAG processing
type WorkflowNode = { id: string; type: string; data: any };
type WorkflowEdge = { id: string; source: string; target: string; sourceHandle?: string; targetHandle?: string };
type RunScope = "full" | "partial" | "single";

export const executeWorkflow = async (
  userId: string,
  workflowId: string,
  scope: RunScope,
  targetNodeIds?: string[],
  onStatusUpdate?: (nodeId: string, status: string, output?: any, error?: string) => void
) => {
  await ensureUserSync(userId);
  const workflow = await workflowService.getWorkflow(userId, workflowId);
  const allNodes = (workflow.nodes || []) as WorkflowNode[];
  const allEdges = (workflow.edges || []) as WorkflowEdge[];

  let nodesToRun = allNodes;
  if (scope === "single" || scope === "partial") {
    if (!targetNodeIds?.length) throw new Error("targetNodeIds required for partial/single scope");
    nodesToRun = allNodes.filter(n => targetNodeIds.includes(n.id));
  }

  // Determine next run number
  const lastRun = await prisma.workflowRun.findFirst({
    where: { workflowId },
    orderBy: { runNumber: "desc" },
    select: { runNumber: true },
  });
  const runNumber = lastRun ? lastRun.runNumber + 1 : 1;

  // 1. Create WorkflowRun record
  const run = await prisma.workflowRun.create({
    data: {
      workflowId,
      userId,
      runNumber,
      scope: scope === "full" ? "FULL" : scope === "partial" ? "PARTIAL" : "SINGLE",
      status: "RUNNING",
    },
  });

  // Create initial RUNNING state for all targeted nodes
  const nodeResultMap = new Map<string, any>();
  for (const node of nodesToRun) {
    const result = await prisma.nodeResult.create({
      data: {
        runId: run.id,
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: node.data?.label || node.type,
        status: "RUNNING",
      },
    });
    nodeResultMap.set(node.id, result);
    onStatusUpdate?.(node.id, "running");
  }

  try {
    // 2. Topological Sort (Kahn's Algorithm) over *only the nodesToRun*
    const waves = calculateWaves(nodesToRun, allEdges);

    const valuesMap = new Map<string, any>(); // Stores actual execution results passing between nodes

    // 3. Execute Waves Sequentially (but nodes inside wave run concurrently)
    let workflowHasError = false;

    for (const wave of waves) {
      if (workflowHasError) break; // Halts downstream if any upstream failed

      await Promise.allSettled(
        wave.map(node => executeNode(node, allEdges, valuesMap, nodeResultMap.get(node.id)!, onStatusUpdate))
      ).then(results => {
        // If any node in the wave failed, mark workflow as having an error
        if (results.some(r => r.status === "rejected" || (r.status === "fulfilled" && r.value === false))) {
          workflowHasError = true;
        }
      });
    }

    // 4. Conclude Run
    await prisma.workflowRun.update({
      where: { id: run.id },
      data: {
        status: workflowHasError ? "FAILED" : "SUCCESS",
        completedAt: new Date(),
        durationMs: Date.now() - run.startedAt.getTime(),
      },
    });

    return run;
  } catch (error: any) {
    await prisma.workflowRun.update({
      where: { id: run.id },
      data: { status: "FAILED", completedAt: new Date(), durationMs: Date.now() - run.startedAt.getTime() },
    });
    throw error;
  }
};

/**
 * Groups nodes into concurrent execution waves.
 */
function calculateWaves(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[][] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  }

  // Build graph (only considering edges between nodes we are actually running)
  for (const edge of edges) {
    if (nodeMap.has(edge.source) && nodeMap.has(edge.target)) {
      adj.get(edge.source)!.push(edge.target);
      inDegree.set(edge.target, inDegree.get(edge.target)! + 1);
    }
  }

  const waves: WorkflowNode[][] = [];
  let currentWaveId = nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);

  while (currentWaveId.length > 0) {
    const nextWaveId: string[] = [];
    const currentWaveNodes = currentWaveId.map(id => nodeMap.get(id)!);
    waves.push(currentWaveNodes);

    for (const u of currentWaveId) {
      for (const v of adj.get(u) || []) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) nextWaveId.push(v);
      }
    }
    currentWaveId = nextWaveId;
  }

  // Cycle check
  if (waves.flat().length !== nodes.length) {
    throw new Error("DAG validation failed: Cycle detected or invalid graph.");
  }

  return waves;
}

/**
 * Orchestrates a single node's execution.
 */
async function executeNode(
  node: WorkflowNode,
  allEdges: WorkflowEdge[],
  valuesMap: Map<string, any>,
  resultRecord: any,
  onStatusUpdate?: (nodeId: string, status: string, output?: any, error?: string) => void
): Promise<boolean> {
  const startTime = Date.now();

  try {
    // 1. Resolve inputs
    const inputs: Record<string, any> = { ...node.data };
    const incomingEdges = allEdges.filter(e => e.target === node.id);

    // Multi-handle map for things like arrays mapping to a single handle (e.g. LLM 'images')
    const multiInputs: Record<string, any[]> = {};

    for (const edge of incomingEdges) {
      const sourceVal = valuesMap.get(edge.source);
      if (sourceVal !== undefined && edge.targetHandle) {
        // If it's a known multi-handle like 'images', push to array
        if (edge.targetHandle === "images") {
          if (!multiInputs.images) multiInputs.images = [];
          if (typeof sourceVal === "string") multiInputs.images.push(sourceVal);
          else if (sourceVal.value) multiInputs.images.push(sourceVal.value);
        } else {
          // Flatten text/image objects to primitive scalar for inputs
          inputs[edge.targetHandle] = typeof sourceVal === "string" ? sourceVal : sourceVal.value;
        }
      }
    }

    if (multiInputs.images) {
      inputs.imageUrls = multiInputs.images; // standardize to Trigger payload format
    }

    // Save initial snapshot to DB
    await prisma.nodeResult.update({
      where: { id: resultRecord.id },
      data: { inputs },
    });

    let outputValue: any;

    // 2. Execute by type
    switch (node.type) {
      case "text":
        // simple passthrough of input text
        outputValue = { type: "text", value: inputs.text || inputs.output || "" };
        break;
      case "upload-image":
        // output handle passes the transloadit URL
        outputValue = { type: "image", value: inputs.imageUrl || "" };
        break;
      case "upload-video":
        outputValue = { type: "video", value: inputs.videoUrl || "" };
        break;
      case "llm":
        const llmHandle = await runLLMTask.trigger({
          model: inputs.model || "gemini-2.0-flash",
          systemPrompt: inputs.system_prompt,
          userMessage: inputs.user_message || "Hello",
          imageUrls: inputs.imageUrls,
        });
        const llmResult = await runs.poll(llmHandle.id);
        if (llmResult.status !== "COMPLETED") throw new Error((llmResult.error as any)?.message || "LLM task failed");
        outputValue = { type: "text", value: llmResult.output.text };
        break;
      case "crop-image":
        const cropHandle = await cropImageTask.trigger({
          imageUrl: inputs.image_url,
          xPct: Number(inputs.x_percent || 0),
          yPct: Number(inputs.y_percent || 0),
          widthPct: Number(inputs.width_percent || 100),
          heightPct: Number(inputs.height_percent || 100),
        });
        const cropResult = await runs.poll(cropHandle.id);
        if (cropResult.status !== "COMPLETED") throw new Error((cropResult.error as any)?.message || "Crop task failed");
        outputValue = { type: "image", value: cropResult.output.imageUrl };
        break;
      case "extract-frame":
        const frameHandle = await extractFrameTask.trigger({
          videoUrl: inputs.video_url,
          timestamp: inputs.timestamp || 0,
        });
        const frameResult = await runs.poll(frameHandle.id);
        if (frameResult.status !== "COMPLETED") throw new Error((frameResult.error as any)?.message || "Extract frame task failed");
        outputValue = { type: "image", value: frameResult.output.imageUrl };
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    // 3. Save Success
    valuesMap.set(node.id, outputValue); // crucial for next wave
    await prisma.nodeResult.update({
      where: { id: resultRecord.id },
      data: {
        status: "SUCCESS",
        output: outputValue,
        durationMs: Date.now() - startTime,
      },
    });

    // Notify client via SSE
    onStatusUpdate?.(node.id, "success", outputValue);

    return true;

  } catch (err: any) {
    // Save Failure
    const errMsg = err.message || "Execution failed";
    await prisma.nodeResult.update({
      where: { id: resultRecord.id },
      data: {
        status: "FAILED",
        error: errMsg,
        durationMs: Date.now() - startTime,
      },
    });

    // Notify client
    onStatusUpdate?.(node.id, "failed", undefined, errMsg);
    return false;
  }
}
