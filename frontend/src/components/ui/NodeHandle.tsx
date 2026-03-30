"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";

interface NodeHandleProps {
  type: "source" | "target";
  position: Position;
  id: string;
  handleType: "text" | "image" | "video" | "output";
  label?: string;
  style?: React.CSSProperties;
  isConnectable?: boolean;
}

const COLOR: Record<string, string> = {
  text: "var(--handle-text)",
  image: "var(--handle-image)",
  video: "var(--handle-video)",
  output: "var(--handle-output)",
};

export function NodeHandle({
  type,
  position,
  id,
  handleType,
  label,
  style,
  isConnectable = true,
}: NodeHandleProps) {
  const color = COLOR[handleType];
  const isLeft = position === Position.Left;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexDirection: isLeft ? "row" : "row-reverse",
        marginBottom: 4,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            userSelect: "none",
            textAlign: isLeft ? "left" : "right",
          }}
        >
          {label}
        </span>
      )}
      <Handle
        type={type}
        position={position}
        id={id}
        isConnectable={isConnectable}
        style={{
          position: "relative",
          transform: "none",
          top: "auto",
          left: "auto",
          right: "auto",
          background: color,
          border: `2px solid ${color}`,
          width: 10,
          height: 10,
          borderRadius: "50%",
          boxShadow: `0 0 6px ${color}88`,
          cursor: "crosshair",
          flexShrink: 0,
          ...style,
        }}
      />
    </div>
  );
}
