import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signAccessToken } from "../services/tokenService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

function authResponse(user: { _id: unknown; name: string; email: string }) {
  return {
    token: signAccessToken(String(user._id)),
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email
    }
  };
}

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });

  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user || !(await user.comparePassword(input.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json(authResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user: { id: String(user._id), name: user.name, email: user.email } });
});
