import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Security headers.
app.use(helmet());

// CORS — restrict to configured origins.
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);

// Body parsing with a sane size limit.
app.use(express.json({ limit: "1mb" }));

// Basic rate limit on auth endpoints to slow credential-stuffing/brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later" },
});

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authLimiter, authRoutes);

// 404 + centralized error handling — must be registered after routes.
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`DevFlow backend running on port ${env.PORT} [${env.NODE_ENV}]`);
});
