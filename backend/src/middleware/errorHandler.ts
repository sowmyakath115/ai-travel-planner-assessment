import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.flatten().fieldErrors
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const message = err instanceof Error ? err.message : "Unexpected server error";
  return res.status(500).json({
    message: env.NODE_ENV === "production" ? "Unexpected server error" : message
  });
}
