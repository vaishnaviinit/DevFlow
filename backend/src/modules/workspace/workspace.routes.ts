import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from "./workspace.validation";
import * as workspace from "./workspace.controller";

const router = Router();

// Every workspace route requires an authenticated user.
router.use(authenticate);

/* ---- Workspace ---- */
// Not workspace-scoped: any authenticated user may create or list their own.
router.post("/", validate(createWorkspaceSchema), workspace.create);
router.get("/", workspace.list);

// Scoped: authorize() resolves the workspace and gates by role.
router.get("/:id", authorize(), workspace.getById);
router.patch(
  "/:id",
  authorize("OWNER", "ADMIN"),
  validate(updateWorkspaceSchema),
  workspace.update
);
router.delete("/:id", authorize("OWNER"), workspace.remove);

/* ---- Members ---- */
router.post(
  "/:id/invite",
  authorize("OWNER", "ADMIN"),
  validate(inviteMemberSchema),
  workspace.invite
);
router.get("/:id/members", authorize(), workspace.listMembers);
router.patch(
  "/:id/members/:memberId",
  authorize("OWNER", "ADMIN"),
  validate(updateMemberRoleSchema),
  workspace.updateMemberRole
);
router.delete(
  "/:id/members/:memberId",
  authorize("OWNER", "ADMIN"),
  workspace.removeMember
);
router.post("/:id/leave", authorize(), workspace.leave);

export default router;
