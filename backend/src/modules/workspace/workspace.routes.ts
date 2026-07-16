import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
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
router.post("/", validate(createWorkspaceSchema), workspace.create);
router.get("/", workspace.list);
router.get("/:id", workspace.getById);
router.patch("/:id", validate(updateWorkspaceSchema), workspace.update);
router.delete("/:id", workspace.remove);

/* ---- Members ---- */
router.post("/:id/invite", validate(inviteMemberSchema), workspace.invite);
router.get("/:id/members", workspace.listMembers);
router.patch(
  "/:id/members/:memberId",
  validate(updateMemberRoleSchema),
  workspace.updateMemberRole
);
router.delete("/:id/members/:memberId", workspace.removeMember);
router.post("/:id/leave", workspace.leave);

export default router;
