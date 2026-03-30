import { Request, Response, NextFunction } from "express";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { config } from "../helper/config.helper";
import { createErrorResponse } from "../helper/response.helper";
import { prisma } from "../services/database.service";

// Extend Express Request tightly
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(createErrorResponse("Unauthorised: Missing Bearer token"));
    }

    const token = authHeader.split(" ")[1];

    // Verify using Clerk's backend SDK
    const payload = await verifyToken(token, {
      secretKey: config.CLERK_SECRET_KEY,
    });

    if (!payload.sub) {
      return res.status(401).json(createErrorResponse("Unauthorised: Invalid token payload"));
    }

    // Attach Clerk user ID (sub) to the request
    const userId = payload.sub;
    req.userId = userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json(createErrorResponse("Unauthorised: Invalid or expired token", error));
  }
};
