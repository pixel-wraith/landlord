ALTER TABLE "user" ADD COLUMN "tenantId" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "databaseName" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "databaseUrl" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_tenantId_unique" UNIQUE("tenantId");