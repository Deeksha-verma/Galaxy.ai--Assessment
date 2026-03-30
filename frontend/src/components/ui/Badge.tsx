"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "running"
  | "success"
  | "failed"
  | "partial"
  | "skipped"
  | "idle";

const variantStyles: Record<BadgeVariant, string> = {
  running: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  partial: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  skipped: "bg-zinc-600/20 text-zinc-400 border-zinc-600/30",
  idle: "bg-zinc-800/50 text-zinc-500 border-zinc-700/30",
};

const variantDot: Record<BadgeVariant, string> = {
  running: "bg-amber-400 animate-pulse",
  success: "bg-emerald-400",
  failed: "bg-red-400",
  partial: "bg-orange-400",
  skipped: "bg-zinc-600",
  idle: "bg-zinc-600",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  const text =
    label ??
    { running: "Running", success: "Success", failed: "Failed", partial: "Partial", skipped: "Skipped", idle: "Idle" }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", variantDot[variant])} />
      {text}
    </span>
  );
}
