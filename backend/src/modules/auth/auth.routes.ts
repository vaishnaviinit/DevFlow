import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { register, login, me } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);
router.post(
  "/login",
  validate(loginSchema),
  login
);
router.get("/me", authenticate, me);

export default router;