// Shared types across frontend

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  nodes: any[];
  edges: any[];
  thumbnail?: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRun {
  id: string;
  runNumber: number;
  workflowId: string;
  userId: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
  scope: "FULL" | "PARTIAL" | "SINGLE";
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}

export interface NodeResult {
  id: string;
  runId: string;
  nodeId: string;
  nodeType: string;
  nodeLabel?: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  inputs?: Record<string, any>;
  output?: { type: "text" | "image" | "video"; value: string };
  error?: string;
  durationMs?: number;
  startedAt: string;
}

export interface RunDetail extends WorkflowRun {
  nodeResults: NodeResult[];
}

export type NodeRunStatus = "idle" | "running" | "success" | "failed";
