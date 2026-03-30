"use client";

import React, { useCallback, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import { Video, Upload, X } from "lucide-react";

const ICON           = <Video size={13} />;
const OUTPUT_HANDLES = [{ id: "output", handleType: "video" as const, label: "video" }];

/* ── Subcomponents ── */
function VideoUploadZone({ onUpload }: { onUpload: () => void }) {
  const handleEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--handle-video)";
    e.currentTarget.style.color       = "var(--handle-video)";
  }, []);
  const handleLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--border-subtle)";
    e.currentTarget.style.color       = "var(--text-muted)";
  }, []);

  return (
    <button
      onClick={onUpload}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
        cursor:         "pointer",
        fontSize:       11,
        transition:     "border-color 0.2s, color 0.2s",
      }}
    >
      <Upload size={16} />
      Click to upload video
    </button>
  );
}

export function UploadVideoNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const fileRef        = useRef<HTMLInputElement>(null);
  const preview        = data.videoUrl;

  const triggerFileInput = useCallback(() => { fileRef.current?.click(); }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      updateNodeData(id, { videoUrl: URL.createObjectURL(file) });
    },
    [id, updateNodeData]
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { videoUrl: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleClear = useCallback(() => {
    updateNodeData(id, { videoUrl: "" });
  }, [id, updateNodeData]);

  return (
    <BaseNode id={id} icon={ICON} label="Upload Video" outputHandles={OUTPUT_HANDLES} minWidth={240}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {preview ? (
          <div style={{ position: "relative" }}>
            <video
              src={preview}
              controls
              style={{ width: "100%", maxHeight: 130, borderRadius: 6, display: "block", background: "#000" }}
            />
            <button
              onClick={handleClear}
              title="Remove video"
              style={{
                position: "absolute", top: 5, right: 5,
                background: "rgba(0,0,0,0.75)", border: "none",
                borderRadius: 4, color: "#fff", cursor: "pointer",
                padding: "2px 6px", fontSize: 11, display: "flex", alignItems: "center",
              }}
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <VideoUploadZone onUpload={triggerFileInput} />
        )}

        <div>
          <label className="nf-label">Or paste URL</label>
          <input
            type="text"
            className="nf-input"
            placeholder="https://…"
            value={data.videoUrl ?? ""}
            onChange={handleUrlChange}
            style={{ resize: "none" }}
          />
        </div>

        <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
      </div>
    </BaseNode>
  );
}
