"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import { isValidConnection } from "@/lib/connection-rules";
import { CustomEdge } from "./CustomEdge";
import { TextNode }         from "@/components/nodes/TextNode";
import { UploadImageNode }  from "@/components/nodes/UploadImageNode";
import { UploadVideoNode }  from "@/components/nodes/UploadVideoNode";
import { RunLLMNode }       from "@/components/nodes/RunLLMNode";
import { CropImageNode }    from "@/components/nodes/CropImageNode";
import { ExtractFrameNode } from "@/components/nodes/ExtractFrameNode";

/* ── Static maps (frozen so React Flow doesn't re-register) ── */
const nodeTypes = Object.freeze({
  text:            TextNode,
  "upload-image":  UploadImageNode,
  "upload-video":  UploadVideoNode,
  llm:             RunLLMNode,
  "crop-image":    CropImageNode,
  "extract-frame": ExtractFrameNode,
});

const edgeTypes    = Object.freeze({ custom: CustomEdge });
const defaultEdge  = Object.freeze({ animated: false, type: "custom" });

/* ── MiniMap node color lookup ── */
const MINIMAP_COLOR: Record<string, string> = {
  text:            "rgba(96,165,250,0.5)",
  "upload-image":  "rgba(52,211,153,0.5)",
  "upload-video":  "rgba(251,146,60,0.5)",
  llm:             "rgba(192,132,252,0.5)",
  "crop-image":    "rgba(52,211,153,0.5)",
  "extract-frame": "rgba(52,211,153,0.5)",
};

function nodeColor(node: Node) {
  return MINIMAP_COLOR[node.type ?? ""] ?? "rgba(255,255,255,0.1)";
}

/* ── Canvas ── */
export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useWorkflowStore();

  const handleConnect = useCallback(
    (conn: Connection) => {
      if (isValidConnection(conn, nodes as Node[])) onConnect(conn);
    },
    [nodes, onConnect]
  );

  const validateConnection = useCallback(
    (conn: Connection) => isValidConnection(conn as Connection, nodes as Node[]),
    [nodes]
  );

  return (
    <div style={{ flex: 1, height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes}
        isValidConnection={validateConnection as any}
        defaultEdgeOptions={defaultEdge}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode="Delete"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls style={{ bottom: 20, left: 20 }} />
        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(0,0,0,0.7)"
          style={{ bottom: 20, right: 20 }}
        />
      </ReactFlow>
    </div>
  );
}
