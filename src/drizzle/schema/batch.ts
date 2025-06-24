import { date, integer, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { LocationTable } from "./location";
import { relations } from "drizzle-orm";
import { BatchStrainTable } from "./batchStrain";


/**
 * BATCH_TABLE
 *
 * Core production entity representing individual batch cycles.
 * Each batch processes multiple strains simultaneously at a specific location
 * with unique sequential numbering and comprehensive lifecycle tracking.
 *
 * Business Rules:
 * - Batch numbers are permanently unique within each location (Location A: 1,2,3... Location B: 1,2,3...)
 * - Maximum of two batches can be in 'in_progress' status simultaneously per location
 * - Typical batch overlap is 1 day or less when previous batch extends beyond target completion
 * - Status progression: 'planned' → 'in_progress' → 'published' (no cancellations or rollbacks)
 * - endDate remains null until ALL strains within batch are completely processed
 * - Status changes to 'published' only when all associated strains reach completion
 * - Batch duration varies based on strain varieties, amount of employees working, processing needs of locations, etc.
 *
 * Relationships:
 * - Many-to-one with locations (each batch belongs to one location permanently)
 * - One-to-many with batchStrains (tracks which strains are processed in this batch)
 * - One-to-many with days via batchStrains (tracks daily work across all strains)
 * - Referenced by userDay through day relationships for work logging
 *
 * Notes:
 * - startDate marks beginning of actual batch processing (not planning phase)
 * - Batch cycles can run shorter or longer than planned depending on various factors
 * - Individual strains within batch may complete on different days
 * - Sequential numbering enables easy batch identification within location scope
 * - Foundation for production planning, capacity management, and completion tracking
 */

export const batchStatuses = ['planned', 'in_progress', 'published'] as const
export type batchStatus = (typeof batchStatuses)[number]
export const batchStatusEnum = pgEnum(
    "batch_statuses",
    batchStatuses,
)

export const BatchTable = pgTable('batches', {
    id,
    locationName: text()
        .references(() => LocationTable.name, { onDelete: 'restrict'})
        .notNull(),
    number: integer().notNull(),    //sequential per location
    startDate: date().notNull(),    //start of cycle
    endDate: date(),                //when batch is complete
    status: batchStatusEnum().notNull().default('in_progress'),
    notes: text(),                  //production notes, issues, observations
}, (table) => [
        //there cannot be two batches with the same batch number at the same location
        uniqueIndex('BatchTable_number_locationName')
            .on(table.locationName, table.number)
])

export const batchTableRelations = relations(BatchTable, ({one, many}) => ({
  // Many batches belong to one location
  location: one(LocationTable, {
    fields: [BatchTable.locationName],
    references: [LocationTable.name],
  }),
  
  // One batch can have many strain assignments
  batchStrains: many(BatchStrainTable),
}));
