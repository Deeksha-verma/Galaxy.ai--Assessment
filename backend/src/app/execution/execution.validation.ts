import { z } from "zod";

export const executeWorkflowSchema = z.object({
  scope: z.enum(["full", "partial", "single"]),
  nodeIds: z.array(z.string()).optional(), // required if partial/single
});
