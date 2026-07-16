import { Response } from "express";
import * as projectService from "./project.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import { ProjectRequest } from "./project.middleware";

/**
 * Thin HTTP layer for the project module. The guards in project.middleware.ts
 * resolve and attach `req.workspace`, `req.membership`, and (on `:id` routes)
 * `req.project`, so handlers never re-query or re-check access here.
 */

export const create = asyncHandler(
  async (req: ProjectRequest, res: Response) => {
    const project = await projectService.createProject(
      req.workspace!.id,
      req.user!.id,
      req.body
    );
    sendSuccess(res, { project }, 201);
  }
);

export const list = asyncHandler(async (req: ProjectRequest, res: Response) => {
  const projects = await projectService.getWorkspaceProjects(req.workspace!.id);
  sendSuccess(res, { projects });
});

export const getById = asyncHandler(
  async (req: ProjectRequest, res: Response) => {
    // Loaded by the authorizeProject guard.
    sendSuccess(res, { project: req.project });
  }
);

export const update = asyncHandler(
  async (req: ProjectRequest, res: Response) => {
    const project = await projectService.updateProject(
      req.project!.id,
      req.body
    );
    sendSuccess(res, { project });
  }
);

export const remove = asyncHandler(
  async (req: ProjectRequest, res: Response) => {
    const result = await projectService.deleteProject(req.project!.id);
    sendSuccess(res, result);
  }
);
