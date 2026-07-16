import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  authorizeWorkspaceScope,
  authorizeProject,
} from "./project.middleware";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import * as project from "./project.controller";

const router = Router();

// Every project route requires an authenticated user.
router.use(authenticate);

// Create: validate first (guarantees body.workspaceId), then check the role in
// that workspace. OWNER/ADMIN only.
router.post(
  "/",
  validate(createProjectSchema),
  authorizeWorkspaceScope("OWNER", "ADMIN"),
  project.create
);

// List projects for a workspace: /projects?workspaceId=... — any member.
router.get("/", authorizeWorkspaceScope(), project.list);

// Item routes: workspace derived from the project.
router.get("/:id", authorizeProject(), project.getById);
router.patch(
  "/:id",
  authorizeProject("OWNER", "ADMIN"),
  validate(updateProjectSchema),
  project.update
);
router.delete("/:id", authorizeProject("OWNER", "ADMIN"), project.remove);

export default router;
