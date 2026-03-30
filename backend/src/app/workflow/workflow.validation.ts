import { z } from "zod";

const NodeSchema = z.record(z.any());
const EdgeSchema = z.record(z.any());

export const workflowCreateSchema = z.object({
  name: z.string().optional(),
  nodes: z.array(NodeSchema).default([]),
  edges: z.array(EdgeSchema).default([]),
});

export const workflowUpdateSchema = z.object({
  name: z.string().optional(),
  nodes: z.array(NodeSchema).optional(),
  edges: z.array(EdgeSchema).optional(),
});
