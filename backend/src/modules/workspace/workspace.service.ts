import { Prisma, WorkspaceRole, WorkspaceMember } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { NotFound, Forbidden, Conflict } from "../../utils/app-error";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
} from "./workspace.validation";

/**
 * Fields returned when listing/returning a member. Includes a minimal public
 * view of the linked user — never the password hash or other secrets.
 */
const memberSelect = {
  id: true,
  role: true,
  joinedAt: true,
  user: { select: { id: true, name: true, email: true, avatar: true } },
} satisfies Prisma.WorkspaceMemberSelect;

/**
 * Load an active workspace together with the caller's membership.
 *
 * This is the single source of truth for workspace-scoped access: it resolves
 * the resource and the caller's role in one indexed query. The `authorize`
 * middleware calls it to gate routes and to attach req.workspace / req.membership.
 *
 * Throws:
 *  - NotFound  if the workspace does not exist or is soft-deleted
 *  - Forbidden if the caller is not a member
 */
export const loadMembership = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, deletedAt: null },
    include: { members: { where: { userId } } },
  });

  if (!workspace) {
    throw NotFound("Workspace not found");
  }

  const membership = workspace.members[0];
  if (!membership) {
    throw Forbidden("You are not a member of this workspace");
  }

  const { members, ...workspaceData } = workspace;
  return { workspace: workspaceData, membership };
};

/* ------------------------------------------------------------------ */
/* Workspace                                                          */
/*                                                                    */
/* Role/membership authorization for :id routes is enforced by the    */
/* `authorize` middleware before these run. Services own business     */
/* rules and data access only.                                        */
/* ------------------------------------------------------------------ */

/**
 * Create a workspace and make the creator its OWNER in a single transaction,
 * so a workspace can never exist without its owning membership.
 */
export const createWorkspace = async (
  userId: string,
  input: CreateWorkspaceInput
) => {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: input.name,
        description: input.description,
        ownerId: userId,
      },
    });

    await tx.workspaceMember.create({
      data: { workspaceId: workspace.id, userId, role: WorkspaceRole.OWNER },
    });

    return workspace;
  });
};

/** List the active workspaces the caller belongs to, with their role in each. */
export const getUserWorkspaces = async (userId: string) => {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId, workspace: { deletedAt: null } },
    include: { workspace: true },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map(({ workspace, role }) => ({ ...workspace, role }));
};

/** Rename / update a workspace. Access gated by authorize("OWNER","ADMIN"). */
export const updateWorkspace = async (
  workspaceId: string,
  input: UpdateWorkspaceInput
) => {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data: { name: input.name, description: input.description },
  });
};

/** Soft-delete a workspace. Access gated by authorize("OWNER"). */
export const deleteWorkspace = async (workspaceId: string) => {
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { deletedAt: new Date() },
  });
  return { id: workspaceId };
};

/* ------------------------------------------------------------------ */
/* Members                                                            */
/* ------------------------------------------------------------------ */

/**
 * Add an existing registered user to the workspace. Gated by
 * authorize("OWNER","ADMIN").
 *
 * "Invite" here means adding a user who already has an account (no email is
 * sent). Inviting people who have not signed up (via link/email) is a separate,
 * future flow and would use a dedicated invitation model.
 */
export const inviteMember = async (
  workspaceId: string,
  input: InviteMemberInput
) => {
  const invitee = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (!invitee) {
    throw NotFound("No registered user with that email");
  }

  const existing = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: invitee.id } },
  });
  if (existing) {
    throw Conflict("User is already a member of this workspace");
  }

  return prisma.workspaceMember.create({
    data: { workspaceId, userId: invitee.id, role: input.role },
    select: memberSelect,
  });
};

/** List all members of a workspace. Gated by authorize() (any member). */
export const getMembers = async (workspaceId: string) => {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    select: memberSelect,
    orderBy: { joinedAt: "asc" },
  });
};

/**
 * Change a member's role. Gated by authorize("OWNER","ADMIN").
 * The owner's role cannot be changed.
 */
export const updateMemberRole = async (
  workspaceId: string,
  memberId: string,
  input: UpdateMemberRoleInput
) => {
  const target = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId },
  });
  if (!target) {
    throw NotFound("Member not found");
  }
  if (target.role === WorkspaceRole.OWNER) {
    throw Forbidden("The owner's role cannot be changed");
  }

  return prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role: input.role },
    select: memberSelect,
  });
};

/**
 * Remove a member. Gated by authorize("OWNER","ADMIN").
 * The owner cannot be removed.
 */
export const removeMember = async (workspaceId: string, memberId: string) => {
  const target = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId },
  });
  if (!target) {
    throw NotFound("Member not found");
  }
  if (target.role === WorkspaceRole.OWNER) {
    throw Forbidden("The owner cannot be removed");
  }

  await prisma.workspaceMember.delete({ where: { id: memberId } });
  return { id: memberId };
};

/**
 * Leave a workspace. Gated by authorize() (any member). The owner must transfer
 * ownership or delete the workspace instead of leaving. Receives the caller's
 * membership (already loaded by the middleware).
 */
export const leaveWorkspace = async (membership: WorkspaceMember) => {
  if (membership.role === WorkspaceRole.OWNER) {
    throw Forbidden(
      "The owner cannot leave the workspace; transfer ownership or delete it"
    );
  }

  await prisma.workspaceMember.delete({ where: { id: membership.id } });
  return { id: membership.id };
};
