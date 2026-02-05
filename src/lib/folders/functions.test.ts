/**
 * Tests for folder server functions
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createFolderHierarchy,
	createNestedFolder,
	createTeamFolder as createTeamFolderFixture,
	createTestFolder,
	createTestFolderWithRelations,
	createTestUserShare,
	resetFolderCounters,
} from "@/test/fixtures/folder.fixtures";
import {
	createTestMember,
	createTestOrganization,
	createTestUser,
	resetUserCounter,
} from "@/test/fixtures/user.fixtures";
import { getMockDb } from "@/test/mocks/db.mock";
import { getMockNotifications } from "@/test/mocks/notifications.mock";

// Helper to create valid test UUIDs inline
// Format: 8 hex chars - 4 hex chars - 4xxx - 8xxx - 12 hex chars
const uuid = (id: string) =>
	`${id.padStart(8, "0")}-0000-4000-8000-000000000000`;

describe("Folder Functions", () => {
	beforeEach(() => {
		resetUserCounter();
		resetFolderCounters();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("createFolder", () => {
		it("creates a root folder successfully", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			const newFolder = createTestFolder(user.id, {
				name: "New Folder",
				color: "blue",
			});

			db.insert.mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([newFolder]),
				}),
			});

			const { createFolder } = await import("@/lib/folders/functions");

			const result = await createFolder({
				data: { name: "New Folder", color: "blue" },
				context: { user },
			});

			expect(result).toEqual(newFolder);
			expect(db.insert).toHaveBeenCalled();
		});

		it("creates a nested folder when parent exists", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const parentFolder = createTestFolder(user.id);

			// Mock finding the parent folder
			db.query.folder.findFirst.mockResolvedValue(parentFolder);

			const newFolder = createNestedFolder(user.id, parentFolder.id, {
				name: "Child Folder",
			});

			db.insert.mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([newFolder]),
				}),
			});

			const { createFolder } = await import("@/lib/folders/functions");

			const result = await createFolder({
				data: {
					name: "Child Folder",
					parentId: parentFolder.id,
					color: "indigo",
				},
				context: { user },
			});

			expect(result).toEqual(newFolder);
			expect(result.parentId).toBe(parentFolder.id);
		});

		it("throws error when parent folder does not exist", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const nonExistentId = uuid("99999999");

			// Mock not finding the parent folder
			db.query.folder.findFirst.mockResolvedValue(null);

			const { createFolder } = await import("@/lib/folders/functions");

			await expect(
				createFolder({
					data: {
						name: "Child Folder",
						parentId: nonExistentId,
						color: "indigo",
					},
					context: { user },
				}),
			).rejects.toThrow("Parent folder not found or access denied");
		});

		it("throws error when parent belongs to different user", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const otherUser = createTestUser();
			const otherUserFolder = createTestFolder(otherUser.id);

			// The query filters by userId, so it won't find another user's folder
			db.query.folder.findFirst.mockResolvedValue(null);

			const { createFolder } = await import("@/lib/folders/functions");

			await expect(
				createFolder({
					data: {
						name: "Child Folder",
						parentId: otherUserFolder.id,
						color: "indigo",
					},
					context: { user },
				}),
			).rejects.toThrow("Parent folder not found or access denied");
		});
	});

	describe("getFolders", () => {
		it("returns root folders with computed fields", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			const folder1 = createTestFolderWithRelations(user.id, {
				name: "Folder 1",
				images: [{ imageId: uuid("img00011") }, { imageId: uuid("img00012") }],
				shareLinks: [{ id: uuid("link0021") }],
				favourites: [{ userId: user.id }],
			});

			const folder2 = createTestFolderWithRelations(user.id, {
				name: "Folder 2",
				images: [],
				shareLinks: [],
				favourites: [],
				userShares: [],
			});

			db.query.folder.findMany.mockResolvedValue([folder1, folder2]);

			const { getFolders } = await import("@/lib/folders/functions");

			const result = await getFolders({
				data: { parentId: null },
				context: { user },
			});

			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				id: folder1.id,
				name: "Folder 1",
				imageCount: 2,
				isShared: true,
				isFavourited: true,
			});
			expect(result[1]).toMatchObject({
				id: folder2.id,
				name: "Folder 2",
				imageCount: 0,
				isShared: false,
				isFavourited: false,
			});
		});

		it("returns child folders when parentId is provided", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const parentFolder = createTestFolder(user.id);

			const childFolder = createTestFolderWithRelations(user.id, {
				name: "Child",
				parentId: parentFolder.id,
				images: [],
				shareLinks: [],
				favourites: [],
				userShares: [],
			});

			db.query.folder.findMany.mockResolvedValue([childFolder]);

			const { getFolders } = await import("@/lib/folders/functions");

			const result = await getFolders({
				data: { parentId: parentFolder.id },
				context: { user },
			});

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(childFolder.id);
			expect(result[0].parentId).toBe(parentFolder.id);
		});

		it("marks folder as shared when it has userShares", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			const sharedFolder = createTestFolderWithRelations(user.id, {
				images: [],
				shareLinks: [],
				userShares: [{ folderId: uuid("share099") }],
				favourites: [],
			});

			db.query.folder.findMany.mockResolvedValue([sharedFolder]);

			const { getFolders } = await import("@/lib/folders/functions");

			const result = await getFolders({
				data: { parentId: null },
				context: { user },
			});

			expect(result[0].isShared).toBe(true);
		});
	});

	describe("updateFolder", () => {
		it("updates folder properties successfully", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id, {
				name: "Original Name",
				color: "indigo",
			});

			const updatedFolder = { ...folder, name: "Updated Name", color: "blue" };

			db.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([updatedFolder]),
					}),
				}),
			});

			const { updateFolder } = await import("@/lib/folders/functions");

			const result = await updateFolder({
				data: { id: folder.id, name: "Updated Name", color: "blue" },
				context: { user },
			});

			expect(result).toMatchObject({
				id: folder.id,
				name: "Updated Name",
				color: "blue",
			});
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const nonExistentId = uuid("9999999f");

			db.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([]),
					}),
				}),
			});

			const { updateFolder } = await import("@/lib/folders/functions");

			await expect(
				updateFolder({
					data: { id: nonExistentId, name: "Test", color: "indigo" },
					context: { user },
				}),
			).rejects.toThrow("Folder not found or access denied");
		});
	});

	describe("moveFolder", () => {
		it("moves folder to new parent successfully", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const newParent = createTestFolder(user.id);

			// Mock finding the existing folder
			db.query.folder.findFirst
				.mockResolvedValueOnce(folder) // First call: find folder to move
				.mockResolvedValueOnce({ parentId: null }) // Second call: getAncestorIds loop
				.mockResolvedValueOnce(newParent); // Third call: verify new parent exists

			const movedFolder = { ...folder, parentId: newParent.id };
			db.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([movedFolder]),
					}),
				}),
			});

			const { moveFolder } = await import("@/lib/folders/functions");

			const result = await moveFolder({
				data: { id: folder.id, newParentId: newParent.id },
				context: { user },
			});

			expect(result.parentId).toBe(newParent.id);
		});

		it("moves folder to root (null parent)", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const oldParent = createTestFolder(user.id);
			const folder = createTestFolder(user.id, {
				parentId: oldParent.id,
			});

			db.query.folder.findFirst.mockResolvedValue(folder);

			const movedFolder = { ...folder, parentId: null };
			db.update.mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([movedFolder]),
					}),
				}),
			});

			const { moveFolder } = await import("@/lib/folders/functions");

			const result = await moveFolder({
				data: { id: folder.id, newParentId: null },
				context: { user },
			});

			expect(result.parentId).toBeNull();
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const nonExistentId = uuid("9999999f");

			db.query.folder.findFirst.mockResolvedValue(null);

			const { moveFolder } = await import("@/lib/folders/functions");

			await expect(
				moveFolder({
					data: { id: nonExistentId, newParentId: null },
					context: { user },
				}),
			).rejects.toThrow("Folder not found");
		});

		it("throws error when moving folder into its own descendant", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const [root, child1] = createFolderHierarchy(user.id);

			// Trying to move root into child1 (its own descendant)
			db.query.folder.findFirst
				.mockResolvedValueOnce(root) // Find folder to move
				.mockResolvedValueOnce({ parentId: root.id }); // getAncestorIds returns root as parent of child1

			const { moveFolder } = await import("@/lib/folders/functions");

			await expect(
				moveFolder({
					data: { id: root.id, newParentId: child1.id },
					context: { user },
				}),
			).rejects.toThrow("Cannot move folder into its own descendant");
		});
	});

	describe("deleteFolder", () => {
		it("deletes folder and cleans up orphaned images", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id, { name: "Test Folder" });
			const imgId = uuid("img00099");

			// Mock finding the folder
			db.query.folder.findFirst.mockResolvedValue(folder);
			// Mock no descendants
			db.query.folder.findMany.mockResolvedValue([]);
			// Mock no user shares
			db.query.userShare.findMany.mockResolvedValue([]);
			// Mock affected images
			db.query.folderImage.findMany
				.mockResolvedValueOnce([{ imageId: imgId }]) // Affected images
				.mockResolvedValueOnce([]); // Remaining links (none - so it's orphaned)
			// Mock orphaned images
			db.query.image.findMany.mockResolvedValue([
				{ id: imgId, storageKey: "user/img-1.jpg" },
			]);

			// Setup delete mock chain
			db.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined),
			});

			const { deleteFolder } = await import("@/lib/folders/functions");

			const result = await deleteFolder({
				data: { id: folder.id },
				context: { user },
			});

			expect(result).toEqual({ success: true });
			expect(db.delete).toHaveBeenCalled();
		});

		it("notifies shared users when folder is deleted", async () => {
			const db = await getMockDb();
			const notifications = await getMockNotifications();
			const user = createTestUser();
			const sharedUser = createTestUser();
			const folder = createTestFolder(user.id, { name: "Shared Folder" });

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folder.findMany.mockResolvedValue([]); // No descendants
			db.query.userShare.findMany.mockResolvedValue([
				{
					sharedWithUserId: sharedUser.id,
					folderId: folder.id,
					status: "accepted",
					folder: { name: folder.name },
				},
			]);
			db.query.folderImage.findMany.mockResolvedValue([]);
			db.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined),
			});

			const { deleteFolder } = await import("@/lib/folders/functions");

			await deleteFolder({
				data: { id: folder.id },
				context: { user },
			});

			expect(
				notifications.createFolderAccessRevokedNotification,
			).toHaveBeenCalledWith({
				recipientId: sharedUser.id,
				actorId: user.id,
				folderName: folder.name,
			});
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const nonExistentId = uuid("9999999f");

			db.query.folder.findFirst.mockResolvedValue(null);
			db.query.folder.findMany.mockResolvedValue([]);

			const { deleteFolder } = await import("@/lib/folders/functions");

			await expect(
				deleteFolder({
					data: { id: nonExistentId },
					context: { user },
				}),
			).rejects.toThrow("Folder not found");
		});
	});

	describe("getFolderPath", () => {
		it("returns path from root to current folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const [root, child1, , grandchild1] = createFolderHierarchy(user.id);

			// Mock the recursive path building
			db.query.folder.findFirst
				.mockResolvedValueOnce({
					id: grandchild1.id,
					name: grandchild1.name,
					parentId: child1.id,
				})
				.mockResolvedValueOnce({
					id: child1.id,
					name: child1.name,
					parentId: root.id,
				})
				.mockResolvedValueOnce({
					id: root.id,
					name: root.name,
					parentId: null,
				});

			const { getFolderPath } = await import("@/lib/folders/functions");

			const result = await getFolderPath({
				data: { id: grandchild1.id },
				context: { user },
			});

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({ id: root.id, name: "Root" });
			expect(result[1]).toEqual({ id: child1.id, name: "Child 1" });
			expect(result[2]).toEqual({ id: grandchild1.id, name: "Grandchild 1" });
		});

		it("returns single item for root folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const rootFolder = createTestFolder(user.id, { name: "Root Folder" });

			db.query.folder.findFirst.mockResolvedValue({
				id: rootFolder.id,
				name: rootFolder.name,
				parentId: null,
			});

			const { getFolderPath } = await import("@/lib/folders/functions");

			const result = await getFolderPath({
				data: { id: rootFolder.id },
				context: { user },
			});

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({ id: rootFolder.id, name: "Root Folder" });
		});
	});

	describe("Favourites", () => {
		describe("addFolderToFavourites", () => {
			it("adds owned folder to favourites", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
					}),
				});

				const { addFolderToFavourites } = await import(
					"@/lib/folders/functions"
				);

				const result = await addFolderToFavourites({
					data: { id: folder.id },
					context: { user },
				});

				expect(result).toEqual({ success: true });
			});

			it("adds shared folder to favourites when user has access", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const owner = createTestUser();
				const sharedFolder = createTestFolder(owner.id);

				// User doesn't own it
				db.query.folder.findFirst.mockResolvedValue(null);
				// But has share access
				db.query.userShare.findFirst.mockResolvedValue(
					createTestUserShare(sharedFolder.id, user.id, owner.id, "accepted"),
				);

				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
					}),
				});

				const { addFolderToFavourites } = await import(
					"@/lib/folders/functions"
				);

				const result = await addFolderToFavourites({
					data: { id: sharedFolder.id },
					context: { user },
				});

				expect(result).toEqual({ success: true });
			});

			it("throws error when user has no access", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const noAccessId = uuid("8888888f");

				// Not owned
				db.query.folder.findFirst.mockResolvedValue(null);
				// No share access
				db.query.userShare.findFirst.mockResolvedValue(null);

				const { addFolderToFavourites } = await import(
					"@/lib/folders/functions"
				);

				await expect(
					addFolderToFavourites({
						data: { id: noAccessId },
						context: { user },
					}),
				).rejects.toThrow("Folder not found or access denied");
			});
		});

		describe("removeFolderFromFavourites", () => {
			it("removes folder from favourites", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const folder = createTestFolder(user.id);

				db.delete.mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined),
				});

				const { removeFolderFromFavourites } = await import(
					"@/lib/folders/functions"
				);

				const result = await removeFolderFromFavourites({
					data: { id: folder.id },
					context: { user },
				});

				expect(result).toEqual({ success: true });
				expect(db.delete).toHaveBeenCalled();
			});
		});
	});

	describe("getFolderStats", () => {
		it("returns stats with nested folder and image counts", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const child1Id = uuid("child101");
			const child2Id = uuid("child102");
			const grandchildId = uuid("grchld03");
			const img1Id = uuid("img00201");
			const img2Id = uuid("img00202");

			// Mock folder exists
			db.query.folder.findFirst.mockResolvedValue(folder);
			// Mock descendants - getDescendantIds uses BFS with a queue
			// First call: children of root -> [child1, child2]
			// Second call: children of child1 -> [grandchild]
			// Third call: children of child2 -> []
			// Fourth call: children of grandchild -> []
			db.query.folder.findMany
				.mockResolvedValueOnce([{ id: child1Id }, { id: child2Id }])
				.mockResolvedValueOnce([{ id: grandchildId }])
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([]);

			// Mock unique images across all folders
			db.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{ imageId: img1Id },
						{ imageId: img2Id },
						{ imageId: img1Id }, // Duplicate to test unique counting
					]),
				}),
			});

			const { getFolderStats } = await import("@/lib/folders/functions");

			const result = await getFolderStats({
				data: { id: folder.id },
				context: { user },
			});

			expect(result).toEqual({
				nestedFolderCount: 3, // child-1, child-2, grandchild-1
				imageCount: 2, // Unique images (img-1, img-2)
			});
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const nonExistentId = uuid("9999999f");

			db.query.folder.findFirst.mockResolvedValue(null);

			const { getFolderStats } = await import("@/lib/folders/functions");

			await expect(
				getFolderStats({
					data: { id: nonExistentId },
					context: { user },
				}),
			).rejects.toThrow("Folder not found or access denied");
		});
	});

	describe("Team Folder Functions", () => {
		describe("createTeamFolder", () => {
			it("creates team folder when user is org member", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();
				const membership = createTestMember(org.id, user.id, "member");

				db.query.member.findFirst.mockResolvedValue(membership);
				const newFolder = createTeamFolderFixture(user.id, org.id, {
					name: "Team Folder",
				});
				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([newFolder]),
					}),
				});

				const { createTeamFolder } = await import("@/lib/folders/functions");

				const result = await createTeamFolder({
					data: {
						name: "Team Folder",
						organizationId: org.id,
						color: "indigo",
					},
					context: { user },
				});

				expect(result).toEqual(newFolder);
				expect(result.organizationId).toBe(org.id);
			});

			it("throws error when user is not org member", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();

				db.query.member.findFirst.mockResolvedValue(null);

				const { createTeamFolder } = await import("@/lib/folders/functions");

				await expect(
					createTeamFolder({
						data: {
							name: "Team Folder",
							organizationId: org.id,
							color: "indigo",
						},
						context: { user },
					}),
				).rejects.toThrow("You are not a member of this organization");
			});
		});

		describe("updateTeamFolder", () => {
			it("allows folder creator to update", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();
				const folder = createTeamFolderFixture(user.id, org.id);
				const membership = createTestMember(org.id, user.id, "member");

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.member.findFirst.mockResolvedValue(membership);

				const updatedFolder = { ...folder, name: "Updated Name" };
				db.update.mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockReturnValue({
							returning: vi.fn().mockResolvedValue([updatedFolder]),
						}),
					}),
				});

				const { updateTeamFolder } = await import("@/lib/folders/functions");

				const result = await updateTeamFolder({
					data: { id: folder.id, organizationId: org.id, name: "Updated Name" },
					context: { user },
				});

				expect(result.name).toBe("Updated Name");
			});

			it("allows org admin to update any team folder", async () => {
				const db = await getMockDb();
				const admin = createTestUser();
				const creator = createTestUser();
				const org = createTestOrganization();
				const folder = createTeamFolderFixture(creator.id, org.id);
				const adminMembership = createTestMember(org.id, admin.id, "admin");

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.member.findFirst.mockResolvedValue(adminMembership);

				const updatedFolder = { ...folder, name: "Admin Updated" };
				db.update.mockReturnValue({
					set: vi.fn().mockReturnValue({
						where: vi.fn().mockReturnValue({
							returning: vi.fn().mockResolvedValue([updatedFolder]),
						}),
					}),
				});

				const { updateTeamFolder } = await import("@/lib/folders/functions");

				const result = await updateTeamFolder({
					data: {
						id: folder.id,
						organizationId: org.id,
						name: "Admin Updated",
					},
					context: { user: admin },
				});

				expect(result.name).toBe("Admin Updated");
			});

			it("throws error when regular member tries to update others folder", async () => {
				const db = await getMockDb();
				const member = createTestUser();
				const creator = createTestUser();
				const org = createTestOrganization();
				const folder = createTeamFolderFixture(creator.id, org.id);
				const membership = createTestMember(org.id, member.id, "member");

				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.member.findFirst.mockResolvedValue(membership);

				const { updateTeamFolder } = await import("@/lib/folders/functions");

				await expect(
					updateTeamFolder({
						data: {
							id: folder.id,
							organizationId: org.id,
							name: "Attempted Update",
						},
						context: { user: member },
					}),
				).rejects.toThrow(
					"Only the folder creator or organization admins can edit this folder",
				);
			});
		});
	});
});
