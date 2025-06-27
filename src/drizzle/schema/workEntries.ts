import { date, numeric, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { Users } from "./Users";
import { relations } from "drizzle-orm";
import { BatchStrains } from "./batchStrains";

/**
 * WORKENTRIES_TABLE
 *
 * Junction table tracking individual employee work contributions on specific days and batches.
 * Core operational record linking workers, work days, and batch processing activities.
 * Primary data source for payroll, productivity tracking, and batch labor allocation.
 * 
 * Business Rules:
 * - Each record represents one employee's work on one strain within one batch for one day
 * - Employees can only have one work record per day per strain (enforced by unique constraint)
 * - Only admins can create, read, update, or delete workEntries records (employees have read-only access)
 * - Admins can only create records for employees at their shared location
 * - All work entries must reference valid combinations of users, and batch-strain pairs
 * - Amount refers to the amount (in grams) processed by the user for a specific strain on a specific day within a specific batch.
 * - Hour refers to the duration of work it took to process that amount (in grams).
 *
 * Relationships:
 * - Many-to-one with users (tracks which employee performed the work)
 * - Many-to-one with batchStrains (tracks what strain the work was performed on)
 * - Many-to-one with batches (tracks which batch was worked on)
 * - Location-based access control inherited through user-location and batch-location relationships
 *
 * Notes:
 * - Central entity for all work tracking and labor management
 * - Enables location-specific filtering through related user and batch location assignments
 * - Foundation for payroll calculations, productivity analytics, and batch cost tracking
 */

export const WorkEntries = pgTable('workEntries', {
  id,
  userId: uuid()
      .notNull()
      .references(() => Users.id, {onDelete: 'restrict'}),
  batchStrainsId: uuid()
      .notNull()
      .references(() => BatchStrains.id, {onDelete: 'cascade'}),
  date: date().notNull(),
  amount: numeric({precision: 6, scale: 2}).notNull(),
  hours: numeric({precision: 4, scale: 2}).notNull(),
  notes: text()
}, (table) => [
  uniqueIndex('WorkEntries_userId_batchStrainsId_date')
      .on(table.userId, table.batchStrainsId, table.date)
])


export const workEntriesRelations = relations(WorkEntries, ({ one }) => ({
  // Many work entries belong to one user
  Users: one(Users, {
    fields: [WorkEntries.userId],
    references: [Users.id],
  }),
  
  // Many work entries belong to one batchstrain
  BatchStrains: one(BatchStrains, {
    fields: [WorkEntries.batchStrainsId],
    references: [BatchStrains.id],
  }),
}));
