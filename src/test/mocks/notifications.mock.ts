/**
 * Notification mock utilities for testing
 */
import type { Mock } from "vitest";

// Type for mocked notification functions
export type MockNotificationFunctions = {
	createFolderInviteNotification: Mock;
	createFolderInviteAcceptedNotification: Mock;
	createFolderInviteDeclinedNotification: Mock;
	createFolderAccessRevokedNotification: Mock;
	createTeamInviteNotification: Mock;
	createTeamInviteAcceptedNotification: Mock;
	createTeamInviteDeclinedNotification: Mock;
	createTeamMemberRemovedNotification: Mock;
	createTeamRoleChangedNotification: Mock;
};

/**
 * Get the mocked notification functions
 */
export async function getMockNotifications(): Promise<MockNotificationFunctions> {
	const notifications = await import("@/lib/notifications/create");
	return notifications as unknown as MockNotificationFunctions;
}

/**
 * Reset all notification mocks
 */
export function resetNotificationMocks(
	notifications: MockNotificationFunctions,
): void {
	notifications.createFolderInviteNotification.mockReset();
	notifications.createFolderInviteAcceptedNotification.mockReset();
	notifications.createFolderInviteDeclinedNotification.mockReset();
	notifications.createFolderAccessRevokedNotification.mockReset();
	notifications.createTeamInviteNotification.mockReset();
	notifications.createTeamInviteAcceptedNotification.mockReset();
	notifications.createTeamInviteDeclinedNotification.mockReset();
	notifications.createTeamMemberRemovedNotification.mockReset();
	notifications.createTeamRoleChangedNotification.mockReset();

	// Re-initialize with default implementations
	notifications.createFolderInviteNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createFolderInviteAcceptedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createFolderInviteDeclinedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createFolderAccessRevokedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createTeamInviteNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createTeamInviteAcceptedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createTeamInviteDeclinedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createTeamMemberRemovedNotification.mockResolvedValue(
		"notification-id",
	);
	notifications.createTeamRoleChangedNotification.mockResolvedValue(
		"notification-id",
	);
}

/**
 * Assert that a folder invite notification was created
 */
export function expectFolderInviteNotification(
	notifications: MockNotificationFunctions,
	params: {
		recipientId: string;
		actorId: string;
		folderId: string;
		folderName: string;
	},
): void {
	expect(notifications.createFolderInviteNotification).toHaveBeenCalledWith(
		expect.objectContaining(params),
	);
}

/**
 * Assert that an access revoked notification was created
 */
export function expectAccessRevokedNotification(
	notifications: MockNotificationFunctions,
	params: {
		recipientId: string;
		actorId: string;
		folderName: string;
	},
): void {
	expect(
		notifications.createFolderAccessRevokedNotification,
	).toHaveBeenCalledWith(expect.objectContaining(params));
}
