import { z } from "zod";

/**
 * Validation schemas for the workspace module.
 *
 * Only request bodies are validated here (via the shared `validate` middleware).
 * Route params (`:id`, `:memberId`) are treated as opaque ids and resolved by
 * the service, which returns a 404 when nothing matches.
 */

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().trim().max(500).optional(),
});

export const updateWorkspaceSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Provide at least one field to update",
  });

/**
 * Roles that can be assigned through invite / role-change.
 * OWNER is intentionally excluded — ownership is established at creation and is
 * not assignable via these endpoints (ownership transfer is a separate concern).
 */
export const assignableRoleSchema = z.enum(["ADMIN", "MEMBER"]);

export const inviteMemberSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  role: assignableRoleSchema.default("MEMBER"),
});

export const updateMemberRoleSchema = z.object({
  role: assignableRoleSchema,
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
