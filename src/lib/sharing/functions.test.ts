/**
 * Tests for sharing server functions
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createTestFolder,
	createTestShareLink,
	createTestUserShare,
	resetFolderCounters,
} from "@/test/fixtures/folder.fixtures";
import {
	createTestUser,
	resetUserCounter,
} from "@/test/fixtures/user.fixtures";
import { getMockDb } from "@/test/mocks/db.mock";
import { getMockNotifications } from "@/test/mocks/notifications.mock";

// Helper to create valid test UUIDs inline
const uuid = (id: string) =>
	`${id.padStart(8, "0")}-0000-4000-8000-000000000000`;

describe("Sharing Functions", () => {
	beforeEach(() => {
		resetUserCounter();
		resetFolderCounters();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("Share Links", () => {
		describe("createShareLink", () => {
			it("creates share link for owned folder", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);

				db.query.folder.findFirst.mockResolvedValue(folder);

				const shareLink = createTestShareLink(folder.id, user.id);
				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([shareLink]),
					}),
				});

				const { createShareLink } = await import("@/lib/sharing/functions");

				const result = await createShareLink({
					data: { folderId: folder.id },
					context: { user },
				});

				expect(result).toEqual(shareLink);
				expect(result.folderId).toBe(folder.id);
			});

			it("creates share link with custom expiration", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);
				const customExpiry = new Date("2025-12-31");

				db.query.folder.findFirst.mockResolvedValue(folder);

				const shareLink = createTestShareLink(folder.id, user.id, {
					expiresAt: customExpiry,
				});
				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([shareLink]),
					}),
				});

				const { createShareLink } = await import("@/lib/sharing/functions");

				const result = await createShareLink({
					data: { folderId: folder.id, expiresAt: customExpiry },
					context: { user },
				});

				expect(result.expiresAt).toEqual(customExpiry);
			});

			it("throws error when folder not found", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				db.query.folder.findFirst.mockResolvedValue(null);

				const { createShareLink } = await import("@/lib/sharing/functions");

				await expect(
					createShareLink({
						data: { folderId: uuid("fff00001") },
						context: { user },
					}),
				).rejects.toThrow("Folder not found or access denied");
			});
		});

		describe("getShareLinks", () => {
			it("returns non-expired share links for folder", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);
				const link1 = createTestShareLink(folder.id, user.id);
				const link2 = createTestShareLink(folder.id, user.id);

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.shareLink.findMany.mockResolvedValue([link1, link2]);

				const { getShareLinks } = await import("@/lib/sharing/functions");

				const result = await getShareLinks({
					data: { folderId: folder.id },
					context: { user },
				});

				expect(result).toHaveLength(2);
			});

			it("throws error when folder not found", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				db.query.folder.findFirst.mockResolvedValue(null);

				const { getShareLinks } = await import("@/lib/sharing/functions");

				await expect(
					getShareLinks({
						data: { folderId: uuid("fff00001") },
						context: { user },
					}),
				).rejects.toThrow("Folder not found");
			});
		});

		describe("deleteShareLink", () => {
			it("deletes share link owned by user", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);
				const link = createTestShareLink(folder.id, user.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder,
				});
				db.delete.mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined),
				});

				const { deleteShareLink } = await import("@/lib/sharing/functions");

				const result = await deleteShareLink({
					data: { id: link.id },
					context: { user },
				});

				expect(result).toEqual({ success: true });
			});

			it("throws error when link belongs to another user", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const otherUser = createTestUser();
				const folder = createTestFolder(otherUser.id);
				const link = createTestShareLink(folder.id, otherUser.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder,
				});

				const { deleteShareLink } = await import("@/lib/sharing/functions");

				await expect(
					deleteShareLink({
						data: { id: link.id },
						context: { user },
					}),
				).rejects.toThrow("Share link not found or access denied");
			});
		});

		describe("accessSharedLink", () => {
			it("returns folder data for valid non-expired link", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const owner = createTestUser();
				const folder = createTestFolder(owner.id, { name: "Shared Folder" });
				const link = createTestShareLink(folder.id, owner.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder: {
						...folder,
						owner: { id: owner.id, name: owner.name, image: null },
					},
				});

				const { accessSharedLink } = await import("@/lib/sharing/functions");

				const result = await accessSharedLink({
					data: { linkId: link.id },
					context: { user },
				});

				expect(result.folder.name).toBe("Shared Folder");
				expect(result.expiresAt).toBeDefined();
			});

			it("throws error for expired link", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				// The query filters out expired links, so it returns null
				db.query.shareLink.findFirst.mockResolvedValue(null);

				const { accessSharedLink } = await import("@/lib/sharing/functions");

				await expect(
					accessSharedLink({
						data: { linkId: uuid("fff00002") },
						context: { user },
					}),
				).rejects.toThrow("Share link not found or expired");
			});
		});

		describe("acceptShareLinkInvite", () => {
			it("creates user share entry when accepting link invite", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const owner = createTestUser();
				const folder = createTestFolder(owner.id);
				const link = createTestShareLink(folder.id, owner.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder,
				});
				db.query.userShare.findFirst.mockResolvedValue(null);
				db.insert.mockReturnValue({
					values: vi.fn().mockResolvedValue(undefined),
				});

				const { acceptShareLinkInvite } = await import(
					"@/lib/sharing/functions"
				);

				const result = await acceptShareLinkInvite({
					data: { linkId: link.id },
					context: { user },
				});

				expect(result.folderId).toBe(folder.id);
				expect(result.alreadyAccepted).toBe(false);
			});

			it("returns alreadyAccepted true if user already has access", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const owner = createTestUser();
				const folder = createTestFolder(owner.id);
				const link = createTestShareLink(folder.id, owner.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder,
				});
				db.query.userShare.findFirst.mockResolvedValue(
					createTestUserShare(folder.id, user.id, owner.id, "accepted"),
				);

				const { acceptShareLinkInvite } = await import(
					"@/lib/sharing/functions"
				);

				const result = await acceptShareLinkInvite({
					data: { linkId: link.id },
					context: { user },
				});

				expect(result.alreadyAccepted).toBe(true);
			});

			it("throws error when trying to accept own folder", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);
				const link = createTestShareLink(folder.id, user.id);

				db.query.shareLink.findFirst.mockResolvedValue({
					...link,
					folder,
				});

				const { acceptShareLinkInvite } = await import(
					"@/lib/sharing/functions"
				);

				await expect(
					acceptShareLinkInvite({
						data: { linkId: link.id },
						context: { user },
					}),
				).rejects.toThrow("You cannot accept an invite to your own folder");
			});
		});
	});

	describe("User-to-User Sharing", () => {
		describe("shareWithUser", () => {
			it("shares folder with user by email", async () => {
				const db = await getMockDb();
				const notifications = await getMockNotifications();
				const owner = createTestUser();
				const recipient = createTestUser({
					email: "recipient@test.com",
					name: "Recipient",
				});
				const folder = createTestFolder(owner.id, { name: "Shared Folder" });

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.user.findFirst.mockResolvedValue(recipient);
				db.query.userShare.findFirst.mockResolvedValue(null);
				db.insert.mockReturnValue({
					values: vi.fn().mockResolvedValue(undefined),
				});

				const { shareWithUser } = await import("@/lib/sharing/functions");

				const result = await shareWithUser({
					data: { folderId: folder.id, identifier: "recipient@test.com" },
					context: { user: owner },
				});

				expect(result.success).toBe(true);
				expect(result.sharedWithName).toBe("Recipient");
				expect(notifications.createFolderInviteNotification).toHaveBeenCalled();
			});

			it("re-invites cancelled user", async () => {
				const db = await getMockDb();
				const notifications = await getMockNotifications();
				const owner = createTestUser();
				const recipient = createTestUser();
				const folder = createTestFolder(owner.id);

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.user.findFirst.mockResolvedValue(recipient);
				db.query.userShare.findFirst.mockResolvedValue(
					createTestUserShare(folder.id, recipient.id, owner.id, "cancelled"),
				);
				db.update.mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue(undefined),
					}),
				});

				const { shareWithUser } = await import("@/lib/sharing/functions");

				const result = await shareWithUser({
					data: { folderId: folder.id, identifier: recipient.email },
					context: { user: owner },
				});

				expect(result.success).toBe(true);
				expect(notifications.createFolderInviteNotification).toHaveBeenCalled();
			});

			it("throws error when sharing with yourself", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.user.findFirst.mockResolvedValue(user);

				const { shareWithUser } = await import("@/lib/sharing/functions");

				await expect(
					shareWithUser({
						data: { folderId: folder.id, identifier: user.email },
						context: { user },
					}),
				).rejects.toThrow("Cannot share with yourself");
			});

			it("throws error when already shared (pending)", async () => {
				const db = await getMockDb();
				const owner = createTestUser();
				const recipient = createTestUser();
				const folder = createTestFolder(owner.id);

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.user.findFirst.mockResolvedValue(recipient);
				db.query.userShare.findFirst.mockResolvedValue(
					createTestUserShare(folder.id, recipient.id, owner.id, "pending"),
				);

				const { shareWithUser } = await import("@/lib/sharing/functions");

				await expect(
					shareWithUser({
						data: { folderId: folder.id, identifier: recipient.email },
						context: { user: owner },
					}),
				).rejects.toThrow("Already shared with this user");
			});
		});

		describe("revokeUserShare", () => {
			it("revokes share and notifies user", async () => {
				const db = await getMockDb();
				const notifications = await getMockNotifications();
				const owner = createTestUser();
				const sharedUser = createTestUser();
				const folder = createTestFolder(owner.id, { name: "Revoked Folder" });

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.folder.findMany.mockResolvedValue([]); // getAllDescendantFolderIds
				db.delete.mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined),
				});

				const { revokeUserShare } = await import("@/lib/sharing/functions");

				const result = await revokeUserShare({
					data: { folderId: folder.id, userId: sharedUser.id },
					context: { user: owner },
				});

				expect(result.success).toBe(true);
				expect(
					notifications.createFolderAccessRevokedNotification,
				).toHaveBeenCalledWith({
					recipientId: sharedUser.id,
					actorId: owner.id,
					folderName: "Revoked Folder",
				});
			});

			it("throws error when folder not found", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				db.query.folder.findFirst.mockResolvedValue(null);

				const { revokeUserShare } = await import("@/lib/sharing/functions");

				await expect(
					revokeUserShare({
						data: { folderId: uuid("fff00001"), userId: uuid("fff00003") },
						context: { user },
					}),
				).rejects.toThrow("Folder not found or access denied");
			});
		});

		describe("acceptInvitation", () => {
			it("accepts pending invitation and notifies owner", async () => {
				const db = await getMockDb();
				const notifications = await getMockNotifications();
				const owner = createTestUser();
				const recipient = createTestUser();
				const folder = createTestFolder(owner.id, { name: "Invited Folder" });

				const invitation = createTestUserShare(
					folder.id,
					recipient.id,
					owner.id,
					"pending",
				);
				db.query.userShare.findFirst.mockResolvedValue({
					...invitation,
					folder: { id: folder.id, name: folder.name },
				});
				db.update.mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue(undefined),
					}),
				});

				const { acceptInvitation } = await import("@/lib/sharing/functions");

				const result = await acceptInvitation({
					data: { folderId: folder.id },
					context: { user: recipient },
				});

				expect(result.success).toBe(true);
				expect(
					notifications.createFolderInviteAcceptedNotification,
				).toHaveBeenCalledWith({
					recipientId: owner.id,
					actorId: recipient.id,
					folderId: folder.id,
					folderName: folder.name,
				});
			});

			it("throws error when invitation not found", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				db.query.userShare.findFirst.mockResolvedValue(null);

				const { acceptInvitation } = await import("@/lib/sharing/functions");

				await expect(
					acceptInvitation({
						data: { folderId: uuid("fff00001") },
						context: { user },
					}),
				).rejects.toThrow("Invitation not found");
			});
		});

		describe("cancelInvitation", () => {
			it("cancels pending invitation and notifies owner", async () => {
				const db = await getMockDb();
				const notifications = await getMockNotifications();
				const owner = createTestUser();
				const recipient = createTestUser();
				const folder = createTestFolder(owner.id, { name: "Cancelled Folder" });

				const invitation = createTestUserShare(
					folder.id,
					recipient.id,
					owner.id,
					"pending",
				);
				db.query.userShare.findFirst.mockResolvedValue({
					...invitation,
					folder: { id: folder.id, name: folder.name },
				});
				db.update.mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue(undefined),
					}),
				});

				const { cancelInvitation } = await import("@/lib/sharing/functions");

				const result = await cancelInvitation({
					data: { folderId: folder.id },
					context: { user: recipient },
				});

				expect(result.success).toBe(true);
				expect(
					notifications.createFolderInviteDeclinedNotification,
				).toHaveBeenCalled();
			});
		});

		describe("removeFromShared", () => {
			it("removes user from shared folder", async () => {
				const db = await getMockDb();
				const owner = createTestUser();
				const sharedUser = createTestUser();
				const folder = createTestFolder(owner.id);

				const share = createTestUserShare(
					folder.id,
					sharedUser.id,
					owner.id,
					"accepted",
				);
				db.query.userShare.findFirst.mockResolvedValue(share);
				db.query.folder.findMany.mockResolvedValue([]); // getAllDescendantFolderIds
				db.delete.mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined),
				});

				const { removeFromShared } = await import("@/lib/sharing/functions");

				const result = await removeFromShared({
					data: { folderId: folder.id },
					context: { user: sharedUser },
				});

				expect(result.success).toBe(true);
			});

			it("throws error when share not found", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				db.query.userShare.findFirst.mockResolvedValue(null);

				const { removeFromShared } = await import("@/lib/sharing/functions");

				await expect(
					removeFromShared({
						data: { folderId: uuid("fff00001") },
						context: { user },
					}),
				).rejects.toThrow("Share not found");
			});
		});
	});

	describe("Shared Content Access", () => {
		describe("getSharedFolderContentsAuth", () => {
			it("returns folder contents when user has access", async () => {
				const db = await getMockDb();
				const owner = createTestUser();
				const sharedUser = createTestUser();
				const folder = createTestFolder(owner.id, { name: "Shared Content" });
				const childFolder = createTestFolder(owner.id, { parentId: folder.id });

				// Mock access check - user has share access
				db.query.userShare.findFirst.mockResolvedValue(
					createTestUserShare(folder.id, sharedUser.id, owner.id, "accepted"),
				);
				db.query.folder.findFirst.mockResolvedValue({
					...folder,
					children: [childFolder],
					owner: { id: owner.id, name: owner.name, image: null },
				});
				db.query.favouriteFolder.findMany.mockResolvedValue([]);

				const { getSharedFolderContentsAuth } = await import(
					"@/lib/sharing/functions"
				);

				const result = await getSharedFolderContentsAuth({
					data: { folderId: folder.id },
					context: { user: sharedUser },
				});

				expect(result?.name).toBe("Shared Content");
				expect(result?.children).toHaveLength(1);
			});

			it("throws error when user has no access", async () => {
				const db = await getMockDb();
				const user = createTestUser();

				// Mock no access
				db.query.userShare.findFirst.mockResolvedValue(null);
				db.query.folder.findFirst.mockResolvedValue(null);

				const { getSharedFolderContentsAuth } = await import(
					"@/lib/sharing/functions"
				);

				await expect(
					getSharedFolderContentsAuth({
						data: { folderId: uuid("fff00004") },
						context: { user },
					}),
				).rejects.toThrow("Access denied");
			});
		});

		describe("getSharedFolderPath", () => {
			it("returns path from shared root to current folder", async () => {
				const db = await getMockDb();
				const owner = createTestUser();
				const sharedUser = createTestUser();
				const root = createTestFolder(owner.id, { name: "Shared Root" });
				// Child folder exists for hierarchy but test uses root for simplicity
				const _child = createTestFolder(owner.id, {
					parentId: root.id,
					name: "Child",
				});

				// The function makes multiple calls:
				// 1. checkUserShareAccess - traverses up from child looking for share
				// 2. findRootSharedFolder - traverses up to find root share
				// 3. Path building - traverses up from current folder to root

				// Mock userShare.findFirst for access checks
				// checkUserShareAccess calls it traversing up: child -> root
				// findRootSharedFolder also traverses up looking for shares
				db.query.userShare.findFirst.mockImplementation(() =>
					Promise.resolve(
						createTestUserShare(root.id, sharedUser.id, owner.id, "accepted"),
					),
				);

				// Mock folder.findFirst for the path building and parent traversal
				// First call from checkUserShareAccess: get parent of child
				// Then findRootSharedFolder: traverse up looking for root share
				// Then path building: traverse from current to root
				db.query.folder.findFirst.mockImplementation(() => {
					// Return parent info for path building
					return Promise.resolve({
						id: root.id,
						name: "Shared Root",
						parentId: null,
					});
				});

				const { getSharedFolderPath } = await import("@/lib/sharing/functions");

				const result = await getSharedFolderPath({
					data: { folderId: root.id }, // Use root to simplify test
					context: { user: sharedUser },
				});

				// At minimum, should include the folder itself
				expect(result.length).toBeGreaterThanOrEqual(1);
				expect(result[0].name).toBe("Shared Root");
			});
		});
	});

	describe("cloneSharedFolder", () => {
		it("clones shared folder with hierarchy", async () => {
			const db = await getMockDb();
			const owner = createTestUser();
			const recipient = createTestUser();
			const root = createTestFolder(owner.id, { name: "Root to Clone" });
			const child = createTestFolder(owner.id, {
				parentId: root.id,
				name: "Child",
			});

			// Mock access check
			db.query.userShare.findFirst.mockResolvedValue(
				createTestUserShare(root.id, recipient.id, owner.id, "accepted"),
			);
			db.query.folder.findFirst.mockResolvedValue(root);
			// getAllDescendantFolderIds
			db.query.folder.findMany
				.mockResolvedValueOnce([{ id: child.id }])
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([root, child]); // Get all folders

			db.query.folderImage.findMany.mockResolvedValue([]);
			db.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined),
			});

			const { cloneSharedFolder } = await import("@/lib/sharing/functions");

			const result = await cloneSharedFolder({
				data: { folderId: root.id },
				context: { user: recipient },
			});

			expect(result.success).toBe(true);
			expect(result.folderName).toBe("Root to Clone");
		});

		it("throws error when user has no access", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			db.query.userShare.findFirst.mockResolvedValue(null);
			db.query.folder.findFirst.mockResolvedValue(null);

			const { cloneSharedFolder } = await import("@/lib/sharing/functions");

			await expect(
				cloneSharedFolder({
					data: { folderId: uuid("fff00004") },
					context: { user },
				}),
			).rejects.toThrow("Access denied");
		});
	});
});
