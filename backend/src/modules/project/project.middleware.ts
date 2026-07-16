import { Response, NextFunction } from "express";
import { WorkspaceRole, Project } from "@prisma/client";
import { asyncHandler } from "../../utils/async-handler";
import { Forbidden, NotFound, BadRequest } from "../../utils/app-error";
import { loadMembership } from "../workspace/workspace.service";
import { prisma } from "../../config/prisma";
import { WorkspaceRequest } from "../../middleware/authorize.middleware";

/**
 * Request enriched by the project guards. `workspace`/`membership` come from the
 * resolved workspace (as with any workspace-scoped route); `project` is attached
 * on `:id` routes so the handler doesn't reload it.
 */
export interface ProjectRequest extends WorkspaceRequest {
  project?: Project;
}

/**
 * Shared check: resolve the caller's membership in the given workspace, enforce
 * the role (if any), and attach the context. Reuses the workspace module's
 * `loadMembership`, so "resolve workspace + caller role" has one implementation.
 */
const gate = async (
  req: ProjectRequest,
  workspaceId: string,
  allowed: WorkspaceRole[]
): Promise<void> => {
  const { workspace, membership } = await loadMembership(workspaceId, req.user!.id);
  if (allowed.length > 0 && !allowed.includes(membership.role)) {
    throw Forbidden("You do not have permission to perform this action");
  }
  req.workspace = workspace;
  req.membership = membership;
};

/**
 * Guard for routes where the workspace is named in the request:
 * `POST /projects` (body.workspaceId) and `GET /projects` (query.workspaceId).
 */
export const authorizeWorkspaceScope = (...allowed: WorkspaceRole[]) =>
  asyncHandler(
    async (req: ProjectRequest, _res: Response, next: NextFunction) => {
      const workspaceId =
        req.body?.workspaceId ?? (req.query?.workspaceId as string | undefined);
      if (!workspaceId) {
        throw BadRequest("workspaceId is required");
      }
      await gate(req, workspaceId, allowed);
      next();
    }
  );

/**
 * Guard for `/projects/:id` routes: loads the active project, derives its
 * workspace, enforces the role, and attaches `req.project`.
 */
export const authorizeProject = (...allowed: WorkspaceRole[]) =>
  asyncHandler(
    async (req: ProjectRequest, _res: Response, next: NextFunction) => {
      const projectId = (req.params as Record<string, string>).id;
      const project = await prisma.project.findFirst({
        where: { id: projectId, deletedAt: null },
      });
      if (!project) {
        throw NotFound("Project not found");
      }
      await gate(req, project.workspaceId, allowed);
      req.project = project;
      next();
    }
  );
