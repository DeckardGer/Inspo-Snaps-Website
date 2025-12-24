ALTER TABLE "folder" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "folder_organizationId_idx" ON "folder" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "folder_organizationId_parentId_idx" ON "folder" USING btree ("organization_id","parent_id");