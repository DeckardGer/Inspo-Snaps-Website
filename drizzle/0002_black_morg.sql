CREATE TYPE "public"."folder_color" AS ENUM('slate', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose');--> statement-breakpoint
CREATE TABLE "folder" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" "folder_color",
	"emoji" text,
	"user_id" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" text PRIMARY KEY NOT NULL,
	"storage_key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"user_id" text NOT NULL,
	"origin_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "folder_image" (
	"folder_id" text NOT NULL,
	"image_id" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "folder_image_folder_id_image_id_pk" PRIMARY KEY("folder_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "share_link" (
	"id" text PRIMARY KEY NOT NULL,
	"folder_id" text NOT NULL,
	"created_by" text NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_share" (
	"folder_id" text NOT NULL,
	"shared_with_user_id" text NOT NULL,
	"shared_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_share_folder_id_shared_with_user_id_pk" PRIMARY KEY("folder_id","shared_with_user_id")
);
--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_image" ADD CONSTRAINT "folder_image_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_image" ADD CONSTRAINT "folder_image_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_link" ADD CONSTRAINT "share_link_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_link" ADD CONSTRAINT "share_link_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_share" ADD CONSTRAINT "user_share_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_share" ADD CONSTRAINT "user_share_shared_with_user_id_user_id_fk" FOREIGN KEY ("shared_with_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_share" ADD CONSTRAINT "user_share_shared_by_user_id_user_id_fk" FOREIGN KEY ("shared_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "folder_userId_idx" ON "folder" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "folder_parentId_idx" ON "folder" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "folder_userId_parentId_idx" ON "folder" USING btree ("user_id","parent_id");--> statement-breakpoint
CREATE INDEX "image_userId_idx" ON "image" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "image_storageKey_idx" ON "image" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "folderImage_folderId_idx" ON "folder_image" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "folderImage_imageId_idx" ON "folder_image" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "shareLink_folderId_idx" ON "share_link" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "shareLink_createdBy_idx" ON "share_link" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "userShare_folderId_idx" ON "user_share" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "userShare_sharedWithUserId_idx" ON "user_share" USING btree ("shared_with_user_id");--> statement-breakpoint
CREATE INDEX "userShare_sharedByUserId_idx" ON "user_share" USING btree ("shared_by_user_id");