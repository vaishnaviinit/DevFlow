import { Request, Response } from "express";
import { registerUser, loginUser, getUserById } from "./auth.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  sendSuccess(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  sendSuccess(res, result, 200);
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Fetch the current record rather than trusting the (possibly stale) token
  // payload — the user may have been updated or deactivated since sign-in.
  const user = await getUserById(req.user!.id);
  sendSuccess(res, { user }, 200);
});
