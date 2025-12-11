import { relations } from "drizzle-orm";
import {
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { folder } from "./folder.schema";

export const favouriteFolder = pgTable(
	"favourite_folder",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		folderId: text("folder_id")
			.notNull()
			.references(() => folder.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.folderId] }),
		userIdIdx: index("favouriteFolder_userId_idx").on(table.userId),
		folderIdIdx: index("favouriteFolder_folderId_idx").on(table.folderId),
	}),
);

export const favouriteFolderRelations = relations(
	favouriteFolder,
	({ one }) => ({
		user: one(user, {
			fields: [favouriteFolder.userId],
			references: [user.id],
		}),
		folder: one(folder, {
			fields: [favouriteFolder.folderId],
			references: [folder.id],
		}),
	}),
);
