import { Router } from "express";
import { getMe } from "./user.controller";
import { requireAuth } from "../common/middleware/role-auth.middleware";
import { catchError } from "../common/middleware/catch-error.middleware";

const router = Router();

// All user routes require authentication
router.use(catchError(requireAuth as any));

router.get("/me", catchError(getMe));

export default router;
