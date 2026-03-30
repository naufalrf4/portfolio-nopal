ALTER TABLE "booking_settings"
ADD COLUMN "google_calendar_refresh_token" text,
ADD COLUMN "google_calendar_calendar_id" text,
ADD COLUMN "google_calendar_calendar_name" text,
ADD COLUMN "google_calendar_connected_email" text,
ADD COLUMN "google_calendar_granted_scopes" text[],
ADD COLUMN "google_calendar_connected_at" timestamp(3);
