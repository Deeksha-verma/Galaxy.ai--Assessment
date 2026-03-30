"use client";

import React, { useCallback } from "react";
import { EdgeProps, getBezierPath, BaseEdge } from "@xyflow/react";

export function CustomEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  const stroke       = selected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)";
  const strokeWidth  = selected ? 2 : 1.5;
  const filter       = selected ? "drop-shadow(0 0 6px rgba(255,255,255,0.3))" : "none";

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke,
        strokeWidth,
        filter,
        transition: "stroke 0.2s, stroke-width 0.2s",
      }}
    />
  );
}
