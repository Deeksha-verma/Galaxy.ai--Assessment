import { Router } from "express";
import * as ec from "./execution.controller";
import { requireAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

// Notice: executeWorkflow does NOT use catchError wrapper because it handles SSE
// itself. Wrapping it could cause headers to be reset after they are sent.
router.post("/:workflowId", requireAuth as any, ec.executeWorkflow);

export default router;
