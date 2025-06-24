import { boolean, date, pgTable, primaryKey, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { BatchTable } from "./batch";
import { StrainTable } from "./strain";

/**
 * BATCHSTRAIN_TABLE
 *
 * Junction table managing many-to-many relationships between batches and strains.
 * Defines which strains are processed within each batch.
 * Controls valid strain-batch combinations for downstream work logging and day tracking.
 *
 * Business Rules:
 * - Each batch can contain multiple different strains.
 * - Each strain can be used across multiple batches (same strain grown in different cycles)
 * - Cannot have duplicate strain assignments within the same batch (enforced by unique constraint)
 * - Must reference valid batch and strain records that exist in their respective tables
 * - Batch-strain combinations cannot be deleted if referenced by day records
 * - Only admins can create, read, update, or delete batch-strain assignments
 *
 * Relationships:
 * - Many-to-one with batches (batches can have multiple strain assignments)
 * - Many-to-one with strains (strains can be assigned to multiple batches)
 * - One-to-many with days (each day record references a specific batch-strain combination)
 * - Controls which strain-batch combinations are valid for daily work logging
 *
 * Notes:
 * - Essential validation layer ensuring work can only be logged on valid strain-batch pairs
 * - Enables multi-strain batch cultivation and tracking
 * - Cascade delete on batch removal automatically cleans up strain assignments
 * - Foundation for strain-specific batch reporting and cultivation analytics
 * - Required record before any daily work can be logged for a batch-strain combination
 */


export const BatchStrainTable = pgTable('batchStrains', {
    id,
    batchId: uuid()
        .notNull()
        .references(() => BatchTable.id, { onDelete: 'cascade'}),
    strainId: uuid()
        .notNull()
        .references(() => StrainTable.id, { onDelete: 'restrict' }),
    isCompleted: boolean().notNull().default(false)
}, (table) => [
    uniqueIndex('BatchStrainTable_batchId_strainId_unique')
        .on(table.batchId, table.strainId)
])


//many batchStrain to one batch
//many batchStrain to one strain
//one batchStrain to many day
