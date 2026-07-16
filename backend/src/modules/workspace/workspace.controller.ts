import { Response } from "express";
import * as workspaceService from "./workspace.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";

/**
 * Thin HTTP layer for the workspace module. Each handler reads the request,
 * calls a service, and returns the standard response envelope. All business
 * logic and authorization live in the service (see workspace.service.ts).
 *
 * `req.user` is guaranteed by the `authenticate` middleware on every route.
 * Path params are read via `params()`, which narrows Express's
 * `string | string[]` param type to plain strings.
 */
const params = (req: AuthRequest) => req.params as Record<string, string>;

/* ---- Workspace ---- */

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspace = await workspaceService.createWorkspace(
    req.user!.id,
    req.body
  );
  sendSuccess(res, { workspace }, 201);
});

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspaces = await workspaceService.getUserWorkspaces(req.user!.id);
  sendSuccess(res, { workspaces });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspace = await workspaceService.getWorkspaceById(
    params(req).id,
    req.user!.id
  );
  sendSuccess(res, { workspace });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const workspace = await workspaceService.updateWorkspace(
    params(req).id,
    req.user!.id,
    req.body
  );
  sendSuccess(res, { workspace });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await workspaceService.deleteWorkspace(
    params(req).id,
    req.user!.id
  );
  sendSuccess(res, result);
});

/* ---- Members ---- */

export const invite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const member = await workspaceService.inviteMember(
    params(req).id,
    req.user!.id,
    req.body
  );
  sendSuccess(res, { member }, 201);
});

export const listMembers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const members = await workspaceService.getMembers(
      params(req).id,
      req.user!.id
    );
    sendSuccess(res, { members });
  }
);

export const updateMemberRole = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const member = await workspaceService.updateMemberRole(
      params(req).id,
      req.user!.id,
      params(req).memberId,
      req.body
    );
    sendSuccess(res, { member });
  }
);

export const removeMember = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await workspaceService.removeMember(
      params(req).id,
      req.user!.id,
      params(req).memberId
    );
    sendSuccess(res, result);
  }
);

export const leave = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await workspaceService.leaveWorkspace(
    params(req).id,
    req.user!.id
  );
  sendSuccess(res, result);
});
