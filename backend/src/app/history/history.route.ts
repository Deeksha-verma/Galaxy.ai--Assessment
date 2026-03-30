import { Router } from "express";
import * as hc from "./history.controller";
import { requireAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

router.use(catchError(requireAuth as any));

router.get("/", catchError(hc.listHistory));
router.get("/:runId", catchError(hc.getRunDetail));

export default router;
