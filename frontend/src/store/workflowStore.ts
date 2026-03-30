"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  workflowId: string | null;
  workflowName: string;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  setWorkflow: (
    id: string,
    name: string,
    nodes: Node[],
    edges: Edge[]
  ) => void;
  setWorkflowName: (name: string) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  temporal((set) => ({
    nodes: [],
    edges: [],
    workflowId: null,
    workflowName: "Untitled Workflow",

    onNodesChange: (changes) =>
      set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

    onEdgesChange: (changes) =>
      set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

    onConnect: (conn) =>
      set((s) => ({
        edges: addEdge(
          {
            ...conn,
            animated: true,
            type: "custom",
            style: { stroke: "#7c3aed", strokeWidth: 2 },
          },
          s.edges
        ),
      })),

    addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

    updateNodeData: (id, data) =>
      set((s) => ({
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        ),
      })),

    setWorkflow: (id, name, nodes, edges) =>
      set({ workflowId: id, workflowName: name, nodes, edges }),

    setWorkflowName: (name) => set({ workflowName: name }),

    reset: () =>
      set({
        nodes: [],
        edges: [],
        workflowId: null,
        workflowName: "Untitled Workflow",
      }),
  }))
);

// Undo/redo:
// useWorkflowStore.temporal.getState().undo()
// useWorkflowStore.temporal.getState().redo()
