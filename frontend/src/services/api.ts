import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { Workflow, WorkflowRun, RunDetail } from "@/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Workflow", "History"],
  endpoints: (build) => ({
    // ── Workflow CRUD ──
    listWorkflows: build.query<Workflow[], void>({
      query: () => "/workflows",
      transformResponse: (res: any) => res.data,
      providesTags: ["Workflow"],
    }),
    getWorkflow: build.query<Workflow, string>({
      query: (id) => `/workflows/${id}`,
      transformResponse: (res: any) => res.data,
    }),
    createWorkflow: build.mutation<Workflow, Partial<Workflow>>({
      query: (body) => ({ url: "/workflows", method: "POST", body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Workflow"],
    }),
    updateWorkflow: build.mutation<Workflow, { id: string } & Partial<Workflow>>(
      {
        query: ({ id, ...body }) => ({
          url: `/workflows/${id}`,
          method: "PUT",
          body,
        }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: ["Workflow"],
      }
    ),
    deleteWorkflow: build.mutation<void, string>({
      query: (id) => ({ url: `/workflows/${id}`, method: "DELETE" }),
      invalidatesTags: ["Workflow"],
    }),

    // ── Export / Import ──
    exportWorkflow: build.query<object, string>({
      query: (id) => `/workflows/${id}/export`,
      transformResponse: (res: any) => res.data,
    }),
    importWorkflow: build.mutation<Workflow, object>({
      query: (body) => ({ url: "/workflows/import", method: "POST", body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Workflow"],
    }),

    // ── Execution ──
    runWorkflow: build.mutation<
      { runId: string },
      { id: string; scope: "full" | "partial" | "single"; nodeIds?: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/execute/${id}/run`,
        method: "POST",
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["History"],
    }),

    // ── History ──
    listHistory: build.query<WorkflowRun[], string>({
      query: (workflowId) => `/history?workflowId=${workflowId}`,
      transformResponse: (res: any) => res.data,
      providesTags: ["History"],
    }),
    getRunDetail: build.query<RunDetail, string>({
      query: (runId) => `/history/${runId}`,
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const {
  useListWorkflowsQuery,
  useGetWorkflowQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useExportWorkflowQuery,
  useImportWorkflowMutation,
  useRunWorkflowMutation,
  useListHistoryQuery,
  useGetRunDetailQuery,
  useLazyGetWorkflowQuery,
} = api;
