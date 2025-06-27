import { pgTable, text, uuid, jsonb, timestamp } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { Users } from "./Users";

export const AuditLogs = pgTable('audit_logs', {
  id,
  tableName: text().notNull(), // Which table was changed
  recordId: uuid().notNull(),  // Which record was changed
  operation: text().notNull(), // 'INSERT', 'UPDATE', 'DELETE'
  oldValues: jsonb(),          // Previous state
  newValues: jsonb(),          // New state
  userId: uuid().references(() => Users.id),
  timestamp: timestamp().notNull().defaultNow(),
  ipAddress: text(),
});