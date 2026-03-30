"use client";

import React, { useState, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { generateId } from "@/lib/utils";
import { Type, ImageIcon, Video, Bot, Crop, Film, ChevronsLeft, ChevronsRight } from "lucide-react";

/* ── Node catalogue ── */
interface NodeDef {
  type: string;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
  description: string;
  defaultData: Record<string, any>;
}

const NODE_CATALOGUE: NodeDef[] = [
  {
    type: "text",
    label: "Text",
    icon: <Type size={14} />,
    accentColor: "var(--handle-text)",
    description: "Static text or prompt",
    defaultData: { text: "" },
  },
  {
    type: "upload-image",
    label: "Upload Image",
    icon: <ImageIcon size={14} />,
    accentColor: "var(--handle-image)",
    description: "Upload or link an image",
    defaultData: { imageUrl: "" },
  },
  {
    type: "upload-video",
    label: "Upload Video",
    icon: <Video size={14} />,
    accentColor: "var(--handle-video)",
    description: "Upload or link a video",
    defaultData: { videoUrl: "" },
  },
  {
    type: "llm",
    label: "Run LLM",
    icon: <Bot size={14} />,
    accentColor: "var(--accent-purple)",
    description: "Gemini AI inference",
    defaultData: { model: "gemini-2.0-flash", system_prompt: "", user_message: "" },
  },
  {
    type: "crop-image",
    label: "Crop Image",
    icon: <Crop size={14} />,
    accentColor: "var(--handle-image)",
    description: "Crop image by %",
    defaultData: { x_percent: 0, y_percent: 0, width_percent: 100, height_percent: 100 },
  },
  {
    type: "extract-frame",
    label: "Extract Frame",
    icon: <Film size={14} />,
    accentColor: "var(--handle-image)",
    description: "Pull frame from video",
    defaultData: { timestamp: "50%" },
  },
];

/* ── NodeButton subcomponent ── */
interface NodeButtonProps {
  def: NodeDef;
  collapsed: boolean;
  onAdd: (def: NodeDef) => void;
}

function NodeButton({ def, collapsed, onAdd }: NodeButtonProps) {
  const handleClick  = useCallback(() => onAdd(def), [def, onAdd]);
  const handleEnter  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = def.accentColor;
    e.currentTarget.style.background  = "var(--bg-hover)";
  }, [def.accentColor]);
  const handleLeave  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--border-dim)";
    e.currentTarget.style.background  = "transparent";
  }, []);

  if (collapsed) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        title={def.label}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          36,
          height:         36,
          background:     "transparent",
          border:         "1px solid var(--border-dim)",
          borderRadius:   8,
          color:          def.accentColor,
          cursor:         "pointer",
          transition:     "background 0.15s, border-color 0.15s",
          flexShrink:     0,
        }}
      >
        {def.icon}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        10,
        width:      "100%",
        padding:    "8px 10px",
        background: "transparent",
        border:     "1px solid var(--border-dim)",
        borderRadius: 8,
        cursor:     "pointer",
        color:      "var(--text-primary)",
        textAlign:  "left",
        transition: "background 0.15s, border-color 0.2s",
      }}
    >
      <span style={{ color: def.accentColor, display: "flex", flexShrink: 0 }}>{def.icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{def.label}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>{def.description}</div>
      </div>
    </button>
  );
}

/* ── LeftSidebar ── */
export function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { screenToFlowPosition }  = useReactFlow();
  const addNode                   = useWorkflowStore((s) => s.addNode);

  const handleAddNode = useCallback(
    (def: NodeDef) => {
      const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      addNode({
        id:       generateId(),
        type:     def.type,
        position: {
          x: position.x + (Math.random() - 0.5) * 160,
          y: position.y + (Math.random() - 0.5) * 160,
        },
        data: { ...def.defaultData, label: def.label },
      });
    },
    [screenToFlowPosition, addNode]
  );

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <div
      style={{
        width:      collapsed ? 56 : 220,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-dim)",
        display:    "flex",
        flexDirection: "column",
        transition: "width 0.22s ease",
        overflow:   "hidden",
        flexShrink: 0,
        zIndex:     10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding:      collapsed ? "12px 10px" : "12px 14px",
          borderBottom: "1px solid var(--border-dim)",
          flexShrink:   0,
        }}
      >
        {!collapsed && (
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Nodes
          </span>
        )}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand" : "Collapse"}
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
          onMouseEnter={collapseHoverOn}
          onMouseLeave={collapseHoverOff}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>

      {/* Node list */}
      <div
        style={{
          flex:      1,
          overflowY: "auto",
          padding:   collapsed ? "10px 10px" : "10px 10px",
          display:   "flex",
          flexDirection: "column",
          gap:       5,
          alignItems: collapsed ? "center" : "stretch",
        }}
      >
        {NODE_CATALOGUE.map((def) => (
          <NodeButton key={def.type} def={def} collapsed={collapsed} onAdd={handleAddNode} />
        ))}
      </div>
    </div>
  );
}

/* ── Hover helpers ── */
function collapseHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-primary)";
}
function collapseHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "var(--text-muted)";
}
