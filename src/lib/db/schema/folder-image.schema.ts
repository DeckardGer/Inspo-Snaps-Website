import { relations } from "drizzle-orm";
import {
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { folder } from "./folder.schema";
import { image } from "./image.schema";

export const folderImage = pgTable(
	"folder_image",
	{
		folderId: text("folder_id")
			.notNull()
			.references(() => folder.id, { onDelete: "cascade" }),
		imageId: text("image_id")
			.notNull()
			.references(() => image.id, { onDelete: "cascade" }),
		addedAt: timestamp("added_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.folderId, table.imageId] }),
		index("folderImage_folderId_idx").on(table.folderId),
		index("folderImage_imageId_idx").on(table.imageId),
	],
);

export const folderImageRelations = relations(folderImage, ({ one }) => ({
	folder: one(folder, {
		fields: [folderImage.folderId],
		references: [folder.id],
	}),
	image: one(image, {
		fields: [folderImage.imageId],
		references: [image.id],
	}),
}));
