import { z } from "zod";

/**
 * Validation schemas for the project module.
 *
 * A project belongs to a workspace. On create, the workspace is named in the
 * body (`workspaceId`); on `:id` routes it is derived from the project itself.
 * Route params are resolved by the middleware/service and are not validated here.
 */

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "color must be a hex value like #2D9CDB");

export const projectStatusSchema = z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]);

export const createProjectSchema = z.object({
  workspaceId: z.string().min(1, "workspaceId is required"),
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().trim().max(1000).optional(),
  status: projectStatusSchema.optional(),
  color: hexColor.optional(),
});

export const updateProjectSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(1000).optional(),
    status: projectStatusSchema.optional(),
    color: hexColor.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Provide at least one field to update",
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
