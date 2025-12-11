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

export const userShare = pgTable(
	"user_share",
	{
		folderId: text("folder_id")
			.notNull()
			.references(() => folder.id, { onDelete: "cascade" }),
		sharedWithUserId: text("shared_with_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		sharedByUserId: text("shared_by_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.folderId, table.sharedWithUserId] }),
		index("userShare_folderId_idx").on(table.folderId),
		index("userShare_sharedWithUserId_idx").on(table.sharedWithUserId),
		index("userShare_sharedByUserId_idx").on(table.sharedByUserId),
	],
);

export const userShareRelations = relations(userShare, ({ one }) => ({
	folder: one(folder, {
		fields: [userShare.folderId],
		references: [folder.id],
	}),
	sharedWith: one(user, {
		fields: [userShare.sharedWithUserId],
		references: [user.id],
		relationName: "sharedWithUser",
	}),
	sharedBy: one(user, {
		fields: [userShare.sharedByUserId],
		references: [user.id],
		relationName: "sharedByUser",
	}),
}));
