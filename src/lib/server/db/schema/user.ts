import { text, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { softDeleteDbTable } from '../helpers/db-table';

export const user = softDeleteDbTable('user', {
    id: uuid().primaryKey().defaultRandom().unique(),
    email: text().notNull().unique(),
    password: text().notNull(),
    tenantId: uuid().defaultRandom().unique(),
    databaseName: text(),
    databaseUrl: text(),
});

export const selectUserSchema = createSelectSchema(user);