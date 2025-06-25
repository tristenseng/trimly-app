import { numeric, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { UserTable } from "./user";
import { DayTable } from "./day";
import { relations } from "drizzle-orm";

/**
 * USERDAY_TABLE
 *
 * Junction table tracking individual employee work contributions on specific days and batches.
 * Core operational record linking workers, work days, and batch processing activities.
 * Primary data source for payroll, productivity tracking, and batch labor allocation.
 * 
 * Business Rules:
 * - Each record represents one employee's work on one strain within one batch for one day
 * - Employees can only have one work record per day per strain (enforced by unique constraint)
 * - Only admins can create, read, update, or delete userDay records (employees have read-only access)
 * - Admins can only create records for employees at their shared location
 * - All work logging must reference valid combinations of users, days, and batch-strain pairs
 * - Amount refers to the amount (in grams) processed by the user for a specific strain on a specific day within a specific batch.
 * - Hour refers to the duration of work it took to process that amount (in grams).
 *
 * Relationships:
 * - Many-to-one with users (tracks which employee performed the work)
 * - Many-to-one with days (tracks when the work was performed)
 * - Many-to-one with batches (tracks which batch was worked on)
 * - Location-based access control inherited through user-location and batch-location relationships
 *
 * Notes:
 * - Central entity for all work tracking and labor management
 * - Enables location-specific filtering through related user and batch location assignments
 * - Foundation for payroll calculations, productivity analytics, and batch cost tracking
 */

export const UserDayTable = pgTable('userDay', {
  id,
  userId: uuid()
      .notNull()
      .references(() => UserTable.id, {onDelete: 'restrict'}),
  dayId: uuid()
      .notNull()
      .references(() => DayTable.id, {onDelete: 'restrict'}),
  amount: numeric({precision: 6, scale: 2}).notNull(),
  hours: numeric({precision: 4, scale: 2}).notNull(),
  notes: text()
}, (table) => [
  uniqueIndex('UserDayTable_userId_dayId')
      .on(table.userId, table.dayId)
])


export const userDayRelations = relations(userDay, ({ one }) => ({
  // Many user days belong to one user
  user: one(UserTable, {
    fields: [userDay.userId],
    references: [UserTable.id],
  }),
  
  // Many user days belong to one day
  day: one(DayTable, {
    fields: [userDay.dayId],
    references: [DayTable.id],
  }),
}));
