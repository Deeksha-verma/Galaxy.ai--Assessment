import express, { Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";

import userRoutes from "./app/user/user.route";
import workflowRoutes from "./app/workflow/workflow.route";
import historyRoutes from "./app/history/history.route";
import executionRoutes from "./app/execution/execution.route";
import { errorHandler } from "./app/common/middleware/error-handler.middleware";

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
  app.use(express.json());

  const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
  app.use(limiter);

  // Serve static uploads
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  app.use("/uploads", express.static(uploadDir));

  // Minimal upload endpoint
  app.post("/api/v1/upload", express.raw({ type: "image/*", limit: "10mb" }), (req, res) => {
    const contentType = req.headers["content-type"] || "image/jpeg";
    const ext = contentType.split("/")[1] || "jpg";
    const filename = `up-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filePath, req.body);
    
    const host = req.get("host") || "localhost:4000";
    const protocol = req.protocol || "http";
    res.json({ url: `${protocol}://${host}/uploads/${filename}` });
  });

  // Healthcheck
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  // Feature Routes
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/workflows", workflowRoutes);
  app.use("/api/v1/history", historyRoutes);
  app.use("/api/v1/execute", executionRoutes); // Fixed prefix for execution

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
