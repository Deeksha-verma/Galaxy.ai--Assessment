"use client";

import { create } from "zustand";
import type { NodeRunStatus } from "@/types";

type NodeRunState = {
  status: NodeRunStatus;
  result?: { type: string; value: string };
  error?: string;
  startedAt?: number;
};

interface ExecutionState {
  runId: string | null;
  nodeStates: Record<string, NodeRunState>;
  setRunId: (id: string) => void;
  setNodeRunning: (id: string) => void;
  setNodeResult: (id: string, result: { type: string; value: string }) => void;
  setNodeError: (id: string, error: string) => void;
  clearAll: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  runId: null,
  nodeStates: {},

  setRunId: (id) => set({ runId: id }),

  setNodeRunning: (id) =>
    set((s) => ({
      nodeStates: {
        ...s.nodeStates,
        [id]: { status: "running", startedAt: Date.now() },
      },
    })),

  setNodeResult: (id, result) =>
    set((s) => ({
      nodeStates: {
        ...s.nodeStates,
        [id]: { ...s.nodeStates[id], status: "success", result },
      },
    })),

  setNodeError: (id, error) =>
    set((s) => ({
      nodeStates: {
        ...s.nodeStates,
        [id]: { ...s.nodeStates[id], status: "failed", error },
      },
    })),

  clearAll: () => set({ nodeStates: {}, runId: null }),
}));
