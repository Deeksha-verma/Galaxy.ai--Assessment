"use client";

import React, { useCallback } from "react";
import { Position, useReactFlow, Handle } from "@xyflow/react";
import { useExecutionStore } from "@/store/executionStore";
import { Spinner } from "@/components/ui/Spinner";
import { X } from "lucide-react";

/* ── Handle type definitions ── */
export interface InputHandleDef {
  id: string;
  label: string;
  handleType: "text" | "image" | "video";
}
export interface OutputHandleDef {
  id: string;
  label?: string;
  handleType: "text" | "image" | "video" | "output";
}

/* ── Helper maps (no logic in JSX) ── */
const HANDLE_COLOR: Record<string, string> = {
  text:   "var(--handle-text)",
  image:  "var(--handle-image)",
  video:  "var(--handle-video)",
  output: "var(--handle-output)",
};

const STATUS_BORDER: Record<string, string> = {
  running: "var(--accent-purple)",
  success: "var(--status-success)",
  failed:  "var(--status-failed)",
  idle:    "var(--border-subtle)",
};

const STATUS_CLASS: Record<string, string> = {
  running: "node-running",
  success: "node-success",
  failed:  "node-failed",
  idle:    "",
};

/* ── Shared hover helpers — defined outside component to prevent re-creation ── */
function onDeleteEnter(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--status-failed)";
}
function onDeleteLeave(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-muted)";
}

/* ── InlineHandle ── */
interface InlineHandleProps {
  id: string;
  type: "source" | "target";
  position: Position;
  handleType: string;
  label?: string;
}

function InlineHandle({ id, type, position, handleType, label }: InlineHandleProps) {
  const color  = HANDLE_COLOR[handleType] ?? "#888";
  const isLeft = position === Position.Left;

  return (
    <div
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           7,
        flexDirection: isLeft ? "row" : "row-reverse",
        paddingInline: 12,
        marginBottom:  6,
      }}
    >
      {label && (
        <span
          style={{
            fontSize:    10,
            color:       "var(--text-secondary)",
            userSelect:  "none",
            flex:        1,
            textAlign:   isLeft ? "left" : "right",
          }}
        >
          {label}
        </span>
      )}
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          position:   "relative",
          transform:  "none",
          top:        "auto",
          left:       "auto",
          right:      "auto",
          width:      8,
          height:     8,
          borderRadius: "50%",
          background:  color,
          border:      `1.5px solid ${color}`,
          boxShadow:   `0 0 8px ${color}55`,
          flexShrink:  0,
          cursor:      "crosshair",
        }}
      />
    </div>
  );
}

/* ── BaseNode ── */
export interface BaseNodeProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  inputHandles?: InputHandleDef[];
  outputHandles?: OutputHandleDef[];
  children: React.ReactNode;
  resultPreview?: React.ReactNode;
  minWidth?: number;
}

export function BaseNode({
  id,
  icon,
  label,
  inputHandles = [],
  outputHandles = [],
  children,
  resultPreview,
  minWidth = 220,
}: BaseNodeProps) {
  const { deleteElements } = useReactFlow();
  const nodeState  = useExecutionStore((s) => s.nodeStates[id]);
  const status     = nodeState?.status ?? "idle";
  const borderColor = STATUS_BORDER[status] ?? STATUS_BORDER.idle;
  const glowClass   = STATUS_CLASS[status]  ?? "";

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div
      className={glowClass}
      style={{
        minWidth,
        background:   "var(--bg-node)",
        border:       `1px solid ${borderColor}`,
        borderRadius: "var(--r-node)",
        overflow:     "hidden",
        boxShadow:    "0 4px 40px rgba(0,0,0,0.7)",
        transition:   "border-color 0.3s ease",
        fontFamily:   "inherit",
      }}
    >
      {/* Header */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          padding:      "8px 10px",
          background:   "var(--bg-node-head)",
          borderBottom: "1px solid var(--border-dim)",
          userSelect:   "none",
        }}
      >
        <span style={{ color: "var(--text-secondary)", display: "flex", flexShrink: 0, width: 14, height: 14, alignItems: "center", justifyContent: "center" }}>
          {status === "running" ? <Spinner size={12} /> : icon}
        </span>
        <span
          style={{
            flex:        1,
            fontSize:    11,
            fontWeight:  600,
            color:       "var(--text-primary)",
            whiteSpace:  "nowrap",
            overflow:    "hidden",
            textOverflow:"ellipsis",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </span>
        <button
          onClick={handleDelete}
          onMouseEnter={onDeleteEnter}
          onMouseLeave={onDeleteLeave}
          title="Remove node"
          style={{
            background:  "none",
            border:      "none",
            cursor:      "pointer",
            color:       "var(--text-muted)",
            display:     "flex",
            alignItems:  "center",
            padding:     2,
            borderRadius:4,
            transition:  "color 0.15s",
            flexShrink:  0,
          }}
        >
          <X size={11} />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: "flex" }}>
        {/* Input handles */}
        {inputHandles.length > 0 && (
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              justifyContent: "center",
              paddingBlock:   12,
            }}
          >
            {inputHandles.map((h) => (
              <InlineHandle key={h.id} id={h.id} type="target" position={Position.Left} handleType={h.handleType} label={h.label} />
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: "11px 12px", minWidth: 0 }}>{children}</div>

        {/* Output handles */}
        {outputHandles.length > 0 && (
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              justifyContent: "center",
              paddingBlock:   12,
            }}
          >
            {outputHandles.map((h) => (
              <InlineHandle key={h.id} id={h.id} type="source" position={Position.Right} handleType={h.handleType} label={h.label} />
            ))}
          </div>
        )}
      </div>

      {/* Result preview */}
      {resultPreview && (
        <div
          style={{
            borderTop:  "1px solid var(--border-dim)",
            padding:    "10px 12px",
            background: "var(--bg-node-head)",
          }}
        >
          {resultPreview}
        </div>
      )}
    </div>
  );
}
