import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { StrainTable } from "./strain";
import { BatchStrainTable } from "./batchStrain";
import { relations } from "drizzle-orm";
import { userDay } from "./userDay";

/**
 * DAY_TABLE
 *
 * Central calendar system that tracks all work days in the system.
 * Provides the foundation for logging daily work activities and batch operations.
 *
 * Business Rules:
 * - Each day record represents a unique calendar date
 * - Day must be created before work can be logged for that date
 * - Once created with work entries, day records should not be deleted
 * - System supports historical tracking of work across all past dates
 * - No restrictions on creating future date records for planning purposes
 *
 * Relationships:
 * - One-to-many with userDay (tracks individual employee work per day)
 * - Referenced by batch operations that need temporal tracking
 * - Junction point between users and their daily work contributions
 *
 * Notes:
 * - Date field used as primary reference throughout temporal queries
 * - Essential for payroll calculations and work hour tracking
 * - Enables reporting and analytics across time periods
 */

export const DayTable = pgTable('days', {
  id,
  batchStrainId: uuid()
      .notNull()
      .references(() => BatchStrainTable.id, {onDelete: 'restrict'}),
  day: integer().notNull(),
  notes: text(),
}, (table) => [
  uniqueIndex('DayTable_batchStrain_day_unique')
      .on(table.batchStrainId, table.day)
])


export const dayTableRelations = relations(DayTable, ({ one, many }) => ({
  // Many days belong to one batch-strain combination
  batchStrain: one(BatchStrainTable, {
    fields: [DayTable.batchStrainId],
    references: [BatchStrainTable.id],
  }),
  
  // One day can have many user work records
  userDays: many(userDay),
}));
