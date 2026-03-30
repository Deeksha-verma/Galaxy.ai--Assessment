import { Request, Response } from "express";
import * as executionService from "./execution.service";
import { executeWorkflowSchema } from "./execution.validation";

export const executeWorkflow = async (req: Request, res: Response) => {
  // Set up Server-Sent Events (SSE)
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  
  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flushHeaders(); // Needed for some Node versions/proxies
  };

  try {
    const { workflowId } = req.params;
    const { scope, nodeIds } = executeWorkflowSchema.parse(req.body);

    const runResult = await executionService.executeWorkflow(
      req.userId!,
      workflowId,
      scope,
      nodeIds,
      (nodeId, status, output, error) => {
        // Stream node-level status updates to the React Flow client
        sendEvent("node_status", { nodeId, status, output, error });
      }
    );

    // Stream final run success
    sendEvent("run_complete", runResult);
    res.end();

  } catch (error: any) {
    sendEvent("error", { message: error.message || "Execution failed" });
    res.end();
  }
};
