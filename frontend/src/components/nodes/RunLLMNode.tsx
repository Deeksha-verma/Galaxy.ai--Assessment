"use client";

import React, { useCallback } from "react";
import { useEdges } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { Bot } from "lucide-react";

const ICON = <Bot size={13} />;

const INPUT_HANDLES = [
  { id: "system_prompt", label: "system",  handleType: "text"  as const },
  { id: "user_message",  label: "message", handleType: "text"  as const },
  { id: "images",        label: "images",  handleType: "image" as const },
];

const OUTPUT_HANDLES = [{ id: "output", handleType: "output" as const, label: "text" }];

const MODELS = [
  { value: "gemini-2.0-flash",               label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-flash-thinking-exp",  label: "Gemini 2.0 Flash Thinking" },
  { value: "gemini-1.5-pro",                 label: "Gemini 1.5 Pro" },
  { value: "gemini-1.5-flash",               label: "Gemini 1.5 Flash" },
];

/* ── Subcomponents ── */
function ResultText({ value }: { value: string }) {
  const preview = value.length > 200 ? value.slice(0, 200) + "…" : value;
  return (
    <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
      {preview}
    </p>
  );
}

function ErrorText({ message }: { message: string }) {
  return (
    <p style={{ fontSize: 11, color: "var(--status-failed)", margin: 0 }}>
      {message}
    </p>
  );
}

export function RunLLMNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges          = useEdges();
  const result         = useExecutionStore((s) => s.nodeStates[id]?.result);
  const error          = useExecutionStore((s) => s.nodeStates[id]?.error);

  const isConnected = useCallback(
    (handleId: string) => edges.some((e) => e.target === id && e.targetHandle === handleId),
    [edges, id]
  );

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateNodeData(id, { model: e.target.value }),
    [id, updateNodeData]
  );

  const handleSystemPromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => updateNodeData(id, { system_prompt: e.target.value }),
    [id, updateNodeData]
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => updateNodeData(id, { user_message: e.target.value }),
    [id, updateNodeData]
  );

  const systemConnected  = isConnected("system_prompt");
  const messageConnected = isConnected("user_message");

  const resultPreview = result
    ? <ResultText value={String(result.value)} />
    : error
    ? <ErrorText message={error} />
    : undefined;

  return (
    <BaseNode
      id={id}
      icon={ICON}
      label="Run LLM"
      inputHandles={INPUT_HANDLES}
      outputHandles={OUTPUT_HANDLES}
      minWidth={250}
      resultPreview={resultPreview}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <div>
          <label className="nf-label">Model</label>
          <select className="nf-select" value={data.model ?? "gemini-2.0-flash"} onChange={handleModelChange}>
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div style={{ opacity: systemConnected ? 0.4 : 1 }}>
          <label className="nf-label">System Prompt</label>
          <textarea
            className="nf-input"
            rows={2}
            placeholder="You are a helpful assistant…"
            value={data.system_prompt ?? ""}
            disabled={systemConnected}
            onChange={handleSystemPromptChange}
          />
        </div>

        <div style={{ opacity: messageConnected ? 0.4 : 1 }}>
          <label className="nf-label">User Message</label>
          <textarea
            className="nf-input"
            rows={3}
            placeholder="Describe the task…"
            value={data.user_message ?? ""}
            disabled={messageConnected}
            onChange={handleMessageChange}
          />
        </div>
      </div>
    </BaseNode>
  );
}
