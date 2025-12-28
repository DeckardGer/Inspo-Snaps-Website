import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import authClient from "@/lib/auth/auth-client";
import { FOLDER_CLASSES, type FolderColor } from "@/lib/folders/constants";
import { getNotificationConfig } from "@/lib/notifications/config";
import { markAsRead } from "@/lib/notifications/functions";
import type { NotificationWithActor } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";

// Team notification types that should set active organization before navigating
const TEAM_ORG_NOTIFICATION_TYPES = [
	"team_invite_accepted",
	"team_role_changed",
] as const;

type NotificationItemProps = {
	notification: NotificationWithActor;
	onClose?: () => void;
};

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays}d ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
	return `${Math.floor(diffDays / 30)}mo ago`;
}

export function NotificationItem({
	notification,
	onClose,
}: NotificationItemProps) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const config = getNotificationConfig(notification.type);

	const markAsReadMutation = useMutation({
		mutationFn: () => markAsRead({ data: { notificationId: notification.id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	// Check if this is a team notification that needs to set active org
	const isTeamOrgNotification = TEAM_ORG_NOTIFICATION_TYPES.includes(
		notification.type as (typeof TEAM_ORG_NOTIFICATION_TYPES)[number],
	);

	const getOrganizationId = (): string | null => {
		const { data } = notification;
		if (
			data.type === "team_invite_accepted" ||
			data.type === "team_role_changed"
		) {
			return data.organizationId;
		}
		return null;
	};

	const handleClick = async () => {
		if (!notification.read) {
			markAsReadMutation.mutate();
		}
		onClose?.();
	};

	const handleTeamNotificationClick = async () => {
		const orgId = getOrganizationId();
		if (orgId) {
			// Set active organization before navigating
			await authClient.organization.setActive({ organizationId: orgId });
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		}

		if (!notification.read) {
			markAsReadMutation.mutate();
		}
		onClose?.();

		// Navigate to team folders
		navigate({ to: "/team-folders" });
	};

	const actionUrl = config.getActionUrl(notification.data);

	// Get folder colors if this is a folder-related notification
	const folderColor =
		notification.data.type === "folder_invite"
			? FOLDER_CLASSES[notification.data.folderColor as FolderColor]
			: null;

	const content = (
		<div className="flex items-start gap-3 w-full py-2 px-2">
			{/* Icon/Avatar container */}
			{folderColor ? (
				// Folder-specific colored icon
				<div
					className={cn(
						"flex shrink-0 items-center justify-center size-9 rounded-lg",
						folderColor.background,
					)}
				>
					<div
						className={cn(
							"flex items-center justify-center size-6 rounded-full",
							folderColor.foreground,
						)}
					>
						{notification.data.type === "folder_invite" &&
						notification.data.folderEmoji ? (
							<span className="text-sm leading-none">
								{notification.data.folderEmoji}
							</span>
						) : (
							<HugeiconsIcon
								icon={Folder01Icon}
								className={cn("size-3", folderColor.icon)}
								fill="currentColor"
							/>
						)}
					</div>
				</div>
			) : (
				// Generic notification icon
				<div className="flex shrink-0 items-center justify-center size-9 rounded-lg bg-muted">
					<HugeiconsIcon
						icon={config.icon}
						className="size-4 text-muted-foreground"
						strokeWidth={2}
					/>
				</div>
			)}

			{/* Content */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">
					{config.getTitle(notification.data, notification.actor)}
				</p>
				<p className="text-xs text-muted-foreground truncate">
					{config.getMessage(notification.data, notification.actor)}
				</p>
				<p className="text-xs text-muted-foreground mt-0.5">
					{formatRelativeTime(notification.createdAt)}
				</p>
			</div>

			{/* Unread indicator */}
			{!notification.read && (
				<div className="flex shrink-0 items-center justify-center size-2 rounded-full bg-primary mt-1.5" />
			)}
		</div>
	);

	// Team notifications that set active org use a button with programmatic navigation
	if (isTeamOrgNotification) {
		return (
			<DropdownMenuItem
				className="p-0 cursor-pointer"
				preserveColors
				onClick={handleTeamNotificationClick}
			>
				{content}
			</DropdownMenuItem>
		);
	}

	if (actionUrl) {
		return (
			<DropdownMenuItem
				className="p-0 cursor-pointer"
				preserveColors
				render={
					<Link
						to={actionUrl}
						className="flex items-center gap-3 w-full"
						onClick={handleClick}
					/>
				}
			>
				{content}
			</DropdownMenuItem>
		);
	}

	return (
		<DropdownMenuItem
			className="p-0 cursor-default"
			preserveColors
			onClick={handleClick}
		>
			{content}
		</DropdownMenuItem>
	);
}
