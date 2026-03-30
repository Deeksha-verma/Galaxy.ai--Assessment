"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          background: "linear-gradient(135deg, var(--accent-purple), var(--accent-purple-light))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
        Page not found
      </p>
      <Link
        href="/workflow"
        style={{
          padding: "8px 20px",
          background: "var(--accent-purple)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Go to Canvas
      </Link>
    </div>
  );
}
