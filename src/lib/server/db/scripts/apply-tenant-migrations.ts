import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

async function applyTenantMigrations() {
    try {
        console.log('Starting tenant migrations...');

        // Parse main database URL for connection details
        let mainDbUrl = process.env.DATABASE_URL;
        if (!mainDbUrl) {
            throw new Error('DATABASE_URL is not set');
        }

        // If running from host machine, convert Docker service name to localhost
        if (mainDbUrl.includes('@db:')) {
            mainDbUrl = mainDbUrl.replace('@db:5432', '@localhost:5433');
        }

        // Connect to main database to get user information
        const mainClient = postgres(mainDbUrl);
        const mainDb = drizzle(mainClient);

        // Get all users with tenant databases
        const usersWithDatabases = await mainDb.execute(
            'SELECT id, "databaseName" FROM "user" WHERE "databaseName" IS NOT NULL'
        );

        console.log(`Found ${usersWithDatabases.length} tenant databases to migrate`);

        if (usersWithDatabases.length === 0) {
            console.log('No tenant databases found. Skipping migrations.');
            await mainClient.end();
            return;
        }

        // Read migration files from tenant-migrations directory
        const migrationsDir = join(process.cwd(), 'src/lib/server/db/tenant-migrations');
        const migrationFiles = await readdir(migrationsDir);
        const sqlFiles = migrationFiles.filter(file => file.endsWith('.sql')).sort();

        console.log(`Found ${sqlFiles.length} migration files:`, sqlFiles);

        if (sqlFiles.length === 0) {
            console.log('No migration files found. Run "npm run db:generate:tenant" first.');
            await mainClient.end();
            return;
        }



        // Apply migrations to each tenant database
        for (const userRecord of usersWithDatabases) {
            const databaseName = userRecord.databaseName;
            if (!databaseName) continue;

            console.log(`\nMigrating database: ${databaseName}`);

            try {
                // Create connection to tenant database
                const tenantDbUrl = new URL(mainDbUrl);
                tenantDbUrl.pathname = `/${databaseName}`;

                const tenantClient = postgres(tenantDbUrl.toString());
                const tenantDb = drizzle(tenantClient);

                // Apply migrations
                await migrate(tenantDb, { migrationsFolder: migrationsDir });

                console.log(`✅ Successfully migrated ${databaseName}`);
                await tenantClient.end();
            } catch (error) {
                console.error(`❌ Failed to migrate ${databaseName}:`, error);
            }
        }

        await mainClient.end();
        console.log('\n🎉 Tenant migrations completed!');
    } catch (error) {
        console.error('Error applying tenant migrations:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    applyTenantMigrations();
}

export { applyTenantMigrations };
