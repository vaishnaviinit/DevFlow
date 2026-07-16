/**
 * Operational error — an expected failure we can map to an HTTP response
 * (bad input, invalid credentials, missing resource).
 *
 * Anything NOT thrown as an AppError is treated as an unexpected/programmer
 * error by the central error handler and reported as a generic 500.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Restore prototype chain (required when targeting ES5/ES6 with classes).
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/** Convenience factories for the status codes the auth module uses today. */
export const BadRequest = (msg: string) => new AppError(msg, 400);
export const Unauthorized = (msg = "Unauthorized") => new AppError(msg, 401);
export const Forbidden = (msg = "Forbidden") => new AppError(msg, 403);
export const NotFound = (msg = "Resource not found") => new AppError(msg, 404);
export const Conflict = (msg: string) => new AppError(msg, 409);
