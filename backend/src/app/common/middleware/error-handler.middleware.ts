import { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../helper/response.helper";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json(createErrorResponse(message, process.env.NODE_ENV === "development" ? err : undefined));
};
