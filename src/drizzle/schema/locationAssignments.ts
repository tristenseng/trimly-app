import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { Users } from "./Users";
import { Locations } from "./locations";
import { relations } from "drizzle-orm";

/**
 * LOCATIONASSIGNMENTS_TABLE
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

export const LocationAssignments = pgTable('locationAssignments', {
  id,
  userId: uuid()
      .notNull()
      .references(() => Users.id, {onDelete: 'cascade'}),
  locationId: uuid()
      .notNull()
      .references(() => Locations.id, {onDelete: 'restrict'})
}, (table) => [
  uniqueIndex('LocationAssignments_userId_locationId_unique')
      .on(table.userId, table.locationId)
])


export const LocationAssignmentsRelations = relations(LocationAssignments, ({ one }) => ({
  // Many user locations belong to one user
  Users: one(Users, {
    fields: [LocationAssignments.userId],
    references: [Users.id],
  }),
  
  // Many user locations belong to one location
  Locations: one(Locations, {
    fields: [LocationAssignments.locationId],
    references: [Locations.id],
  }),
}));
