import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema/notification.schema";
import { resolveAvatarUrl } from "@/lib/storage/s3";
import type { NotificationData, NotificationWithActor } from "./types";

const GetNotificationsInput = z.object({
	limit: z.number().min(1).max(100).optional().default(50),
	offset: z.number().min(0).optional().default(0),
	unreadOnly: z.boolean().optional().default(false),
});

const NotificationIdInput = z.object({
	notificationId: z.string().min(1),
});

/**
 * Get notifications for the current user
 */
export const getNotifications = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(GetNotificationsInput)
	.handler(async ({ data, context }): Promise<NotificationWithActor[]> => {
		const whereClause = data.unreadOnly
			? and(
					eq(notification.userId, context.user.id),
					eq(notification.read, false),
				)
			: eq(notification.userId, context.user.id);

		const notifications = await db.query.notification.findMany({
			where: whereClause,
			orderBy: [desc(notification.createdAt)],
			limit: data.limit,
			offset: data.offset,
			with: {
				actor: {
					columns: { id: true, name: true, image: true },
				},
			},
		});

		return Promise.all(
			notifications.map(async (n) => ({
				id: n.id,
				userId: n.userId,
				type: n.type as NotificationData["type"],
				data: n.data,
				actorId: n.actorId,
				actor: n.actor
					? { ...n.actor, image: await resolveAvatarUrl(n.actor.image) }
					: n.actor,
				read: n.read,
				readAt: n.readAt,
				createdAt: n.createdAt,
			})),
		);
	});

/**
 * Get count of unread notifications
 */
export const getUnreadCount = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const result = await db
			.select({ count: count() })
			.from(notification)
			.where(
				and(
					eq(notification.userId, context.user.id),
					eq(notification.read, false),
				),
			);

		return { count: result[0]?.count ?? 0 };
	});

/**
 * Mark a single notification as read
 */
export const markAsRead = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(NotificationIdInput)
	.handler(async ({ data, context }) => {
		await db
			.update(notification)
			.set({
				read: true,
				readAt: new Date(),
			})
			.where(
				and(
					eq(notification.id, data.notificationId),
					eq(notification.userId, context.user.id),
				),
			);

		return { success: true };
	});

/**
 * Mark all notifications as read for the current user
 */
export const markAllAsRead = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		await db
			.update(notification)
			.set({
				read: true,
				readAt: new Date(),
			})
			.where(
				and(
					eq(notification.userId, context.user.id),
					eq(notification.read, false),
				),
			);

		return { success: true };
	});

/**
 * Delete a notification
 */
export const deleteNotification = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(NotificationIdInput)
	.handler(async ({ data, context }) => {
		await db
			.delete(notification)
			.where(
				and(
					eq(notification.id, data.notificationId),
					eq(notification.userId, context.user.id),
				),
			);

		return { success: true };
	});
