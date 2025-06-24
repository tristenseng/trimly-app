import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { UserTable } from "./user";
import { LocationTable } from "./location";

/**
 * USERLOCATION_TABLE
 *
 * Junction table managing many-to-many relationships between users and locations.
 * Controls location-based access permissions and defines where employees can work.
 * Foundation for admin filtering and location-specific data visibility.
 *
 * Business Rules:
 * - Every user must be assigned to at least one location (business rule enforced in application)
 * - Admins can only be assigned to one location (business rule enforced in application)
 * - Employees can be assigned to multiple locations for cross-location work
 * - Super admins have access to all locations regardless of assignments in this table
 * - Users cannot have duplicate location assignments (enforced by unique constraint)
 * - Location assignments control which employees admins can see and manage
 *
 * Relationships:
 * - Many-to-one with users (users can have multiple location assignments)
 * - Many-to-one with locations (locations can have multiple user assignments)
 * - Referenced by admin filtering logic to determine accessible employees and data
 * - Critical for location-based access control throughout the system
 *
 * Notes:
 * - Enables employee transfers between locations while maintaining historical assignments
 * - Admin dropdown filtering uses this table to show only relevant employees
 * - Super admin access bypassed through application logic, not database constraints
 * - Cascade delete ensures cleanup when users are removed from system
 * - Foundation for future location-based reporting and workforce management
 */

export const UserLocationTable = pgTable('userLocations', {
    id,
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, {onDelete: 'cascade'}),
    locationName: text()
        .notNull()
        .references(() => LocationTable.name, {onDelete: 'restrict'})
}, (table) => [
    uniqueIndex('UserLocationTable_userId_locationName_unique')
        .on(table.userId, table.locationName)
])