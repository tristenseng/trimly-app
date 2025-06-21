import { date, integer, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { LocationTable } from "./location";


export const batchStatuses = ['in_progress', 'published'] as const
export type batchStatus = (typeof batchStatuses)[number]
export const batchStatusEnum = pgEnum(
    "batch_statuss",
    batchStatuses,
)

export const batchTable = pgTable('batches', {
    id,
    locationName: text()
        .references(() => LocationTable.name, { onDelete: 'restrict'})
        .notNull(),
    number: integer().notNull(),
    startDate: date().notNull(),
    endDate: date().notNull(),
    status: batchStatusEnum().notNull().default('in_progress'),
    notes: text(),
}, (table) => [
        //there cannot be two batches with the same batch number at the same location
        uniqueIndex('batchTable_number_location_name_')
            .on(table.locationName, table.number)
])