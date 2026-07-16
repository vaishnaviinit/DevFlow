import { prisma } from "../../config/prisma";
import type { CreateProjectInput, UpdateProjectInput } from "./project.validation";

/**
 * Project business logic and data access.
 *
 * Workspace membership and role are enforced by the project guards
 * (see project.middleware.ts) before these run, so the service focuses on
 * persistence. Projects carry no secret fields, so full records are returned.
 */

export const createProject = async (
  workspaceId: string,
  createdBy: string,
  input: CreateProjectInput
) => {
  return prisma.project.create({
    data: {
      workspaceId,
      createdBy,
      title: input.title,
      description: input.description,
      status: input.status,
      color: input.color,
    },
  });
};

/** List active projects in a workspace, newest first. */
export const getWorkspaceProjects = async (workspaceId: string) => {
  return prisma.project.findMany({
    where: { workspaceId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

/** Update a project. Access gated by authorizeProject("OWNER","ADMIN"). */
export const updateProject = async (
  projectId: string,
  input: UpdateProjectInput
) => {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      color: input.color,
    },
  });
};

/** Soft-delete a project. Access gated by authorizeProject("OWNER","ADMIN"). */
export const deleteProject = async (projectId: string) => {
  await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: new Date() },
  });
  return { id: projectId };
};
