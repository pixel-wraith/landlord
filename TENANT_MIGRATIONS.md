# Tenant Database Migrations

This project now supports separate schemas for tenant databases. Each user gets their own database with a dedicated schema that's separate from the main system schema.

## How It Works

1. **User Signup**: When a user signs up, a new tenant database is automatically created
2. **Tenant Schema**: Tenant databases use a separate schema defined in `src/lib/server/db/schema/tenant.ts`
3. **Automatic Migration**: New tenant databases automatically get the latest tenant schema applied
4. **Manual Migration**: Existing tenant databases can be updated using the migration scripts

## Schema Files

- **Main Schema**: `src/lib/server/db/schema/` - Contains system tables (users, etc.)
- **Tenant Schema**: `src/lib/server/db/schema/tenant.ts` - Contains tenant-specific tables (log messages, etc.)

## Available Commands

### Generate Tenant Migrations
```bash
npm run db:generate:tenant
```
This creates new migration files in `src/lib/server/db/tenant-migrations/` based on changes to the tenant schema.

### Apply Tenant Migrations to All Existing Databases
```bash
npm run db:migrate:tenant
```
This applies all pending tenant migrations to all existing tenant databases.



### Standard Database Commands
```bash
npm run db:generate    # Generate main schema migrations
npm run db:migrate     # Apply main schema migrations
npm run db:push        # Push main schema changes directly
npm run db:studio      # Open Drizzle Studio
```

## Current Tenant Schema

The tenant schema currently includes:

- **log_message**: A table for storing user log messages
  - `id`: Unique identifier
  - `message`: The log message text
  - `createdAt`: When the message was created
  - `updatedAt`: When the message was last updated

## Adding New Tenant Tables

To add new tables to tenant databases:

1. Edit `src/lib/server/db/schema/tenant.ts`
2. Run `npm run db:generate:tenant` to create migration files
3. Run `npm run db:migrate:tenant` to apply to existing databases
4. New databases will automatically get the updated schema

## Database Naming Convention

Tenant databases follow the pattern: `tenant_{tenantId}` where hyphens are replaced with underscores.

Example: `tenant_123e4567_e89b_12d3_a456_426614174000`

## Migration Process

1. **New Users**: Automatically get the latest tenant schema when their database is created
2. **Existing Users**: Need manual migration using `npm run db:migrate:tenant`
3. **Schema Changes**: Always generate new migrations before applying

## Troubleshooting

- If tenant migrations fail during user creation, the user will still be created but the database won't have the tenant schema
- Check the console logs for migration errors
- Run `npm run db:migrate:tenant` manually to apply missing migrations
- Ensure the `tenant-migrations` directory exists and contains migration files
