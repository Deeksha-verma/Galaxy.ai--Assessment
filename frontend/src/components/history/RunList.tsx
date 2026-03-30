"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDuration, formatDate } from "@/lib/utils";
import type { NodeResult, RunDetail, WorkflowRun } from "@/types";
import type { BadgeVariant } from "@/components/ui/Badge";

/* ── Status helpers (lookup tables, no logic in render) ── */
const STATUS_BADGE: Record<string, BadgeVariant> = {
  RUNNING:  "running",
  SUCCESS:  "success",
  FAILED:   "failed",
  PARTIAL:  "partial",
  SKIPPED:  "skipped",
};

function toBadge(status: string): BadgeVariant {
  return STATUS_BADGE[status] ?? "idle";
}

/* ── RunItem ── */
interface RunItemProps {
  run: WorkflowRun;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function itemHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  if (el.dataset.selected !== "true") el.style.background = "var(--bg-hover)";
}
function itemHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  if (el.dataset.selected !== "true") el.style.background = "transparent";
}

export function RunItem({ run, isSelected, onSelect }: RunItemProps) {
  const handleClick = useCallback(() => onSelect(run.id), [run.id, onSelect]);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={itemHoverOn}
      onMouseLeave={itemHoverOff}
      data-selected={isSelected ? "true" : "false"}
      style={{
        width:         "100%",
        textAlign:     "left",
        background:    isSelected ? "var(--bg-hover)" : "transparent",
        border:        "none",
        borderBottom:  "1px solid var(--border-dim)",
        padding:       "10px 14px",
        cursor:        "pointer",
        display:       "flex",
        flexDirection: "column",
        gap:           4,
        transition:    "background 0.12s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
          Run #{run.runNumber}
        </span>
        <Badge variant={toBadge(run.status)} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          {formatDate(run.startedAt)}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          {formatDuration(run.durationMs)}
        </span>
      </div>
    </button>
  );
}

/* ── NodeResultRow ── */
interface NodeResultRowProps {
  result: NodeResult;
}

function NodeResultRow({ result }: NodeResultRowProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const hasTextOutput  = result.output?.type === "text"  && !!result.output.value;
  const hasImageOutput = result.output?.type === "image" && !!result.output.value;

  return (
    <div
      style={{
        border:       "1px solid var(--border-dim)",
        borderRadius: 7,
        marginBottom: 5,
        overflow:     "hidden",
      }}
    >
      <button
        onClick={toggle}
        style={{
          width:      "100%",
          display:    "flex",
          alignItems: "center",
          gap:        6,
          padding:    "7px 10px",
          background: "var(--bg-node-head)",
          border:     "none",
          cursor:     "pointer",
          color:      "var(--text-primary)",
          textAlign:  "left",
          transition: "background 0.12s",
        }}
      >
        <span style={{ color: "var(--text-muted)", display: "flex" }}>
          {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </span>
        <span style={{ fontSize: 11, flex: 1, color: "var(--text-secondary)" }}>
          {result.nodeLabel ?? result.nodeType}
        </span>
        <Badge variant={toBadge(result.status)} />
        <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>
          {formatDuration(result.durationMs)}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            padding:    "9px 10px",
            background: "var(--bg-panel)",
            borderTop:  "1px solid var(--border-dim)",
          }}
        >
          {hasTextOutput && (
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
              {result.output!.value.slice(0, 300)}
              {result.output!.value.length > 300 ? "…" : ""}
            </p>
          )}
          {hasImageOutput && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.output!.value} alt="output" style={{ width: "100%", borderRadius: 5, maxHeight: 120, objectFit: "cover", display: "block" }} />
          )}
          {result.error && (
            <p style={{ fontSize: 11, color: "var(--status-failed)", margin: 0 }}>
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── RunDetailView ── */
interface RunDetailViewProps {
  detail: RunDetail;
  onBack: () => void;
}

export function RunDetailView({ detail, onBack }: RunDetailViewProps) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background:   "none",
          border:       "none",
          borderBottom: "1px solid var(--border-dim)",
          padding:      "9px 14px",
          cursor:       "pointer",
          color:        "var(--text-secondary)",
          fontSize:     11,
          textAlign:    "left",
          display:      "flex",
          alignItems:   "center",
          gap:          4,
          transition:   "color 0.15s",
          fontFamily:   "inherit",
        }}
        onMouseEnter={backHoverOn}
        onMouseLeave={backHoverOff}
      >
        ← Back
      </button>

      {/* Run summary */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-dim)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Run #{detail.runNumber}</span>
          <Badge variant={toBadge(detail.status)} />
        </div>
        <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "4px 0 0" }}>
          {formatDate(detail.startedAt)} · {formatDuration(detail.durationMs)}
        </p>
      </div>

      {/* Node results */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {detail.nodeResults?.map((r) => (
          <NodeResultRow key={r.id} result={r} />
        ))}
      </div>
    </div>
  );
}

/* ── Hover helpers ── */
function backHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-primary)";
}
function backHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-secondary)";
}
