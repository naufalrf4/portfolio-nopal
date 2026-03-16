ALTER TABLE "AboutMe" ADD COLUMN "freelanceProfile" jsonb;--> statement-breakpoint
ALTER TABLE "anonymous_messages" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_forms" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "guestbook_entries" ADD COLUMN "ipHash" text;--> statement-breakpoint
ALTER TABLE "guestbook_entries" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;