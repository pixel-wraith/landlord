ALTER TABLE "log_message" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "log_message" ALTER COLUMN "updated_at" SET DEFAULT now();