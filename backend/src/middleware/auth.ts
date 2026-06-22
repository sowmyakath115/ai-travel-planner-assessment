import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return next(new ApiError(401, "Invalid token"));
    }

    req.user = { id: decoded.userId };
    return next();
  } catch {
    return next(new ApiError(401, "Session expired or invalid"));
  }
}
