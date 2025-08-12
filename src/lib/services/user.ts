import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema/user";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { env } from "$env/dynamic/private";

export class UserService {
    async createUser(email: string | null, password: string | null) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const existingUser = await db.query.user.findFirst({
                where: eq(user.email, email)
            });

            if (existingUser) {
                throw new Error('User already exists');
            }

            const newUser = await db.insert(user)
                .values({
                    email,
                    password
                })
                .returning();

            return newUser;
        } catch (error: unknown) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async createUserDatabase(userId: string) {
        try {
            // Get the user
            const userRecord = await db.query.user.findFirst({
                where: eq(user.id, userId)
            });

            if (!userRecord) {
                throw new Error('User not found');
            }

            // Generate tenant ID if not already set
            const tenantId = userRecord.tenantId || crypto.randomUUID();
            
            // Create database name based on tenant ID
            const databaseName = `tenant_${tenantId.replace(/-/g, '_')}`;
            
            // Connect to the main database to create the new tenant database
            const mainDbUrl = env.DATABASE_URL;
            if (!mainDbUrl) {
                throw new Error('DATABASE_URL is not set');
            }

            // Parse the main database URL to get connection details
            const url = new URL(mainDbUrl);
            const host = url.hostname;
            const port = url.port || '5432';
            const username = url.username;
            const password = url.password;

            // Create a connection to the main database (postgres) to create the new database
            const adminClient = postgres({
                host,
                port: parseInt(port),
                username,
                password,
                database: 'postgres', // Connect to default postgres database
                ssl: url.protocol === 'https:'
            });

            try {
                // Create the new database
                await adminClient`CREATE DATABASE ${adminClient(databaseName)}`;
                console.log(`Created database: ${databaseName}`);
            } finally {
                await adminClient.end();
            }

            // Construct the new database URL for the tenant
            const tenantDbUrl = new URL(mainDbUrl);
            tenantDbUrl.pathname = `/${databaseName}`;

            // Update the user with database information
            const [updatedUser] = await db.update(user)
                .set({
                    tenantId,
                    databaseName,
                    databaseUrl: tenantDbUrl.toString()
                })
                .where(eq(user.id, userId))
                .returning();

            // Apply tenant migrations to the new database
            try {
                await this.applyTenantMigrationsToDatabase(databaseName, mainDbUrl);
                console.log(`Applied tenant migrations to ${databaseName}`);
            } catch (migrationError) {
                console.error(`Warning: Failed to apply tenant migrations to ${databaseName}:`, migrationError);
                // Don't fail the user creation if migrations fail
            }

            return {
                user: updatedUser,
                databaseName,
                databaseUrl: tenantDbUrl.toString()
            };
        } catch (error: unknown) {
            console.error('Error creating user database:', error);
            throw error;
        }
    }

    private async applyTenantMigrationsToDatabase(databaseName: string, mainDbUrl: string) {
        try {
            // Create connection to tenant database
            const tenantDbUrl = new URL(mainDbUrl);
            tenantDbUrl.pathname = `/${databaseName}`;

            const tenantClient = postgres(tenantDbUrl.toString());
            const { drizzle } = await import('drizzle-orm/postgres-js');
            const tenantDb = drizzle(tenantClient);

            // Apply migrations from tenant-migrations directory
            const { migrate } = await import('drizzle-orm/postgres-js/migrator');
            const { join } = await import('path');
            
            const migrationsDir = join(process.cwd(), 'src/lib/server/db/tenant-migrations');
            
            await migrate(tenantDb, { migrationsFolder: migrationsDir });
            await tenantClient.end();
        } catch (error) {
            console.error(`Error applying tenant migrations to ${databaseName}:`, error);
            throw error;
        }
    }
}