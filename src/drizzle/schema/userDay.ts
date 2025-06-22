import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { UserTable } from "./user";
import { DayTable } from "./day";


export const userDay = pgTable('userDay', {
    id,
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, {onDelete: 'restrict'}),
    daysId: uuid()
        .notNull()
        .references(() => DayTable.id, {onDelete: 'restrict'}),
    amount: text().notNull(),
    hours: text().notNull(),
    notes: text()
}, (table) => [
    uniqueIndex('userDay_userId_daysId')
        .on(table.userId, table.daysId)
])