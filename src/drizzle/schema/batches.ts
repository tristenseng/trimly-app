import { date, integer, pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { Locations } from "./locations";
import { relations } from "drizzle-orm";
import { BatchStrains } from "./batchStrains";


/**
 * BATCHES_TABLE
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
 *
 * Notes:
 * - startDate marks beginning of actual batch processing (not planning phase)
 * - Batch processing cycles can run shorter or longer than planned depending on various factors
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

export const Batches = pgTable('batches', {
    id,
    locationId: uuid()
        .references(() => Locations.id, { onDelete: 'restrict'})
        .notNull(),
    number: integer().notNull(),    //sequential per location
    startDate: date().notNull(),    //start of cycle
    endDate: date(),                //when batch is complete
    status: batchStatusEnum().notNull().default('in_progress'),
    notes: text(),                  //production notes, issues, observations
    createdAt,
    updatedAt
}, (table) => [
        //there cannot be two batches with the same batch number at the same location
        uniqueIndex('Batches_locationId_number')
            .on(table.locationId, table.number)
])

export const BatchesRelations = relations(Batches, ({one, many}) => ({
  // Many batches belong to one location
  Locations: one(Locations, {
    fields: [Batches.locationId],
    references: [Locations.id],
  }),
  
  // One batch can have many strain assignments
  BatchStrains: many(BatchStrains),
}));
