import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

/**
 * STRAIN_TABLE
 *
 * Central registry of all cannabis strains available for cultivation.
 * Each strain represents a distinct genetic variety that can be grown across batches.
 *
 * Business Rules:
 * - Strain names must be unique and serve as primary reference across the system
 * - Once referenced by batches, strain names should not be changed to preserve data integrity
 * - Strains are shared across all locations (not location-specific)
 * - Multiple batches can use the same strain simultaneously across different locations
 * - No restrictions on which locations can cultivate which strains
 * - Strains cannot be deleted if they have active batch references
 *
 * Relationships:
 * - One-to-many with batches (each batch grows one strain, strains can have multiple batches)
 * - Referenced throughout batch-related operations and reporting
 *
 * Notes:
 * - Name field used as foreign key reference throughout the system
 * - No soft delete implemented - strains are permanent once created
 * - Strain selection drives batch planning and workflows
 */

export const StrainTable = pgTable('strains', {
    id,
    name: text().unique().notNull(),
    description: text(),
    bucketWeight: integer().notNull(),
    notes: text()
})