import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] });
}
