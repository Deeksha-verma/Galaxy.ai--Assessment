"use client";

import React, { useCallback, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { useExecutionStore } from "@/store/executionStore";
import { ImageIcon, Upload, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const ICON           = <ImageIcon size={13} />;
const OUTPUT_HANDLES = [{ id: "output", handleType: "image" as const, label: "image" }];

function UploadZone({ onUpload, isLoading }: { onUpload: () => void; isLoading: boolean }) {
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--handle-image)";
    e.currentTarget.style.color       = "var(--handle-image)";
  }, []);
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--border-subtle)";
    e.currentTarget.style.color       = "var(--text-muted)";
  }, []);

  return (
    <button
      onClick={onUpload}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            6,
        width:          "100%",
        padding:        "18px 0",
        border:         "1.5px dashed var(--border-subtle)",
        borderRadius:   "var(--r-input)",
        background:     "var(--bg-input)",
        color:          "var(--text-muted)",
        cursor:         isLoading ? "default" : "pointer",
        fontSize:       11,
        transition:     "border-color 0.2s, color 0.2s",
        opacity:        isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? <Spinner size={16} /> : <Upload size={16} />}
      {isLoading ? "Uploading..." : "Click to upload image"}
    </button>
  );
}

function PreviewBadge({ onClear }: { onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      title="Remove image"
      style={{
        position:     "absolute",
        top:          5,
        right:        5,
        background:   "rgba(0,0,0,0.75)",
        border:       "none",
        borderRadius: 4,
        color:        "#fff",
        cursor:       "pointer",
        padding:      "2px 6px",
        fontSize:     11,
        display:      "flex",
        alignItems:   "center",
      }}
    >
      <X size={11} />
    </button>
  );
}

export function UploadImageNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const result         = useExecutionStore((s) => s.nodeStates[id]?.result);
  const fileRef        = useRef<HTMLInputElement>(null);

  const preview = result?.value ?? data.imageUrl;

  const [isUploading, setIsUploading] = React.useState(false);
  const triggerFileInput = useCallback(() => { fileRef.current?.click(); }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const response = await fetch(`${API_BASE.replace("/v1", "")}/v1/upload`, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!response.ok) throw new Error("Upload failed");
        const { url } = await response.json();
        updateNodeData(id, { imageUrl: url });
      } catch (err) {
        console.error(err);
        alert("Upload failed. Make sure the backend is running.");
      } finally {
        setIsUploading(false);
      }
    },
    [id, updateNodeData]
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { imageUrl: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleClear = useCallback(() => {
    updateNodeData(id, { imageUrl: "" });
  }, [id, updateNodeData]);

  return (
    <BaseNode id={id} icon={ICON} label="Upload Image" outputHandles={OUTPUT_HANDLES} minWidth={240}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {preview ? (
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6, display: "block" }}
            />
            <PreviewBadge onClear={handleClear} />
          </div>
        ) : (
          <UploadZone onUpload={triggerFileInput} isLoading={isUploading} />
        )}

        <div>
          <label className="nf-label">Or paste URL</label>
          <input
            type="text"
            className="nf-input"
            placeholder="https://…"
            value={data.imageUrl ?? ""}
            onChange={handleUrlChange}
            style={{ resize: "none" }}
          />
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
      </div>
    </BaseNode>
  );
}
