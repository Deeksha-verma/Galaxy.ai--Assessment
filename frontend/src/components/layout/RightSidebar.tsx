"use client";

import React, { useState, useCallback } from "react";
import { Clock, ChevronRight, ChevronLeft, FileText, Folder } from "lucide-react";
import { useListHistoryQuery, useGetRunDetailQuery, useListWorkflowsQuery, useLazyGetWorkflowQuery } from "@/services/api";
import { RunItem, RunDetailView } from "@/components/history/RunList";
import { Spinner } from "@/components/ui/Spinner";
import { useWorkflowStore } from "@/store/workflowStore";

interface RightSidebarProps {
  workflowId: string | null;
}

/* ── Empty state ── */
function EmptyMessage({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 11, color: "var(--text-muted)", padding: "20px 14px", textAlign: "center", lineHeight: 1.6 }}>
      {text}
    </p>
  );
}

export function RightSidebar({ workflowId }: RightSidebarProps) {
  const [collapsed,      setCollapsed]      = useState(false);
  const [activeTab,      setActiveTab]      = useState<"history" | "workflows">("history");
  const [selectedRunId,  setSelectedRunId]  = useState<string | null>(null);

  const { setWorkflow } = useWorkflowStore();

  const { data: runs, isLoading: historyLoading, isFetching: historyFetching } = useListHistoryQuery(workflowId ?? "", { 
    skip: activeTab !== "history" || !workflowId 
  });
  const { data: runDetail, isLoading: detailLoading } = useGetRunDetailQuery(selectedRunId ?? "", { 
    skip: !selectedRunId 
  });

  const { data: workflows, isLoading: workflowsLoading } = useListWorkflowsQuery(undefined, {
    skip: activeTab !== "workflows"
  });

  const [triggerGetWorkflow, { isFetching: isLoadingFullWorkflow }] = useLazyGetWorkflowQuery();

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const handleSelectRun = useCallback((id: string) => setSelectedRunId(id), []);
  const handleBack      = useCallback(() => setSelectedRunId(null), []);

  const handleLoadWorkflow = useCallback(async (id: string) => {
    try {
      const full = await triggerGetWorkflow(id).unwrap();
      setWorkflow(full.id, full.name, full.nodes, full.edges);
      setCollapsed(false); // Make sure it's visible after load
    } catch (err) {
      console.error("Failed to load workflow:", err);
    }
  }, [triggerGetWorkflow, setWorkflow]);

  const showEmpty      = activeTab === "history" && !workflowId;
  const showRunDetail  = activeTab === "history" && !!selectedRunId && !!runDetail && !detailLoading;
  const showDetailLoad = activeTab === "history" && !!selectedRunId && detailLoading;
  const showRunList    = activeTab === "history" && (!selectedRunId || (!runDetail && !detailLoading));
  
  const isFetching = activeTab === "history" && historyFetching;
  const isLoading = (activeTab === "history" ? historyLoading : workflowsLoading) || isFetching;

  return (
    <div
      style={{
        width:       collapsed ? 44 : 280,
        background:  "var(--bg-sidebar)",
        borderLeft:  "1px solid var(--border-dim)",
        display:     "flex",
        flexDirection:"column",
        transition:  "width 0.22s ease",
        overflow:    "hidden",
        flexShrink:  0,
        zIndex:      10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display:       "flex",
          alignItems:    "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding:       collapsed ? "12px 10px" : "12px 14px",
          borderBottom:  "1px solid var(--border-dim)",
          flexShrink:    0,
          background:    "var(--bg-panel)",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", gap: 16 }}>
            <button 
              onClick={() => { setActiveTab("history"); setSelectedRunId(null); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                color: activeTab === "history" ? "var(--text-primary)" : "var(--text-muted)",
                transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: 4
              }}
            >
              <Clock size={11} />
              History
            </button>
            <button 
              onClick={() => setActiveTab("workflows")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                color: activeTab === "workflows" ? "var(--text-primary)" : "var(--text-muted)",
                transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: 4
              }}
            >
              <Folder size={11} />
              Workflows
            </button>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "none",
            border:     "none",
            cursor:     "pointer",
            color:      "var(--text-muted)",
            display:    "flex",
            alignItems: "center",
            padding:    4,
            borderRadius: 4,
            transition: "color 0.15s",
          }}
          onMouseEnter={toggleHoverOn}
          onMouseLeave={toggleHoverOff}
        >
          {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {isLoadingFullWorkflow && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
              <Spinner size={30} />
            </div>
          )}

          {activeTab === "history" && (
            <>
              {showEmpty && <EmptyMessage text="Save a workflow to track run history." />}
              {showDetailLoad && (
                <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                  <Spinner size={20} />
                </div>
              )}
              {showRunDetail && (
                <RunDetailView detail={runDetail!} onBack={handleBack} />
              )}
              {!showEmpty && showRunList && (
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {historyLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                      <Spinner size={20} />
                    </div>
                  ) : (Array.isArray(runs) ? runs : ((runs as any)?.data && Array.isArray((runs as any).data)) ? (runs as any).data : []).length === 0 ? (
                    <EmptyMessage text="No runs yet. Hit Run All!" />
                  ) : (
                    (Array.isArray(runs) ? runs : (runs as any).data).map((run: any) => (
                      <RunItem
                        key={run.id}
                        run={run}
                        isSelected={selectedRunId === run.id}
                        onSelect={handleSelectRun}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "workflows" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {workflowsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                  <Spinner size={20} />
                </div>
              ) : !workflows || workflows.length === 0 ? (
                <EmptyMessage text="No saved workflows yet." />
              ) : (
                workflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => handleLoadWorkflow(wf.id)}
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--border-dim)",
                      cursor: "pointer",
                      transition: "background 0.1s",
                      background: wf.id === workflowId ? "var(--bg-hover)" : "transparent"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = wf.id === workflowId ? "var(--bg-hover)" : "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileText size={12} color="var(--accent-blue)" />
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {wf.name}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                      Last updated {new Date(wf.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Hover helpers ── */
function toggleHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-primary)";
}
function toggleHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-muted)";
}
