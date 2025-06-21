import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { BatchTable } from "./batch";
import { StrainTable } from "./strain";




export const BatchStrainTable = pgTable('batchStrains', {
    batchId: uuid()
        .notNull()
        .references(() => BatchTable.id, { onDelete: 'cascade'}),
    strainId: uuid()
        .notNull()
        .references(() => StrainTable.id, { onDelete: 'restrict' }),
}, (table) => [
    primaryKey({ columns: [table.batchId, table.strainId]})
])
