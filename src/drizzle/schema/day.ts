import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { batchTable } from "./batch";
import { StrainTable } from "./strain";

export const dayTable = pgTable('days', {
    id,
    batchId: uuid()
        .notNull()
        .references(() => batchTable.id, {onDelete: 'restrict'}),
    batchDay: integer().notNull(),
    //strainname restricted to those connected to the batchId
    strainName: text()
        .notNull()
        .references(() => StrainTable.name, { onDelete: 'restrict'}),
    notes: text(),
}, (table) => [
    //no two days can have the same batchid and same strainName
    uniqueIndex('dayTable_batchDay_strainName_unique')
        .on(table.batchId, table.batchDay, table.strainName)
])