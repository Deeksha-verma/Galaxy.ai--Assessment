"use client";

import React, { useCallback, useRef, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useUser } from "@clerk/nextjs";
import { Save, Play, Undo2, Redo2, Download, Upload, PlayCircle, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { Spinner } from "@/components/ui/Spinner";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { useCreateWorkflowMutation, useUpdateWorkflowMutation } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

/* ────────────────────────────────────────
   Sub-components
─────────────────────────────────────── */

interface TBtnProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  primary?: boolean;
}

function TBtn({ onClick, title, children, disabled = false, primary = false }: TBtnProps) {
  const handleEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (primary) {
        e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.45)";
        e.currentTarget.style.opacity = "0.95";
      } else {
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.background = "var(--bg-hover)";
      }
    }
  }, [disabled, primary]);

  const handleLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (primary) {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(59, 130, 246, 0.39)";
      e.currentTarget.style.opacity = "1";
    } else {
      e.currentTarget.style.borderColor = "var(--border-subtle)";
      e.currentTarget.style.background = "var(--bg-node-head)";
    }
  }, [primary]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      title={title}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: primary ? "6px 16px" : "5px 12px",
        background: primary
          ? "linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)"
          : "var(--bg-node-head)",
        border: `1px solid ${primary ? "rgba(255,255,255,0.15)" : "var(--border-subtle)"}`,
        borderRadius: "var(--r-pill)",
        color: primary ? "#ffffff" : "var(--text-primary)",
        boxShadow: primary ? "0 4px 14px 0 rgba(59, 130, 246, 0.39)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 18,
        background: "var(--border-subtle)",
        flexShrink: 0,
        margin: "0 2px",
      }}
    />
  );
}

/* ────────────────────────────────────────
   Page
─────────────────────────────────────── */

export default function WorkflowPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const { nodes, edges, workflowId, workflowName, setWorkflowName, setWorkflow } = useWorkflowStore();
  const { clearAll, setNodeRunning, setNodeResult, setNodeError, setRunId } = useExecutionStore();

  const [createWorkflow] = useCreateWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  /* ── Undo / Redo ── */
  const handleUndo = useCallback(() => useWorkflowStore.temporal.getState().undo(), []);
  const handleRedo = useCallback(() => useWorkflowStore.temporal.getState().redo(), []);

  /* ── Workflow name change ── */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setWorkflowName(e.target.value),
    [setWorkflowName]
  );

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMsg("");
    try {
      if (workflowId) {
        await updateWorkflow({ id: workflowId, name: workflowName, nodes, edges }).unwrap();
      } else {
        const result = await createWorkflow({ name: workflowName, nodes, edges }).unwrap();
        setWorkflow(result.id, result.name, nodes, edges);
      }
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch {
      setSaveMsg("Failed");
      setTimeout(() => setSaveMsg(""), 2500);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, workflowId, workflowName, nodes, edges, createWorkflow, updateWorkflow, setWorkflow]);

  /* ── Export ── */
  const handleExport = useCallback(() => {
    const json = JSON.stringify({ version: "1.0", name: workflowName, nodes, edges }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowName, nodes, edges]);

  /* ── Trigger import file dialog ── */
  const triggerImport = useCallback(() => { fileInputRef.current?.click(); }, []);

  /* ── Import ── */
  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          setWorkflow(workflowId ?? "", data.name ?? "Imported Workflow", data.nodes ?? [], data.edges ?? []);
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [workflowId, setWorkflow]
  );

  /* ── Run (fetch + ReadableStream SSE) ── */
  const handleRun = useCallback(
    async (scope: "full" | "partial" | "single") => {
      if (!workflowId) { alert("Save the workflow first."); return; }
      if (isRunning) return;
      clearAll();
      setIsRunning(true);

      try {
        const token = await (window as any).Clerk?.session?.getToken();

        const response = await fetch(`${API_BASE}/execute/${workflowId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ scope, nodeIds: [] }),
        });

        if (!response.ok || !response.body) throw new Error("Run request failed");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            try {
              const parsed = JSON.parse(line.slice(5).trim());
              if (parsed.nodeId !== undefined) {
                const { nodeId, status, output, error } = parsed;
                if (status === "running") setNodeRunning(nodeId);
                else if (status === "success") setNodeResult(nodeId, output);
                else if (status === "failed") setNodeError(nodeId, error);
              }
              if (parsed.id && parsed.status) setRunId(parsed.id);
            } catch { /* ignore non-JSON lines */ }
          }
        }
      } catch (err) {
        console.error("Run error:", err);
      } finally {
        setIsRunning(false);
      }
    },
    [workflowId, isRunning, clearAll, setNodeRunning, setNodeResult, setNodeError, setRunId]
  );

  const handleRunAll = useCallback(() => handleRun("full"), [handleRun]);
  const handleRunSelection = useCallback(() => handleRun("partial"), [handleRun]);
  const handleSignOut = useCallback(() => signOut({ redirectUrl: "/sign-in" }), [signOut]);

  const saveMsgColor = saveMsg === "Saved" ? "var(--status-success)" : "var(--status-failed)";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-canvas)",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar (NextFlow-style: minimal, transparent-ish) ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          height: 46,
          background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border-dim)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
            marginRight: 4,
          }}
        >
          N
        </div>

        {/* Workflow name */}
        <input
          type="text"
          value={workflowName}
          onChange={handleNameChange}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 13,
            fontWeight: 600,
            padding: "3px 6px",
            borderRadius: 4,
            fontFamily: "inherit",
            minWidth: 120,
            maxWidth: 220,
            transition: "background 0.15s",
          }}
          onFocus={nameInputFocus}
          onBlur={nameInputBlur}
        />

        <Divider />

        {/* Save */}
        <TBtn onClick={handleSave} title="Save (Ctrl+S)" disabled={isSaving}>
          {isSaving ? <Spinner size={12} /> : <Save size={12} />}
          {isSaving ? "Saving…" : "Save"}
        </TBtn>
        {saveMsg && (
          <span style={{ fontSize: 11, color: saveMsgColor, fontWeight: 500 }}>{saveMsg}</span>
        )}

        {/* Export / Import */}
        <TBtn onClick={handleExport} title="Export JSON">
          <Download size={12} />
          Export
        </TBtn>
        <TBtn onClick={triggerImport} title="Import JSON">
          <Upload size={12} />
          Import
        </TBtn>
        <input ref={fileInputRef} type="file" accept=".json,application/json" style={{ display: "none" }} onChange={handleImport} />

        <Divider />

        {/* Undo / Redo */}
        <TBtn onClick={handleUndo} title="Undo"><Undo2 size={12} /></TBtn>
        <TBtn onClick={handleRedo} title="Redo"><Redo2 size={12} /></TBtn>

        <Divider />

        {/* Run */}
        <TBtn onClick={handleRunSelection} title="Run selected nodes" disabled={isRunning}>
          <Play size={12} />
          Run Selection
        </TBtn>
        <TBtn onClick={handleRunAll} title="Run all nodes" disabled={isRunning} primary>
          {isRunning ? <Spinner size={12} /> : <PlayCircle size={12} />}
          {isRunning ? "Running…" : "Run All"}
        </TBtn>

        {/* Spacer + user */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {user && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.primaryEmailAddress?.emailAddress}
            </span>
          )}
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s",
              padding: 4,
              borderRadius: 4,
            }}
            onMouseEnter={signOutHoverOn}
            onMouseLeave={signOutHoverOff}
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* ── Canvas area ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <ReactFlowProvider>
          <LeftSidebar />
          <WorkflowCanvas />
          <RightSidebar workflowId={workflowId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

/* ── Module-level hover helpers ── */
function signOutHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--status-failed)";
}
function signOutHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-muted)";
}

function nameInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.background = "var(--bg-hover)";
}
function nameInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.background = "transparent";
}

