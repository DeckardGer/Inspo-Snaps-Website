import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { folder } from "./folder.schema";

export const shareLink = pgTable(
	"share_link",
	{
		id: text("id").primaryKey(),
		folderId: text("folder_id")
			.notNull()
			.references(() => folder.id, { onDelete: "cascade" }),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("shareLink_folderId_idx").on(table.folderId),
		index("shareLink_createdBy_idx").on(table.createdBy),
		index("shareLink_expiresAt_idx").on(table.expiresAt),
	],
);

export const shareLinkRelations = relations(shareLink, ({ one }) => ({
	folder: one(folder, {
		fields: [shareLink.folderId],
		references: [folder.id],
	}),
	creator: one(user, {
		fields: [shareLink.createdBy],
		references: [user.id],
	}),
}));
