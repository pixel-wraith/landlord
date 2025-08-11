import { text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const user = sqliteTable('user', {
    id: integer().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: 'boolean' })
        .$defaultFn(() => false)
        .notNull(),
    image: text(),
    createdAt: integer({ mode: 'timestamp' })
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: integer({ mode: 'timestamp' })
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const selectHeroSchema = createSelectSchema(heroes);