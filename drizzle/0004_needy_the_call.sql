ALTER TABLE "folder" ALTER COLUMN "color" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "public"."folder" ALTER COLUMN "color" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."folder_color" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."folder_color" AS ENUM('slate', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'rose');--> statement-breakpoint
ALTER TABLE "public"."folder" ALTER COLUMN "color" SET DATA TYPE "public"."folder_color" USING "color"::"public"."folder_color";--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "color" SET DEFAULT 'indigo';