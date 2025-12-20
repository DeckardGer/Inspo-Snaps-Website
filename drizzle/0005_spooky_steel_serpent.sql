ALTER TABLE "public"."folder" ALTER COLUMN "color" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "public"."folder" ALTER COLUMN "color" SET DATA TYPE text;--> statement-breakpoint
UPDATE "public"."folder" SET "color" = 'rose' WHERE "color" = 'pink';--> statement-breakpoint
DROP TYPE "public"."folder_color";--> statement-breakpoint
CREATE TYPE "public"."folder_color" AS ENUM('slate', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'rose');--> statement-breakpoint
ALTER TABLE "public"."folder" ALTER COLUMN "color" SET DATA TYPE "public"."folder_color" USING "color"::"public"."folder_color";--> statement-breakpoint
ALTER TABLE "public"."folder" ALTER COLUMN "color" SET DEFAULT 'indigo';