import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { Unauthorized } from "../utils/app-error";

/** The authenticated user attached to the request by `authenticate`. */
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Verifies the `Authorization: Bearer <token>` header and attaches the decoded
 * user to `req.user`. Errors are forwarded to the central error handler.
 */
export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(Unauthorized("Authentication token missing"));
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return next(Unauthorized("Authentication token missing"));
  }

  const payload = verifyAccessToken(token);
  req.user = { id: payload.sub, email: payload.email };
  next();
};
