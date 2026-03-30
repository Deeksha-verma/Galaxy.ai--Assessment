"use client";

import React, { useCallback } from "react";
import { useEdges } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { Film } from "lucide-react";

const ICON = <Film size={13} />;

const INPUT_HANDLES = [
  { id: "video_url",  label: "video", handleType: "video" as const },
  { id: "timestamp",  label: "time",  handleType: "text"  as const },
];

const OUTPUT_HANDLES = [{ id: "output", handleType: "image" as const, label: "frame" }];

/* ── Subcomponent ── */
function FramePreview({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="frame" style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 6, display: "block" }} />
  );
}

export function ExtractFrameNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges          = useEdges();
  const result         = useExecutionStore((s) => s.nodeStates[id]?.result);

  const isConnected = useCallback(
    (handleId: string) => edges.some((e) => e.target === id && e.targetHandle === handleId),
    [edges, id]
  );

  const handleVideoUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(id, { video_url: e.target.value }),
    [id, updateNodeData]
  );

  const handleTimestampChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(id, { timestamp: e.target.value }),
    [id, updateNodeData]
  );

  const videoConnected     = isConnected("video_url");
  const timestampConnected = isConnected("timestamp");

  return (
    <BaseNode
      id={id}
      icon={ICON}
      label="Extract Frame"
      inputHandles={INPUT_HANDLES}
      outputHandles={OUTPUT_HANDLES}
      minWidth={230}
      resultPreview={result?.value ? <FramePreview src={result.value} /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ opacity: videoConnected ? 0.4 : 1 }}>
          <label className="nf-label">Video URL</label>
          <input
            type="text"
            className="nf-input"
            placeholder="https://…"
            value={data.video_url ?? ""}
            disabled={videoConnected}
            onChange={handleVideoUrlChange}
            style={{ resize: "none" }}
          />
        </div>

        <div style={{ opacity: timestampConnected ? 0.4 : 1 }}>
          <label className="nf-label">Timestamp (s or "50%")</label>
          <input
            type="text"
            className="nf-input"
            placeholder='e.g. 5 or "50%"'
            value={data.timestamp ?? ""}
            disabled={timestampConnected}
            onChange={handleTimestampChange}
            style={{ resize: "none" }}
          />
        </div>
      </div>
    </BaseNode>
  );
}
