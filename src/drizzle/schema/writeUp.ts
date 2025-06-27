/**
 * WRITEUPS_TABLE
 *
 * Disciplinary action tracking system for managing employee compliance issues.
 * Records formal write-ups issued to employees for policy violations, performance issues,
 * or workplace infractions. Maintains complete audit trail of disciplinary actions.
 *
 * Business Rules:
 * - Only admins and super_admins can create, read, update, or delete write-up records
 * - Admins can only issue write-ups to employees at their shared location(s)
 * - Super admins can issue write-ups to employees at any location
 * - Write-ups are numbered sequentially per employee for tracking purposes
 * - Status progression: 'active' → 'resolved' → 'dismissed' (optional status changes)
 * - Severity levels determine escalation paths and required follow-up actions
 * - Write-ups cannot be deleted, only marked as dismissed to preserve audit trail
 * - Follow-up date required for severe infractions to ensure proper resolution
 *
 * Relationships:
 * - Many-to-one with users (employees can have multiple write-ups)
 * - Many-to-one with users via issuedBy (tracks which admin issued the write-up)
 * - Location-based access control inherited through user-location relationships
 *
 * Notes:
 * - Maintains permanent record for HR compliance and legal protection
 * - Supports progressive discipline policies with severity escalation
 * - Integration point for future performance review and termination processes
 */

import { date, index, integer, pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { Users } from "./Users"

export const writeUpSeverities = ['verbal_warning', 'written_warning', 'final_warning', 'suspension', 'termination'] as const
export type writeUpSeverity = (typeof writeUpSeverities)[number]
export const writeUpSeverityEnum = pgEnum(
    "writeup_severities",
    writeUpSeverities,
)

export const WriteUpTable = pgTable('writeUps', {
    id,
    employeeId: uuid()
        .notNull()
        .references(() => Users.id, {onDelete: 'restrict'}),
    issuedBy: uuid()
        .notNull()
        .references(() => Users.id, {onDelete: 'restrict'}),
    writeUpNumber: integer().notNull(),     // Sequential per employee
    severity: writeUpSeverityEnum().notNull(),
    issueDate: date().notNull(),           // When write-up was issued
    incidentDate: date().notNull(),        // When incident occurred
    followUpDate: date(),                  // Required follow-up date for severe cases
    description: text().notNull(),         // Detailed incident description
    correctiveAction: text(),             // Required corrective action from employee
    employeeResponse: text(),             // Employee's response/acknowledgment
    witnessInformation: text(),           // Any witness details
    resolvedDate: date(),                 // When issue was marked resolved
    resolvedBy: uuid()
        .references(() => Users.id, {onDelete: 'restrict'}),
    resolutionNotes: text(),              // Resolution details
    createdAt,
    updatedAt
}, (table) => [
    // Ensure unique write-up numbering per employee
    uniqueIndex('WriteUpTable_employeeId_writeUpNumber_unique')
        .on(table.employeeId, table.writeUpNumber),
    
    // Index for efficient querying by severity
    index('WriteUpTable_severity_idx')
        .on(table.severity),
    
    // Index for date-based queries
    index('WriteUpTable_issueDate_idx')
        .on(table.issueDate)
])
