/**
 * Tests for image server functions
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createTeamFolder as createTeamFolderFixture,
	createTestFolder,
	createTestFolderImage,
	createTestImage,
	resetFolderCounters,
} from "@/test/fixtures/folder.fixtures";
import {
	createTestMember,
	createTestOrganization,
	createTestUser,
	resetUserCounter,
} from "@/test/fixtures/user.fixtures";
import { getMockDb } from "@/test/mocks/db.mock";
import { getMockStorageFunctions } from "@/test/mocks/s3.mock";

// Helper to create valid test UUIDs inline
const uuid = (id: string) =>
	`${id.padStart(8, "0")}-0000-4000-8000-000000000000`;

describe("Image Functions", () => {
	beforeEach(() => {
		resetUserCounter();
		resetFolderCounters();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("saveImage", () => {
		it("saves image metadata and links to folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const newImage = createTestImage(user.id, {
				filename: "test-image.jpg",
				storageKey: "user/test-image.jpg",
			});

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.insert.mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([newImage]),
				}),
			});

			const { saveImage } = await import("@/lib/images/functions");

			const result = await saveImage({
				data: {
					filename: "test-image.jpg",
					storageKey: "user/test-image.jpg",
					mimeType: "image/jpeg",
					sizeBytes: 102400,
					width: 800,
					height: 600,
					folderId: folder.id,
				},
				context: { user },
			});

			expect(result).toEqual(newImage);
			expect(db.insert).toHaveBeenCalled();
		});

		it("saves image with origin URL", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const newImage = createTestImage(user.id, {
				originUrl: "https://example.com/original.jpg",
			});

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.insert.mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([newImage]),
				}),
			});

			const { saveImage } = await import("@/lib/images/functions");

			const result = await saveImage({
				data: {
					filename: "test.jpg",
					storageKey: "user/test.jpg",
					mimeType: "image/jpeg",
					sizeBytes: 50000,
					folderId: folder.id,
					originUrl: "https://example.com/original.jpg",
				},
				context: { user },
			});

			expect(result.originUrl).toBe("https://example.com/original.jpg");
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			db.query.folder.findFirst.mockResolvedValue(null);

			const { saveImage } = await import("@/lib/images/functions");

			await expect(
				saveImage({
					data: {
						filename: "test.jpg",
						storageKey: "user/test.jpg",
						mimeType: "image/jpeg",
						sizeBytes: 50000,
						folderId: uuid("fff00001"),
					},
					context: { user },
				}),
			).rejects.toThrow("Folder not found or access denied");
		});
	});

	describe("addImageToFolder", () => {
		it("adds existing image to folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const image = createTestImage(user.id);

			db.query.image.findFirst.mockResolvedValue(image);
			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findFirst.mockResolvedValue(null); // Not already in folder
			db.insert.mockReturnValue({
				values: vi.fn().mockResolvedValue(undefined),
			});

			const { addImageToFolder } = await import("@/lib/images/functions");

			const result = await addImageToFolder({
				data: { imageId: image.id, folderId: folder.id },
				context: { user },
			});

			expect(result).toEqual({ success: true });
		});

		it("throws error when image not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			db.query.image.findFirst.mockResolvedValue(null);

			const { addImageToFolder } = await import("@/lib/images/functions");

			await expect(
				addImageToFolder({
					data: { imageId: uuid("fff00001"), folderId: uuid("fff00002") },
					context: { user },
				}),
			).rejects.toThrow("Image not found");
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const image = createTestImage(user.id);

			db.query.image.findFirst.mockResolvedValue(image);
			db.query.folder.findFirst.mockResolvedValue(null);

			const { addImageToFolder } = await import("@/lib/images/functions");

			await expect(
				addImageToFolder({
					data: { imageId: image.id, folderId: uuid("fff00001") },
					context: { user },
				}),
			).rejects.toThrow("Folder not found");
		});

		it("throws error when image already in folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const image = createTestImage(user.id);

			db.query.image.findFirst.mockResolvedValue(image);
			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findFirst.mockResolvedValue(
				createTestFolderImage(folder.id, image.id),
			);

			const { addImageToFolder } = await import("@/lib/images/functions");

			await expect(
				addImageToFolder({
					data: { imageId: image.id, folderId: folder.id },
					context: { user },
				}),
			).rejects.toThrow("Image already in folder");
		});
	});

	describe("removeImageFromFolder", () => {
		it("removes image from folder without deleting", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const image = createTestImage(user.id);

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findFirst
				.mockResolvedValueOnce(
					createTestFolderImage(folder.id, image.id, image),
				) // Verify in folder
				.mockResolvedValueOnce({ imageId: image.id }); // Still linked elsewhere
			db.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined),
			});

			const { removeImageFromFolder } = await import("@/lib/images/functions");

			const result = await removeImageFromFolder({
				data: { imageId: image.id, folderId: folder.id },
				context: { user },
			});

			expect(result).toEqual({ deleted: false });
		});

		it("removes image and deletes when orphaned", async () => {
			const db = await getMockDb();
			const storage = await getMockStorageFunctions();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const image = createTestImage(user.id, { storageKey: "user/orphan.jpg" });

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findFirst
				.mockResolvedValueOnce(
					createTestFolderImage(folder.id, image.id, image),
				) // In folder
				.mockResolvedValueOnce(null); // No other links = orphaned
			db.delete.mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined),
			});

			const { removeImageFromFolder } = await import("@/lib/images/functions");

			const result = await removeImageFromFolder({
				data: { imageId: image.id, folderId: folder.id },
				context: { user },
			});

			expect(result).toEqual({ deleted: true });
			expect(storage.deleteStorageObject).toHaveBeenCalledWith(
				"user/orphan.jpg",
			);
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			db.query.folder.findFirst.mockResolvedValue(null);

			const { removeImageFromFolder } = await import("@/lib/images/functions");

			await expect(
				removeImageFromFolder({
					data: { imageId: uuid("fff00001"), folderId: uuid("fff00002") },
					context: { user },
				}),
			).rejects.toThrow("Folder not found or access denied");
		});

		it("throws error when image not in folder", async () => {
			const db = await getMockDb();
			const user = createTestUser();
			const folder = createTestFolder(user.id);

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findFirst.mockResolvedValue(null);

			const { removeImageFromFolder } = await import("@/lib/images/functions");

			await expect(
				removeImageFromFolder({
					data: { imageId: uuid("fff00001"), folderId: folder.id },
					context: { user },
				}),
			).rejects.toThrow("Image not found in folder");
		});
	});

	describe("getFolderImages", () => {
		it("returns images with presigned URLs", async () => {
			const db = await getMockDb();
			const storage = await getMockStorageFunctions();
			const user = createTestUser();
			const folder = createTestFolder(user.id);
			const image1 = createTestImage(user.id);
			const image2 = createTestImage(user.id);

			db.query.folder.findFirst.mockResolvedValue(folder);
			db.query.folderImage.findMany.mockResolvedValue([
				createTestFolderImage(folder.id, image1.id, image1),
				createTestFolderImage(folder.id, image2.id, image2),
			]);
			storage.createPresignedDownloadUrl.mockResolvedValue(
				"https://s3.example.com/download",
			);

			const { getFolderImages } = await import("@/lib/images/functions");

			const result = await getFolderImages({
				data: { folderId: folder.id },
				context: { user },
			});

			expect(result).toHaveLength(2);
			expect(result[0].imageUrl).toBe("https://s3.example.com/download");
		});

		it("throws error when folder not found", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			db.query.folder.findFirst.mockResolvedValue(null);

			const { getFolderImages } = await import("@/lib/images/functions");

			await expect(
				getFolderImages({
					data: { folderId: uuid("fff00001") },
					context: { user },
				}),
			).rejects.toThrow("Folder not found");
		});
	});

	describe("Team Image Functions", () => {
		describe("saveTeamImage", () => {
			it("saves image to team folder", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();
				const membership = createTestMember(org.id, user.id, "member");
				const folder = createTeamFolderFixture(user.id, org.id);
				const newImage = createTestImage(user.id);

				db.query.member.findFirst.mockResolvedValue(membership);
				db.query.folder.findFirst.mockResolvedValue(folder);
				db.insert.mockReturnValue({
					values: vi.fn().mockReturnValue({
						returning: vi.fn().mockResolvedValue([newImage]),
					}),
				});

				const { saveTeamImage } = await import("@/lib/images/functions");

				const result = await saveTeamImage({
					data: {
						filename: "team-image.jpg",
						storageKey: "team/image.jpg",
						mimeType: "image/jpeg",
						sizeBytes: 50000,
						folderId: folder.id,
						organizationId: org.id,
					},
					context: { user },
				});

				expect(result).toEqual(newImage);
			});

			it("throws error when not org member", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();

				db.query.member.findFirst.mockResolvedValue(null);

				const { saveTeamImage } = await import("@/lib/images/functions");

				await expect(
					saveTeamImage({
						data: {
							filename: "team-image.jpg",
							storageKey: "team/image.jpg",
							mimeType: "image/jpeg",
							sizeBytes: 50000,
							folderId: uuid("fff00001"),
							organizationId: org.id,
						},
						context: { user },
					}),
				).rejects.toThrow("You are not a member of this organization");
			});
		});

		describe("getTeamFolderImages", () => {
			it("returns team folder images with presigned URLs", async () => {
				const db = await getMockDb();
				const storage = await getMockStorageFunctions();
				const user = createTestUser();
				const org = createTestOrganization();
				const membership = createTestMember(org.id, user.id, "member");
				const folder = createTeamFolderFixture(user.id, org.id);
				const image = createTestImage(user.id);

				db.query.member.findFirst.mockResolvedValue(membership);
				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.folderImage.findMany.mockResolvedValue([
					createTestFolderImage(folder.id, image.id, image),
				]);
				storage.createPresignedDownloadUrl.mockResolvedValue(
					"https://s3.example.com/team-download",
				);

				const { getTeamFolderImages } = await import("@/lib/images/functions");

				const result = await getTeamFolderImages({
					data: { folderId: folder.id, organizationId: org.id },
					context: { user },
				});

				expect(result).toHaveLength(1);
				expect(result[0].imageUrl).toBe("https://s3.example.com/team-download");
			});

			it("throws error when not org member", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();

				db.query.member.findFirst.mockResolvedValue(null);

				const { getTeamFolderImages } = await import("@/lib/images/functions");

				await expect(
					getTeamFolderImages({
						data: { folderId: uuid("fff00001"), organizationId: org.id },
						context: { user },
					}),
				).rejects.toThrow("You are not a member of this organization");
			});
		});

		describe("removeTeamImageFromFolder", () => {
			it("removes team image and deletes when orphaned", async () => {
				const db = await getMockDb();
				const storage = await getMockStorageFunctions();
				const user = createTestUser();
				const org = createTestOrganization();
				const membership = createTestMember(org.id, user.id, "member");
				const folder = createTeamFolderFixture(user.id, org.id);
				const image = createTestImage(user.id, {
					storageKey: "team/orphan.jpg",
				});

				db.query.member.findFirst.mockResolvedValue(membership);
				db.query.folder.findFirst.mockResolvedValue(folder);
				db.query.folderImage.findFirst
					.mockResolvedValueOnce(
						createTestFolderImage(folder.id, image.id, image),
					)
					.mockResolvedValueOnce(null); // Orphaned
				db.delete.mockReturnValue({
					where: vi.fn().mockResolvedValue(undefined),
				});

				const { removeTeamImageFromFolder } = await import(
					"@/lib/images/functions"
				);

				const result = await removeTeamImageFromFolder({
					data: {
						imageId: image.id,
						folderId: folder.id,
						organizationId: org.id,
					},
					context: { user },
				});

				expect(result).toEqual({ deleted: true });
				expect(storage.deleteStorageObject).toHaveBeenCalledWith(
					"team/orphan.jpg",
				);
			});

			it("throws error when not org member", async () => {
				const db = await getMockDb();
				const user = createTestUser();
				const org = createTestOrganization();

				db.query.member.findFirst.mockResolvedValue(null);

				const { removeTeamImageFromFolder } = await import(
					"@/lib/images/functions"
				);

				await expect(
					removeTeamImageFromFolder({
						data: {
							imageId: uuid("fff00001"),
							folderId: uuid("fff00002"),
							organizationId: org.id,
						},
						context: { user },
					}),
				).rejects.toThrow("You are not a member of this organization");
			});
		});
	});
});
