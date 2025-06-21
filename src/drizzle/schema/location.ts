import { pgTable, text } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

export const LocationTable = pgTable('locations', {
    id,
    name: text().unique().notNull(),
    notes: text()
})