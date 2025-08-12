import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { pgTable } from 'drizzle-orm/pg-core';

export const logMessage = pgTable('log_message', {
    id: uuid().primaryKey().defaultRandom().unique(),
    subject: text(), // New column for log message subjects
    message: text().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
});

export const selectLogMessageSchema = createSelectSchema(logMessage);
