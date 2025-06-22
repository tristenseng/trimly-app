import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { LocationTable } from "./location";
import { createdAt, id, updatedAt } from "../schemaHelpers";

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
    locationName: text()
        .references(() => LocationTable.name, {onDelete: 'restrict'})
        .notNull(),
    role: roleStatusEnum().notNull().default('employee'),
    email: text().unique().notNull(),
    createdAt,
    updatedAt
})