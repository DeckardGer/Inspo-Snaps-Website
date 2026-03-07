import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { NotificationData } from "@/lib/notifications/types";
import { user } from "./auth.schema";

export const NOTIFICATION_TYPES = [
	"folder_invite",
	"folder_invite_accepted",
	"folder_invite_declined",
	"folder_access_revoked",
	"team_invite",
	"team_invite_accepted",
	"team_invite_declined",
	"team_member_removed",
	"team_role_changed",
	"team_deleted",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const notificationTypeEnum = pgEnum(
	"notification_type",
	NOTIFICATION_TYPES,
);

export const notification = pgTable(
	"notification",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: notificationTypeEnum("type").notNull(),
		data: jsonb("data").$type<NotificationData>().notNull(),
		actorId: text("actor_id").references(() => user.id, {
			onDelete: "set null",
		}),
		read: boolean("read").default(false).notNull(),
		readAt: timestamp("read_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("notification_userId_idx").on(table.userId),
		index("notification_userId_read_idx").on(table.userId, table.read),
		index("notification_createdAt_idx").on(table.createdAt),
	],
);

export const notificationRelations = relations(notification, ({ one }) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id],
		relationName: "notificationRecipient",
	}),
	actor: one(user, {
		fields: [notification.actorId],
		references: [user.id],
		relationName: "notificationActor",
	}),
}));
