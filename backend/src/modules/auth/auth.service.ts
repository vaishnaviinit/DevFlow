import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { signAccessToken } from "../../utils/jwt";
import { Conflict, Unauthorized, NotFound } from "../../utils/app-error";
import type { RegisterInput, LoginInput } from "./auth.validation";

/**
 * Fields safe to return to the client. Using a Prisma `select` guarantees the
 * password hash (and any future secret column) can never leak, even if the
 * model grows new sensitive fields.
 */
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  bio: true,
  githubUrl: true,
  linkedinUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw Conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: publicUserSelect,
  });

  const token = signAccessToken({ sub: user.id, email: user.email });
  return { user, token };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run bcrypt.compare even when the user is missing, using a dummy
  // hash, to keep response time constant and avoid a user-enumeration timing
  // side channel.
  const passwordHash =
    user?.passwordHash ??
    "$2a$12$0000000000000000000000000000000000000000000000000000";

  const valid = await bcrypt.compare(password, passwordHash);

  if (!user || !valid) {
    throw Unauthorized("Invalid email or password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signAccessToken({ sub: user.id, email: user.email });
  const { passwordHash: _removed, refreshToken: _rt, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
  if (!user) {
    throw NotFound("User not found");
  }
  return user;
};
