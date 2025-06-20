import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const StrainTable = pgTable('strains', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().unique().notNull(),
    description: text(),
    notes: text()
})