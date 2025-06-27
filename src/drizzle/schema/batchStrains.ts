import { boolean, date, pgTable, primaryKey, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { Batches } from "./batches";
import { Strains } from "./strains";
import { relations } from "drizzle-orm";
import { WorkEntries } from "./workEntries";

/**
 * BATCHSTRAIN_TABLE
 *
 * Junction table managing many-to-many relationships between batches and strains.
 * Defines which strains are processed within each batch.
 * Controls valid strain-batch combinations for downstream work logging and day tracking.
 *
 * Business Rules:
 * - Each batch can contain multiple different strains.
 * - Each strain can be used across multiple batches (same strain grown in different batch processing cycles)
 * - Cannot have duplicate strain assignments within the same batch (enforced by unique constraint)
 * - Must reference valid batch and strain records that exist in their respective tables
 * - Batch-strain combinations cannot be deleted if referenced by workEntries records
 * - Only admins can create, read, update, or delete batch-strain assignments
 *
 * Relationships:
 * - Many-to-one with batches (batches can have multiple strain assignments)
 * - Many-to-one with strains (strains can be assigned to multiple batches)
 * - One-to-many with workEntries (each workEntries record references a specific batch-strain combination on a specific day)
 * - Controls which strain-batch combinations are valid for daily work logging
 *
 * Notes:
 * - Essential validation layer ensuring work can only be logged on valid strain-batch pairs
 * - Enables multi-strain batch processing cycles and tracking
 * - Cascade delete on batch removal automatically cleans up strain assignments
 * - Foundation for strain-specific batch reporting and analytics
 * - Required record before any daily work can be logged for a batch-strain combination
 */


export const BatchStrains = pgTable('batchStrains', {
  id,
  batchId: uuid()
      .notNull()
      .references(() => Batches.id, { onDelete: 'cascade'}),
  strainId: uuid()
      .notNull()
      .references(() => Strains.id, { onDelete: 'restrict' }),
}, (table) => [
  uniqueIndex('BatchStrains_batchId_strainId_unique')
      .on(table.batchId, table.strainId)
])


export const BatchStrainsRelations = relations(BatchStrains, ({ one, many }) => ({
  // Many batch-strains belong to one batch
  Batches: one(Batches, {
    fields: [BatchStrains.batchId],
    references: [Batches.id],
  }),
  
  // Many batch-strains belong to one strain
  Strains: one(Strains, {
    fields: [BatchStrains.strainId],
    references: [Strains.id],
  }),
  
  // One batch-strain can have many work entries
  WorkEntries: many(WorkEntries),
}));

