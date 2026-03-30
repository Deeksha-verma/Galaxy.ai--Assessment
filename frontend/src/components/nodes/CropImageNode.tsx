"use client";

import React, { useCallback } from "react";
import { useEdges } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { Crop } from "lucide-react";

const ICON = <Crop size={13} />;

const INPUT_HANDLES = [
  { id: "image_url",      label: "image",  handleType: "image" as const },
  { id: "x_percent",      label: "x %",    handleType: "text"  as const },
  { id: "y_percent",      label: "y %",    handleType: "text"  as const },
  { id: "width_percent",  label: "w %",    handleType: "text"  as const },
  { id: "height_percent", label: "h %",    handleType: "text"  as const },
];

const OUTPUT_HANDLES = [{ id: "output", handleType: "image" as const, label: "image" }];

/* ── Subcomponents ── */
function CroppedPreview({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="cropped" style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 6, display: "block" }} />
  );
}

/* ── NumField — connected field shows as read-only and dimmed ── */
interface NumFieldProps {
  label: string;
  fieldKey: string;
  placeholder: string;
  handleId: string;
  value: string | number;
  connected: boolean;
  onChange: (key: string, value: string) => void;
}

function NumField({ label, fieldKey, placeholder, handleId, value, connected, onChange }: NumFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(fieldKey, e.target.value),
    [fieldKey, onChange]
  );

  return (
    <div style={{ opacity: connected ? 0.4 : 1 }}>
      <label className="nf-label">{label}</label>
      <input
        type="number"
        min={0}
        max={100}
        placeholder={placeholder}
        value={value ?? ""}
        disabled={connected}
        onChange={handleChange}
        className="nf-input"
        style={{ resize: "none" }}
      />
    </div>
  );
}

export function CropImageNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const edges          = useEdges();
  const result         = useExecutionStore((s) => s.nodeStates[id]?.result);

  const isConnected = useCallback(
    (handleId: string) => edges.some((e) => e.target === id && e.targetHandle === handleId),
    [edges, id]
  );

  const handleImageUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(id, { image_url: e.target.value }),
    [id, updateNodeData]
  );

  const handleNumChange = useCallback(
    (key: string, value: string) => updateNodeData(id, { [key]: value }),
    [id, updateNodeData]
  );

  const imageConnected = isConnected("image_url");

  return (
    <BaseNode
      id={id}
      icon={ICON}
      label="Crop Image"
      inputHandles={INPUT_HANDLES}
      outputHandles={OUTPUT_HANDLES}
      minWidth={240}
      resultPreview={result?.value ? <CroppedPreview src={result.value} /> : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ opacity: imageConnected ? 0.4 : 1 }}>
          <label className="nf-label">Image URL</label>
          <input
            type="text"
            className="nf-input"
            placeholder="https://…"
            value={data.image_url ?? ""}
            disabled={imageConnected}
            onChange={handleImageUrlChange}
            style={{ resize: "none" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <NumField label="X %" fieldKey="x_percent"      placeholder="0"   handleId="x_percent"      value={data.x_percent}      connected={isConnected("x_percent")}      onChange={handleNumChange} />
          <NumField label="Y %" fieldKey="y_percent"      placeholder="0"   handleId="y_percent"      value={data.y_percent}      connected={isConnected("y_percent")}      onChange={handleNumChange} />
          <NumField label="W %" fieldKey="width_percent"  placeholder="100" handleId="width_percent"  value={data.width_percent}  connected={isConnected("width_percent")}  onChange={handleNumChange} />
          <NumField label="H %" fieldKey="height_percent" placeholder="100" handleId="height_percent" value={data.height_percent} connected={isConnected("height_percent")} onChange={handleNumChange} />
        </div>
      </div>
    </BaseNode>
  );
}
