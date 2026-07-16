import { Response } from "express";

/**
 * Standard success envelope so every endpoint responds with the same shape:
 *   { success: true, data: <payload> }
 *
 * Error responses are produced centrally in error.middleware.ts and use:
 *   { success: false, message: string, errors?: ... }
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200
): Response => res.status(statusCode).json({ success: true, data });
