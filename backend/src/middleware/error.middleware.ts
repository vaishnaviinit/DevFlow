import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { env } from "../config/env";

/** 404 handler — reached when no route matched. */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

/**
 * Central error handler. Must be registered LAST, after all routes.
 *
 * - Known AppErrors are returned with their status code and message.
 * - Everything else is an unexpected error: logged in full, returned as a
 *   generic 500 so we never leak stack traces or internal details to clients.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected error — log for observability, hide details from the client.
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(env.isProduction ? {} : { detail: String(err) }),
  });
};
