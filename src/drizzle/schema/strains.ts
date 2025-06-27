import { numeric, pgTable, text } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { BatchStrains } from "./batchStrains";

/**
 * STRAINS_TABLE
 *
 * Central registry of all strains available.
 * Each strain represents a distinct genetic variety that can be grown across batches.
 *
 * Business Rules:
 * - Strain names must be unique and serve as primary reference across the system
 * - Once referenced by batches, strain names should not be changed to preserve data integrity
 * - Strains are shared across all locations (not location-specific)
 * - Multiple batches can use the same strain simultaneously across different locations
 * - No restrictions on which locations can process which strains
 * - Strains cannot be deleted if they have active batch references
 * - bucketWeight refers to the default weight in pounds of this specific strain that fits into a single standardized bucket.
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

export const Strains = pgTable('strains', {
  id,
  name: text().unique().notNull(),
  description: text(),
  bucketWeight: numeric({precision: 6, scale:3}).notNull(),
  notes: text()
})

export const strainTableRelations = relations(Strains, ({ many }) => ({
  // One strain can be used in many batches
  batchStrains: many(BatchStrains),
}));
