CREATE TABLE "favourite_folder" (
	"user_id" text NOT NULL,
	"folder_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favourite_folder_user_id_folder_id_pk" PRIMARY KEY("user_id","folder_id")
);
--> statement-breakpoint
ALTER TABLE "favourite_folder" ADD CONSTRAINT "favourite_folder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourite_folder" ADD CONSTRAINT "favourite_folder_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favouriteFolder_userId_idx" ON "favourite_folder" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favouriteFolder_folderId_idx" ON "favourite_folder" USING btree ("folder_id");