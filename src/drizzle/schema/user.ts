import { boolean, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { LocationTable } from "./location";
import { createdAt, id, updatedAt } from "../schemaHelpers";

/**
 * USER TABLE
 *
 * Stores user information and their role assignments.
 * Users can be assigned to multiple locations through the userLocations junction table.
 * Role-based permissions control access levels (employee, admin, super_admin).
 *
 * Business Rules:
 * - Employee IDs must be unique across all locations and permanently retired when user leaves
 * - Role defaults to 'employee' for new hires
 * - Every user must be assigned to at least one location via userLocations table
 * - Super admins have access to all locations regardless of userLocations assignments
 * - Admins can only see/manage employees from locations they share access to
 * - Employees have read-only access and cannot create/update/delete any batch, strain, or location data
 * - Users are soft-deleted (isActive = false) to preserve historical work records
 *
 * Relationships:
 * - Many-to-many with locations via userLocations junction table
 * - One-to-many with userDay (tracks individual work contributions)
 * - Email used for authentication with no domain restrictions
 *
 * Notes:
 * - Historical work records maintained even after employee departure
 **/



export const roleStatuses = ['employee', 'admin', 'super_admin'] as const
export type roleStatus = (typeof roleStatuses)[number]
export const roleStatusEnum = pgEnum(
    "role_statuses",
    roleStatuses,
)

export const UserTable = pgTable("users", {
    id,
    employeeID: integer().unique(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    role: roleStatusEnum().notNull().default('employee'),
    email: text().unique().notNull(),
    createdAt,
    updatedAt
})