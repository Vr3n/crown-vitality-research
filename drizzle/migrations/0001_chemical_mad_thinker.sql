ALTER TABLE "notes" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_slug_unique" UNIQUE("slug");