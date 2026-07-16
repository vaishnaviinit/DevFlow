import { Response } from "express";
import * as workspaceService from "./workspace.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { WorkspaceRequest } from "../../middleware/authorize.middleware";

/**
 * Thin HTTP layer for the workspace module. Each handler reads the request,
 * calls a service, and returns the standard response envelope.
 *
 * `req.user` is guaranteed by `authenticate`. On `:id` routes, `authorize`
 * additionally guarantees `req.workspace` and `req.membership` — so scoped
 * handlers use `req.workspace.id` and never re-check roles here.
 */
const memberId = (req: WorkspaceRequest) =>
  (req.params as Record<string, string>).memberId;

/* ---- Workspace ---- */

export const create = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const workspace = await workspaceService.createWorkspace(
      req.user!.id,
      req.body
    );
    sendSuccess(res, { workspace }, 201);
  }
);

export const list = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const workspaces = await workspaceService.getUserWorkspaces(req.user!.id);
    sendSuccess(res, { workspaces });
  }
);

export const getById = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    // Resolved by the authorize middleware; just shape the response.
    sendSuccess(res, {
      workspace: { ...req.workspace!, role: req.membership!.role },
    });
  }
);

export const update = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const workspace = await workspaceService.updateWorkspace(
      req.workspace!.id,
      req.body
    );
    sendSuccess(res, { workspace });
  }
);

export const remove = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const result = await workspaceService.deleteWorkspace(req.workspace!.id);
    sendSuccess(res, result);
  }
);

/* ---- Members ---- */

export const invite = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const member = await workspaceService.inviteMember(
      req.workspace!.id,
      req.body
    );
    sendSuccess(res, { member }, 201);
  }
);

export const listMembers = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const members = await workspaceService.getMembers(req.workspace!.id);
    sendSuccess(res, { members });
  }
);

export const updateMemberRole = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const member = await workspaceService.updateMemberRole(
      req.workspace!.id,
      memberId(req),
      req.body
    );
    sendSuccess(res, { member });
  }
);

export const removeMember = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const result = await workspaceService.removeMember(
      req.workspace!.id,
      memberId(req)
    );
    sendSuccess(res, result);
  }
);

export const leave = asyncHandler(
  async (req: WorkspaceRequest, res: Response) => {
    const result = await workspaceService.leaveWorkspace(req.membership!);
    sendSuccess(res, result);
  }
);
