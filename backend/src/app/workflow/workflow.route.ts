import { Router } from "express";
import * as wc from "./workflow.controller";
import { requireAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.use(catchError(requireAuth as any));

router.get("/", catchError(wc.listWorkflows));
router.post("/", catchError(wc.createWorkflow));
router.post("/import", catchError(wc.importWorkflow));

router.get("/:id", catchError(wc.getWorkflow));
router.put("/:id", catchError(wc.updateWorkflow));
router.delete("/:id", catchError(wc.deleteWorkflow));

router.get("/:id/export", catchError(wc.exportWorkflow));
router.post("/seed", catchError(wc.seedWorkflow));

export default router;
