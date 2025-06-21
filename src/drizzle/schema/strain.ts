import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

export const StrainTable = pgTable('strains', {
    id,
    name: text().unique().notNull(),
    description: text(),
    bucketWeight: integer(),
    notes: text()
})