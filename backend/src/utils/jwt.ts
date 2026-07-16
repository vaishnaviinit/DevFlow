import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { Unauthorized } from "./app-error";

/** Claims we embed in the access token. Keep this minimal — no PII beyond id. */
export interface JwtPayload {
  sub: string; // user id (standard "subject" claim)
  email: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // jwt.verify returns string | JwtPayload; narrow to our shape.
    if (typeof decoded === "string" || !decoded.sub) {
      throw new Error("Malformed token");
    }
    return { sub: String(decoded.sub), email: String(decoded.email) };
  } catch {
    throw Unauthorized("Invalid or expired token");
  }
};
