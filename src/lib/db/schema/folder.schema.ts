import { relations } from "drizzle-orm";
import {
	foreignKey,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { FOLDER_COLORS } from "@/lib/folders/constants";
import { user } from "./auth.schema";

export const folderColorEnum = pgEnum("folder_color", FOLDER_COLORS);

export const folder = pgTable(
	"folder",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		color: folderColorEnum("color").notNull().default("indigo"),
		emoji: text("emoji"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		parentId: text("parent_id"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => {
		return {
			parentReference: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: "folder_parent_id_folder_id_fk",
			}).onDelete("cascade"),
			userIdIdx: index("folder_userId_idx").on(table.userId),
			parentIdIdx: index("folder_parentId_idx").on(table.parentId),
			userIdParentIdIdx: index("folder_userId_parentId_idx").on(
				table.userId,
				table.parentId,
			),
		};
	},
);

export const folderRelations = relations(folder, ({ one, many }) => ({
	owner: one(user, {
		fields: [folder.userId],
		references: [user.id],
	}),
	parent: one(folder, {
		fields: [folder.parentId],
		references: [folder.id],
		relationName: "parentChild",
	}),
	children: many(folder, { relationName: "parentChild" }),
}));
