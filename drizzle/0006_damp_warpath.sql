CREATE TYPE "public"."share_status" AS ENUM('pending', 'accepted', 'cancelled');--> statement-breakpoint
ALTER TABLE "user_share" ADD COLUMN "status" "share_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
UPDATE "user_share" SET "status" = 'accepted';--> statement-breakpoint
CREATE INDEX "userShare_status_idx" ON "user_share" USING btree ("status");