/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PgColumnBuilderBase } from 'drizzle-orm/pg-core';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';

dayjs.extend(utc);

const timestamps = {
    createdAt: timestamp('created_at')
        .notNull()
        .$defaultFn(() => dayjs().utc().toDate()),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$defaultFn(() => dayjs().utc().toDate())
        .$onUpdate(() => dayjs().utc().toDate()),
} as const;

const softDeleteTimestamps = {
    ...timestamps,
    deletedAt: timestamp('deleted_at'),
} as const;

// Type-safe helper to merge timestamps with schema
type WithTimestamps<T> = T & typeof timestamps;
type WithSoftDeleteTimestamps<T> = T & typeof softDeleteTimestamps;

export const dbTable = <T extends Record<string, PgColumnBuilderBase>>(
    name: string,
    schema: T,
    opts: { timestamps?: Record<string, PgColumnBuilderBase> } = {},
    ...args: any[]
) => {
    const timestampsToAdd = opts.timestamps || timestamps;
    const schemaWithTimestamps = { ...schema, ...timestampsToAdd } as WithTimestamps<T>;

    return pgTable(name, schemaWithTimestamps, ...args);
};

export const softDeleteDbTable = <T extends Record<string, PgColumnBuilderBase>>(
    name: string,
    schema: T,
    opts: { timestamps?: Record<string, PgColumnBuilderBase> } = {},
    ...args: any[]
) => {
    const timestampsToAdd = opts.timestamps || softDeleteTimestamps;
    const schemaWithTimestamps = { ...schema, ...timestampsToAdd } as WithSoftDeleteTimestamps<T>;

    return pgTable(name, schemaWithTimestamps, ...args);
};
