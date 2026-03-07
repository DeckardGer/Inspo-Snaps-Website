import type { FolderColor } from "@/lib/folders/constants";

// Notification data payloads for each notification type
export type FolderInviteData = {
	type: "folder_invite";
	folderId: string;
	folderName: string;
	folderColor: FolderColor;
	folderEmoji?: string;
};

export type FolderInviteAcceptedData = {
	type: "folder_invite_accepted";
	folderId: string;
	folderName: string;
};

export type FolderInviteDeclinedData = {
	type: "folder_invite_declined";
	folderId: string;
	folderName: string;
};

export type FolderAccessRevokedData = {
	type: "folder_access_revoked";
	folderName: string;
};

export type TeamInviteData = {
	type: "team_invite";
	invitationId: string;
	organizationId: string;
	organizationName: string;
	role: string;
};

export type TeamInviteAcceptedData = {
	type: "team_invite_accepted";
	organizationId: string;
	organizationName: string;
};

export type TeamInviteDeclinedData = {
	type: "team_invite_declined";
	organizationId: string;
	organizationName: string;
};

export type TeamMemberRemovedData = {
	type: "team_member_removed";
	organizationName: string;
};

export type TeamRoleChangedData = {
	type: "team_role_changed";
	organizationId: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
};

export type TeamDeletedData = {
	type: "team_deleted";
	organizationName: string;
};

// Union of all notification data types
export type NotificationData =
	| FolderInviteData
	| FolderInviteAcceptedData
	| FolderInviteDeclinedData
	| FolderAccessRevokedData
	| TeamInviteData
	| TeamInviteAcceptedData
	| TeamInviteDeclinedData
	| TeamMemberRemovedData
	| TeamRoleChangedData
	| TeamDeletedData;

// Infer notification type from data
export type NotificationTypeFromData<T extends NotificationData> = T["type"];

// Actor info for display
export type NotificationActor = {
	id: string;
	name: string | null;
	image: string | null;
};

// Full notification with relations for frontend
export type NotificationWithActor = {
	id: string;
	userId: string;
	type: NotificationData["type"];
	data: NotificationData;
	actorId: string | null;
	actor: NotificationActor | null;
	read: boolean;
	readAt: Date | null;
	createdAt: Date;
};
