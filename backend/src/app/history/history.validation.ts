import { z } from "zod";

export const historyQuerySchema = z.object({
  workflowId: z.string().optional(),
});
