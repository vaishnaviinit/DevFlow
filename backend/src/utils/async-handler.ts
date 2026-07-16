import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so rejected promises are forwarded to Express's
 * error middleware instead of being swallowed. Removes the repetitive
 * try/catch block from every controller.
 *
 * Note: Express 5 forwards rejected promises automatically, but wrapping keeps
 * behaviour explicit and portable.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
