import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

/**
 * LOCATION_TABLE
 *
 * Central registry of all operational locations where work is performed.
 * Serves as the primary reference for location-based access control and batch tracking.
 * 
 * Business Rules:
 * - Location names must be unique and serve as primary reference across the system
 * - Once referenced by batches or user assignments, location names should not be changed
 * - Each location maintains independent batch numbering sequences
 * - Admins can only be assigned to one location, employees can be assigned to multiple
 * - Super admins have access to all locations regardless of assignments
 * - Locations cannot be deleted if they have active user assignments or batch references
 *
 * Relationships:
 * - Many-to-many with users via userLocations junction table
 * - One-to-many with batches (each batch belongs to one location)
 * - Referenced by various downstream tables for location-specific operations
 *
 * Notes:
 * - Name field used as foreign key reference throughout the system
 * - Location-based filtering ensures admins only see relevant data
 * - Locations can become inactive.
 */

export const LocationTable = pgTable('locations', {
    id,
    name: text().unique().notNull(),
    notes: text(),
    isActive: boolean().notNull().default(true)
})

//one location to many batches
//many location to many users