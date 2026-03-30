"use client";

import React, { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { useGetWorkflowQuery } from "@/services/api";
import { useWorkflowStore } from "@/store/workflowStore";
import { Spinner } from "@/components/ui/Spinner";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";

export default function WorkflowByIdPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, isError } = useGetWorkflowQuery(id, { skip: !id });
  const setWorkflow = useWorkflowStore((s) => s.setWorkflow);

  useEffect(() => {
    if (data) {
      setWorkflow(data.id, data.name, data.nodes, data.edges);
    }
  }, [data, setWorkflow]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
        }}
      >
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !data) return notFound();

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <ReactFlowProvider>
        <LeftSidebar />
        <WorkflowCanvas />
        <RightSidebar workflowId={id} />
      </ReactFlowProvider>
    </div>
  );
}
