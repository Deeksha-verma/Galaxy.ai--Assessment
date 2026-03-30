"use client";

import React, { useCallback } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { Type } from "lucide-react";

const ICON = <Type size={13} />;

const OUTPUT_HANDLES = [{ id: "output", handleType: "output" as const, label: "text" }];

function ResultPreview({ value }: { value: string }) {
  const preview = value.length > 100 ? value.slice(0, 100) + "…" : value;
  return (
    <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
      {preview}
    </p>
  );
}

export function TextNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const result         = useExecutionStore((s) => s.nodeStates[id]?.result);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode
      id={id}
      icon={ICON}
      label="Text"
      outputHandles={OUTPUT_HANDLES}
      resultPreview={result ? <ResultPreview value={String(result.value)} /> : undefined}
    >
      <label className="nf-label">Content</label>
      <textarea
        className="nf-input"
        rows={4}
        placeholder="Enter text or prompt…"
        value={data.text ?? ""}
        onChange={handleChange}
        style={{ resize: "vertical" }}
      />
    </BaseNode>
  );
}
