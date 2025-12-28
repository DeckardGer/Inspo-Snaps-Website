import {
	Cancel01Icon,
	Folder01Icon,
	FolderRemoveIcon,
	Tick02Icon,
	UserGroup03Icon,
	UserMinus02Icon,
	UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import type { NotificationType } from "@/lib/db/schema/notification.schema";
import type { NotificationActor, NotificationData } from "./types";

export type NotificationTypeConfig = {
	icon: typeof Folder01Icon;
	getTitle: (data: NotificationData, actor: NotificationActor | null) => string;
	getMessage: (
		data: NotificationData,
		actor: NotificationActor | null,
	) => string;
	getActionUrl: (data: NotificationData) => string | null;
	/** Whether this notification has an associated action (link destination) */
	actionable: boolean;
};

export const NOTIFICATION_CONFIG: Record<
	NotificationType,
	NotificationTypeConfig
> = {
	folder_invite: {
		icon: Folder01Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} invited you to a folder`,
		getMessage: (data) => {
			if (data.type !== "folder_invite") return "";
			return `You've been invited to "${data.folderName}"`;
		},
		getActionUrl: (data) => {
			if (data.type !== "folder_invite") return null;
			return `/invite/${data.folderId}`;
		},
		actionable: true,
	},

	folder_invite_accepted: {
		icon: Tick02Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} accepted your invitation`,
		getMessage: (data) => {
			if (data.type !== "folder_invite_accepted") return "";
			return `They now have access to "${data.folderName}"`;
		},
		getActionUrl: (data) => {
			if (data.type !== "folder_invite_accepted") return null;
			return `/my-folders/${data.folderId}`;
		},
		actionable: true,
	},

	folder_invite_declined: {
		icon: Cancel01Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} declined your invitation`,
		getMessage: (data) => {
			if (data.type !== "folder_invite_declined") return "";
			return `They won't have access to "${data.folderName}"`;
		},
		getActionUrl: () => null,
		actionable: false,
	},

	folder_access_revoked: {
		icon: FolderRemoveIcon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} removed your access`,
		getMessage: (data) => {
			if (data.type !== "folder_access_revoked") return "";
			return `You no longer have access to "${data.folderName}"`;
		},
		getActionUrl: () => null,
		actionable: false,
	},

	team_invite: {
		icon: UserGroup03Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} invited you to a team`,
		getMessage: (data) => {
			if (data.type !== "team_invite") return "";
			return `You've been invited to join "${data.organizationName}" as ${data.role}`;
		},
		getActionUrl: (data) => {
			if (data.type !== "team_invite") return null;
			return `/team-invite/${data.invitationId}`;
		},
		actionable: true,
	},

	team_invite_accepted: {
		icon: Tick02Icon,
		getTitle: (_data, actor) => `${actor?.name ?? "Someone"} joined your team`,
		getMessage: (data) => {
			if (data.type !== "team_invite_accepted") return "";
			return `They are now a member of "${data.organizationName}"`;
		},
		getActionUrl: () => "/team-folders",
		actionable: true,
	},

	team_invite_declined: {
		icon: Cancel01Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} declined your team invite`,
		getMessage: (data) => {
			if (data.type !== "team_invite_declined") return "";
			return `They won't be joining "${data.organizationName}"`;
		},
		getActionUrl: () => null,
		actionable: false,
	},

	team_member_removed: {
		icon: UserMinus02Icon,
		getTitle: (_data, actor) =>
			`${actor?.name ?? "Someone"} removed you from a team`,
		getMessage: (data) => {
			if (data.type !== "team_member_removed") return "";
			return `You are no longer a member of "${data.organizationName}"`;
		},
		getActionUrl: () => null,
		actionable: false,
	},

	team_role_changed: {
		icon: UserSwitchIcon,
		getTitle: (_data, actor) => `${actor?.name ?? "Someone"} changed your role`,
		getMessage: (data) => {
			if (data.type !== "team_role_changed") return "";
			return `Your role in "${data.organizationName}" changed from ${data.oldRole} to ${data.newRole}`;
		},
		getActionUrl: () => "/team-folders",
		actionable: true,
	},
};

/**
 * Get the configuration for a notification type
 */
export function getNotificationConfig(
	type: NotificationType,
): NotificationTypeConfig {
	return NOTIFICATION_CONFIG[type];
}
