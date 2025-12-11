import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const image = pgTable(
	"image",
	{
		id: text("id").primaryKey(),
		storageKey: text("storage_key").notNull().unique(),
		filename: text("filename").notNull(),
		mimeType: text("mime_type").notNull(),
		sizeBytes: integer("size_bytes").notNull(),
		width: integer("width"),
		height: integer("height"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		originUrl: text("origin_url"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("image_userId_idx").on(table.userId),
		index("image_storageKey_idx").on(table.storageKey),
	],
);

export const imageRelations = relations(image, ({ one }) => ({
	owner: one(user, {
		fields: [image.userId],
		references: [user.id],
	}),
}));
