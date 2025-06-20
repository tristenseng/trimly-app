import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const LocationTable = pgTable('locations', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().unique().notNull()

})