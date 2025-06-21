import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { batchTable } from "./batch";
import { StrainTable } from "./strain";




export const batchStrainTable = pgTable('batchStrains', {
    batchId: uuid()
        .notNull()
        .references(() => batchTable.id, { onDelete: 'cascade'}),
    strainId: uuid()
        .notNull()
        .references(() => StrainTable.id, { onDelete: 'restrict' }),
}, (table) => [
    primaryKey({ columns: [table.batchId, table.strainId]})
])
