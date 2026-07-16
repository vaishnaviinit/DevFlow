import { Prisma, WorkspaceRole } from "@prisma/client";
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
 * Load a workspace (active only) together with the caller's membership.
 *
 * Central to workspace authorization: it resolves the resource and the caller's
 * role in one indexed query, and is the single place that decides "not found"
 * (404) versus "not a member" (403). Role assertions build on its result.
 *
 * Throws:
 *  - NotFound  if the workspace does not exist or is soft-deleted
 *  - Forbidden if the caller is not a member
 */
const loadMembership = async (workspaceId: string, userId: string) => {
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

/** Assert the caller's role is one of the allowed roles, else 403. */
const assertRole = (role: WorkspaceRole, allowed: WorkspaceRole[]): void => {
  if (!allowed.includes(role)) {
    throw Forbidden("You do not have permission to perform this action");
  }
};

/* ------------------------------------------------------------------ */
/* Workspace                                                          */
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

/** Get a single workspace the caller belongs to, including their role. */
export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const { workspace, membership } = await loadMembership(workspaceId, userId);
  return { ...workspace, role: membership.role };
};

/** Rename / update a workspace. OWNER and ADMIN only. */
export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  input: UpdateWorkspaceInput
) => {
  const { membership } = await loadMembership(workspaceId, userId);
  assertRole(membership.role, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

  return prisma.workspace.update({
    where: { id: workspaceId },
    data: { name: input.name, description: input.description },
  });
};

/** Soft-delete a workspace (sets deletedAt). OWNER only. */
export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  const { membership } = await loadMembership(workspaceId, userId);
  assertRole(membership.role, [WorkspaceRole.OWNER]);

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
 * Add an existing registered user to the workspace. OWNER and ADMIN only.
 *
 * "Invite" here means adding a user who already has an account (no email is
 * sent). Inviting people who have not signed up (via link/email) is a separate,
 * future flow and would use a dedicated invitation model.
 */
export const inviteMember = async (
  workspaceId: string,
  actorUserId: string,
  input: InviteMemberInput
) => {
  const { membership } = await loadMembership(workspaceId, actorUserId);
  assertRole(membership.role, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

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

/** List all members of a workspace. Any member may view. */
export const getMembers = async (workspaceId: string, userId: string) => {
  await loadMembership(workspaceId, userId);

  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    select: memberSelect,
    orderBy: { joinedAt: "asc" },
  });
};

/** Change a member's role. OWNER and ADMIN only. The owner's role is fixed. */
export const updateMemberRole = async (
  workspaceId: string,
  actorUserId: string,
  memberId: string,
  input: UpdateMemberRoleInput
) => {
  const { membership } = await loadMembership(workspaceId, actorUserId);
  assertRole(membership.role, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

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

/** Remove a member. OWNER and ADMIN only. The owner cannot be removed. */
export const removeMember = async (
  workspaceId: string,
  actorUserId: string,
  memberId: string
) => {
  const { membership } = await loadMembership(workspaceId, actorUserId);
  assertRole(membership.role, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

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

/** Leave a workspace. The owner must transfer ownership or delete instead. */
export const leaveWorkspace = async (workspaceId: string, userId: string) => {
  const { membership } = await loadMembership(workspaceId, userId);

  if (membership.role === WorkspaceRole.OWNER) {
    throw Forbidden(
      "The owner cannot leave the workspace; transfer ownership or delete it"
    );
  }

  await prisma.workspaceMember.delete({ where: { id: membership.id } });
  return { id: membership.id };
};
