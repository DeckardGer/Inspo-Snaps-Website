/**
 * Internal server-only functions for creating notifications.
 * These should only be imported by other server functions, never client-side code.
 */
import { db } from "@/lib/db";
import {
	type NotificationType,
	notification,
} from "@/lib/db/schema/notification.schema";
import type { FolderColor } from "@/lib/folders/constants";
import type { NotificationData } from "./types";

type CreateNotificationParams = {
	userId: string;
	type: NotificationType;
	data: NotificationData;
	actorId?: string;
};

/**
 * Create a notification (internal use only - called from other server functions)
 */
export async function createNotification(
	params: CreateNotificationParams,
): Promise<string> {
	const id = crypto.randomUUID();

	await db.insert(notification).values({
		id,
		userId: params.userId,
		type: params.type,
		data: params.data,
		actorId: params.actorId ?? null,
	});

	return id;
}

/**
 * Create notification for folder invite
 */
export async function createFolderInviteNotification(params: {
	recipientId: string;
	actorId: string;
	folderId: string;
	folderName: string;
	folderColor: FolderColor;
	folderEmoji?: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "folder_invite",
		actorId: params.actorId,
		data: {
			type: "folder_invite",
			folderId: params.folderId,
			folderName: params.folderName,
			folderColor: params.folderColor,
			folderEmoji: params.folderEmoji,
		},
	});
}

/**
 * Create notification for folder invite accepted
 */
export async function createFolderInviteAcceptedNotification(params: {
	recipientId: string;
	actorId: string;
	folderId: string;
	folderName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "folder_invite_accepted",
		actorId: params.actorId,
		data: {
			type: "folder_invite_accepted",
			folderId: params.folderId,
			folderName: params.folderName,
		},
	});
}

/**
 * Create notification for folder invite declined
 */
export async function createFolderInviteDeclinedNotification(params: {
	recipientId: string;
	actorId: string;
	folderId: string;
	folderName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "folder_invite_declined",
		actorId: params.actorId,
		data: {
			type: "folder_invite_declined",
			folderId: params.folderId,
			folderName: params.folderName,
		},
	});
}

/**
 * Create notification for folder access revoked
 */
export async function createFolderAccessRevokedNotification(params: {
	recipientId: string;
	actorId: string;
	folderName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "folder_access_revoked",
		actorId: params.actorId,
		data: {
			type: "folder_access_revoked",
			folderName: params.folderName,
		},
	});
}

/**
 * Create notification for team invite
 */
export async function createTeamInviteNotification(params: {
	recipientId: string;
	actorId: string;
	invitationId: string;
	organizationId: string;
	organizationName: string;
	role: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "team_invite",
		actorId: params.actorId,
		data: {
			type: "team_invite",
			invitationId: params.invitationId,
			organizationId: params.organizationId,
			organizationName: params.organizationName,
			role: params.role,
		},
	});
}

/**
 * Create notification for team invite accepted
 */
export async function createTeamInviteAcceptedNotification(params: {
	recipientId: string;
	actorId: string;
	organizationId: string;
	organizationName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "team_invite_accepted",
		actorId: params.actorId,
		data: {
			type: "team_invite_accepted",
			organizationId: params.organizationId,
			organizationName: params.organizationName,
		},
	});
}

/**
 * Create notification for team invite declined
 */
export async function createTeamInviteDeclinedNotification(params: {
	recipientId: string;
	actorId: string;
	organizationId: string;
	organizationName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "team_invite_declined",
		actorId: params.actorId,
		data: {
			type: "team_invite_declined",
			organizationId: params.organizationId,
			organizationName: params.organizationName,
		},
	});
}

/**
 * Create notification for team member removed
 */
export async function createTeamMemberRemovedNotification(params: {
	recipientId: string;
	actorId: string;
	organizationName: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "team_member_removed",
		actorId: params.actorId,
		data: {
			type: "team_member_removed",
			organizationName: params.organizationName,
		},
	});
}

/**
 * Create notification for team role changed
 */
export async function createTeamRoleChangedNotification(params: {
	recipientId: string;
	actorId: string;
	organizationId: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
}): Promise<string> {
	return createNotification({
		userId: params.recipientId,
		type: "team_role_changed",
		actorId: params.actorId,
		data: {
			type: "team_role_changed",
			organizationId: params.organizationId,
			organizationName: params.organizationName,
			oldRole: params.oldRole,
			newRole: params.newRole,
		},
	});
}
