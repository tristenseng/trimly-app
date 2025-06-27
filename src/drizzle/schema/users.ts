import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from 'drizzle-orm';
import { LocationAssignments } from "./locationAssignments";
import { WorkEntries } from "./workEntries";

/**
 * USERS_TABLE
 *
 * Stores user information and their role assignments.
 * Users can be assigned to multiple locations through the LocationAssignments junction table.
 * Role-based permissions control access levels (employee, admin, super_admin).
 *
 * Business Rules:
 * - Employee IDs must be unique across all locations and permanently retired when user leaves
 * - Role defaults to 'employee' for new hires
 * - Every user must be assigned to at least one location via LocationAssignments table
 * - Super admins have access to all locations regardless of LocationAssignments assignments
 * - Admins can only see/manage employees from locations they share access to
 * - Employees have read-only access and cannot create/update/delete any batch, strain, or location data
 *
 * Relationships:
 * - Many-to-many with locations via LocationAssignments junction table
 * - One-to-many with workEntires (tracks individual work contributions)
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

export const Users = pgTable("users", {
    id,
    employeeID: integer().unique(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    role: roleStatusEnum().notNull().default('employee'),
    email: text().unique().notNull(),
    createdAt,
    updatedAt
})



export const UsersRelations = relations(Users, ({ many }) => ({
  // One user can be assigned to many locations
  LocationAssignments: many(LocationAssignments),
  
  // One user can have many daily work records
  WorkEntries: many(WorkEntries),
}));

