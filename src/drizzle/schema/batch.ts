import { date, integer, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { LocationTable } from "./location";


/**
 * BATCHES TABLE
 * 
 * Represents a single cycle
 * Each batch is a production cycle that processes multiple strains simultaneously.
 * 
 * Business Rules:
 * - New batch created for each cycle
 * - Batch number is sequential within each location (Location A: 1,2,3... Location B: 1,2,3...)
 * - Multiple batches can run simultaneously at same location due to cycle overlaps
 * - Typical overlap: 1 day or less when previous batch extends beyond its target day
 * - endDate remains null until batch completion (actual vs planned duration)
 * - Status changes from 'in_progress' → 'published' when ALL strains completed
 * 
 * 
 * Relationships:
 * - One batch can contain multiple strains (via batchStrains)
 * - One batch has multiple work days (vary between 4-7 depending on location, amount of workers, etc)
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


//one batch to many locations
//one batch to many batchStrains

