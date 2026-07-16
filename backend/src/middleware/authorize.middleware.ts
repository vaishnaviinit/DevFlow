import { Response, NextFunction } from "express";
import { WorkspaceRole, Workspace, WorkspaceMember } from "@prisma/client";
import { AuthRequest } from "./auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Forbidden } from "../utils/app-error";
import { loadMembership } from "../modules/workspace/workspace.service";

/**
 * Request enriched by `authorize`: the resolved workspace and the caller's
 * membership are attached so downstream handlers don't reload them.
 */
export interface WorkspaceRequest extends AuthRequest {
  workspace?: Workspace;
  membership?: WorkspaceMember;
}

/**
 * Workspace-scoped RBAC guard. Runs after `authenticate`.
 *
 * Resolves the workspace from the `:id` route param, confirms the caller is a
 * member, and — when roles are supplied — that their role is allowed. On
 * success it attaches `req.workspace` and `req.membership`.
 *
 * This is the single place workspace roles are checked; services trust it and
 * focus on business rules. Failures reuse the standard errors:
 *   - 404 workspace not found / soft-deleted
 *   - 403 not a member, or role not permitted
 *
 * Usage:
 *   authorize("OWNER")            // owner only
 *   authorize("OWNER", "ADMIN")   // owner or admin
 *   authorize()                   // any member
 */
export const authorize = (...allowed: WorkspaceRole[]) =>
  asyncHandler(
    async (req: WorkspaceRequest, _res: Response, next: NextFunction) => {
      const workspaceId = (req.params as Record<string, string>).id;
      const { workspace, membership } = await loadMembership(
        workspaceId,
        req.user!.id
      );

      if (allowed.length > 0 && !allowed.includes(membership.role)) {
        throw Forbidden("You do not have permission to perform this action");
      }

      req.workspace = workspace;
      req.membership = membership;
      next();
    }
  );
