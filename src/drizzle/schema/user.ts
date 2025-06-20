import { integer, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { LocationTable } from "./location";
import { createdAt, updatedAt } from "../schemaHelpers";

export const roleEnum = pgEnum('role', ['employee', 'admin', 'super_admin'])

export const UserTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    employeeID: integer().unique(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    locationName: text()
        .references(() => LocationTable.name, {onDelete: 'restrict'})
        .notNull(),
    role: roleEnum().notNull().default('employee'),
    email: text().unique().notNull(),
    createdAt,
    updatedAt
})