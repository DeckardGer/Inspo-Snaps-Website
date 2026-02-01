import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import {
	favouriteFolder,
	folder,
	folderImage,
	image,
	member,
	userShare,
} from "@/lib/db/schema";
import {
	FOLDER_COLORS,
	FOLDER_NAME_MAX_LENGTH,
	FOLDER_NAME_MIN_LENGTH,
	type FolderColor,
} from "@/lib/folders/constants";
import { createFolderAccessRevokedNotification } from "@/lib/notifications/create";
import { deleteStorageObjects } from "@/lib/storage/functions";

const CreateFolderInput = z.object({
	name: z.string().min(FOLDER_NAME_MIN_LENGTH).max(FOLDER_NAME_MAX_LENGTH),
	color: z.enum(FOLDER_COLORS).default("indigo"),
	emoji: z.string().max(10).nullable().optional(),
	parentId: z.uuid().nullable().optional(),
});

const UpdateFolderInput = z.object({
	id: z.uuid(),
	name: z
		.string()
		.min(FOLDER_NAME_MIN_LENGTH)
		.max(FOLDER_NAME_MAX_LENGTH)
		.optional(),
	color: z.enum(FOLDER_COLORS).default("indigo"),
	emoji: z.string().max(10).nullable().optional(),
});

const MoveFolderInput = z.object({
	id: z.uuid(),
	newParentId: z.uuid().nullable(),
});

const GetFoldersInput = z
	.object({
		parentId: z.uuid().nullable().optional(),
	})
	.optional();

const FolderIdInput = z.object({
	id: z.uuid(),
});

export type Folder = {
	id: string;
	parentId: string | null;
	name: string;
	color: FolderColor;
	emoji: string | null;
	createdAt: Date;
	updatedAt: Date;
	imageCount: number;
	isShared: boolean;
	isFavourited: boolean;
};

export const createFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(CreateFolderInput)
	.handler(async ({ data, context }) => {
		if (data.parentId) {
			const parent = await db.query.folder.findFirst({
				where: and(
					eq(folder.id, data.parentId),
					eq(folder.userId, context.user.id),
					isNull(folder.organizationId),
				),
			});

			if (!parent) throw new Error("Parent folder not found or access denied");
		}

		const newFolder = await db
			.insert(folder)
			.values({
				id: crypto.randomUUID(),
				name: data.name,
				color: data.color,
				emoji: data.emoji ?? null,
				parentId: data.parentId ?? null,
				userId: context.user.id,
			})
			.returning();

		return newFolder[0];
	});

export const getFolders = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(GetFoldersInput)
	.handler(async ({ data, context }) => {
		const parentCondition = data?.parentId
			? eq(folder.parentId, data.parentId)
			: isNull(folder.parentId);

		const folders = await db.query.folder.findMany({
			where: and(
				eq(folder.userId, context.user.id),
				isNull(folder.organizationId),
				parentCondition,
			),
			orderBy: (folder, { asc }) => [asc(folder.name)],
			with: {
				images: { columns: { imageId: true } },
				shareLinks: { columns: { id: true }, limit: 1 },
				userShares: { columns: { folderId: true }, limit: 1 },
				favourites: { columns: { userId: true } },
			},
		});

		return folders.map((f) => ({
			id: f.id,
			parentId: f.parentId,
			name: f.name,
			color: f.color,
			emoji: f.emoji,
			createdAt: f.createdAt,
			updatedAt: f.updatedAt,
			imageCount: f.images.length,
			isShared: f.shareLinks.length > 0 || f.userShares.length > 0,
			isFavourited: f.favourites.some((fav) => fav.userId === context.user.id),
		})) satisfies Folder[];
	});

export const getFolder = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const result = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.userId, context.user.id),
				isNull(folder.organizationId),
			),
			with: {
				children: true,
				parent: true,
			},
		});

		if (!result) throw new Error("Folder not found");

		return result;
	});

export const updateFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateFolderInput)
	.handler(async ({ data, context }) => {
		const { id, ...updates } = data;

		const result = await db
			.update(folder)
			.set(updates)
			.where(
				and(
					eq(folder.id, id),
					eq(folder.userId, context.user.id),
					isNull(folder.organizationId),
				),
			)
			.returning();

		if (result.length === 0)
			throw new Error("Folder not found or access denied");

		return result[0];
	});

export const moveFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(MoveFolderInput)
	.handler(async ({ data, context }) => {
		const existingFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.userId, context.user.id),
				isNull(folder.organizationId),
			),
		});

		if (!existingFolder) throw new Error("Folder not found");

		if (data.newParentId) {
			const ancestors = await getAncestorIds(data.newParentId, context.user.id);
			if (ancestors.includes(data.id)) {
				throw new Error("Cannot move folder into its own descendant");
			}

			const parent = await db.query.folder.findFirst({
				where: and(
					eq(folder.id, data.newParentId),
					eq(folder.userId, context.user.id),
					isNull(folder.organizationId),
				),
			});

			if (!parent) throw new Error("Target folder not found");
		}

		const result = await db
			.update(folder)
			.set({ parentId: data.newParentId })
			.where(eq(folder.id, data.id))
			.returning();

		return result[0];
	});

export const deleteFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const allFolderIds = await getDescendantIds(data.id, context.user.id);
		allFolderIds.push(data.id);

		// Before deletion, get the folder name and all shared users to notify them
		const folderToDelete = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.userId, context.user.id),
				isNull(folder.organizationId),
			),
			columns: { id: true, name: true },
		});

		if (!folderToDelete) {
			throw new Error("Folder not found");
		}

		// Get all users who have access to this folder or its descendants
		const sharedUsers = await db.query.userShare.findMany({
			where: and(
				inArray(userShare.folderId, allFolderIds),
				or(eq(userShare.status, "pending"), eq(userShare.status, "accepted")),
			),
			columns: { sharedWithUserId: true, folderId: true },
			with: {
				folder: { columns: { name: true } },
			},
		});

		const affectedImages = await db.query.folderImage.findMany({
			where: inArray(folderImage.folderId, allFolderIds),
			columns: { imageId: true },
		});
		const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

		// Delete the folder (cascades to userShare and shareLink)
		await db
			.delete(folder)
			.where(
				and(
					eq(folder.id, data.id),
					eq(folder.userId, context.user.id),
					isNull(folder.organizationId),
				),
			);

		// Clean up orphaned images
		if (imageIds.length > 0) {
			const remainingLinks = await db.query.folderImage.findMany({
				where: inArray(folderImage.imageId, imageIds),
				columns: { imageId: true },
			});

			const stillLinkedIds = new Set(remainingLinks.map((r) => r.imageId));
			const orphanedIds = imageIds.filter((id) => !stillLinkedIds.has(id));

			if (orphanedIds.length > 0) {
				const orphanedImages = await db.query.image.findMany({
					where: inArray(image.id, orphanedIds),
					columns: { id: true, storageKey: true },
				});

				await db.delete(image).where(inArray(image.id, orphanedIds));

				await deleteStorageObjects(orphanedImages.map((i) => i.storageKey));
			}
		}

		// Notify all shared users that their access was revoked
		// Use a Map to avoid duplicate notifications per user (they might have access to multiple subfolders)
		const userFolderMap = new Map<string, string>();
		for (const share of sharedUsers) {
			// Only notify once per user, using the first folder name they had access to
			if (!userFolderMap.has(share.sharedWithUserId)) {
				userFolderMap.set(share.sharedWithUserId, share.folder.name);
			}
		}

		await Promise.all(
			Array.from(userFolderMap.entries()).map(([userId, folderName]) =>
				createFolderAccessRevokedNotification({
					recipientId: userId,
					actorId: context.user.id,
					folderName,
				}),
			),
		);

		return { success: true };
	});

async function getAncestorIds(
	folderId: string,
	userId: string,
): Promise<string[]> {
	const ancestors: string[] = [];
	let currentId: string | null = folderId;

	while (currentId) {
		const f: { parentId: string | null } | undefined =
			await db.query.folder.findFirst({
				where: and(
					eq(folder.id, currentId),
					eq(folder.userId, userId),
					isNull(folder.organizationId),
				),
				columns: { parentId: true },
			});

		if (!f?.parentId) break;

		ancestors.push(f.parentId);
		currentId = f.parentId;
	}

	return ancestors;
}

async function getDescendantIds(
	folderId: string,
	userId: string,
): Promise<string[]> {
	const descendants: string[] = [];
	const queue = [folderId];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) continue;

		const children = await db.query.folder.findMany({
			where: and(
				eq(folder.parentId, currentId),
				eq(folder.userId, userId),
				isNull(folder.organizationId),
			),
			columns: { id: true },
		});

		for (const child of children) {
			descendants.push(child.id);
			queue.push(child.id);
		}
	}

	return descendants;
}

export const getFolderPath = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const path: Array<{ id: string; name: string }> = [];
		let currentId: string | null = data.id;

		while (currentId) {
			const f:
				| { id: string; name: string; parentId: string | null }
				| undefined = await db.query.folder.findFirst({
				where: and(
					eq(folder.id, currentId),
					eq(folder.userId, context.user.id),
					isNull(folder.organizationId),
				),
				columns: { id: true, name: true, parentId: true },
			});

			if (!f) break;

			path.unshift({ id: f.id, name: f.name });
			currentId = f.parentId;
		}

		return path;
	});

export const addFolderToFavourites = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		// Check if user owns the folder
		const ownedFolder = await db.query.folder.findFirst({
			where: and(eq(folder.id, data.id), eq(folder.userId, context.user.id)),
		});

		// If not owned, check if user has accepted share access
		if (!ownedFolder) {
			const hasSharedAccess = await checkSharedFolderAccess(
				data.id,
				context.user.id,
			);
			if (!hasSharedAccess) {
				throw new Error("Folder not found or access denied");
			}
		}

		await db
			.insert(favouriteFolder)
			.values({
				userId: context.user.id,
				folderId: data.id,
			})
			.onConflictDoNothing();

		return { success: true };
	});

// Helper to check if user has accepted share access to a folder (or any parent)
async function checkSharedFolderAccess(
	folderId: string,
	userId: string,
): Promise<boolean> {
	let currentId: string | null = folderId;

	while (currentId) {
		const share = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, currentId),
				eq(userShare.sharedWithUserId, userId),
				eq(userShare.status, "accepted"),
			),
		});

		if (share) return true;

		const f: { parentId: string | null } | undefined =
			await db.query.folder.findFirst({
				where: eq(folder.id, currentId),
				columns: { parentId: true },
			});

		currentId = f?.parentId ?? null;
	}

	return false;
}

export const removeFolderFromFavourites = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		await db
			.delete(favouriteFolder)
			.where(
				and(
					eq(favouriteFolder.userId, context.user.id),
					eq(favouriteFolder.folderId, data.id),
				),
			);

		return { success: true };
	});

export type FavouriteFolder = {
	id: string;
	parentId: string | null;
	name: string;
	color: string | null;
	emoji: string | null;
	url: string;
	isShared: boolean;
	isRootShared: boolean;
	isTeamFolder: boolean;
	organizationId: string | null;
};

export const getFavouriteFolders = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const favourites = await db.query.favouriteFolder.findMany({
			where: eq(favouriteFolder.userId, context.user.id),
			with: {
				folder: {
					columns: {
						id: true,
						parentId: true,
						name: true,
						color: true,
						emoji: true,
						userId: true,
						organizationId: true,
					},
				},
			},
			orderBy: (ff, { desc }) => [desc(ff.createdAt)],
		});

		// Get all shared folder IDs to check which are root shares
		const sharedFolderIds = favourites
			.filter(
				(fav) =>
					fav.folder.userId !== context.user.id && !fav.folder.organizationId,
			)
			.map((fav) => fav.folder.id);

		// Find which shared folders have direct userShare entries (are root shares)
		const rootShares =
			sharedFolderIds.length > 0
				? await db.query.userShare.findMany({
						where: and(
							eq(userShare.sharedWithUserId, context.user.id),
							eq(userShare.status, "accepted"),
							inArray(userShare.folderId, sharedFolderIds),
						),
						columns: { folderId: true },
					})
				: [];

		const rootShareSet = new Set(rootShares.map((s) => s.folderId));

		return favourites.map((fav) => {
			const isOwned = fav.folder.userId === context.user.id;
			const isTeamFolder = !!fav.folder.organizationId;
			const isRootShared =
				!isOwned && !isTeamFolder && rootShareSet.has(fav.folder.id);

			// Determine the correct URL
			let url: string;
			if (isTeamFolder && fav.folder.organizationId) {
				url = `/team-folders/${fav.folder.organizationId}/${fav.folder.id}`;
			} else if (isOwned) {
				url = `/my-folders/${fav.folder.id}`;
			} else {
				url = `/shared-folders/${fav.folder.id}`;
			}

			return {
				id: fav.folder.id,
				parentId: fav.folder.parentId,
				name: fav.folder.name,
				color: fav.folder.color,
				emoji: fav.folder.emoji,
				url,
				isShared: !isOwned && !isTeamFolder,
				isRootShared,
				isTeamFolder,
				organizationId: fav.folder.organizationId,
			};
		}) satisfies FavouriteFolder[];
	});

export type FolderStats = {
	nestedFolderCount: number;
	imageCount: number;
};

export const getFolderStats = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }): Promise<FolderStats> => {
		// Verify folder belongs to user and is not a team folder
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.userId, context.user.id),
				isNull(folder.organizationId),
			),
		});
		if (!f) throw new Error("Folder not found or access denied");

		// Get all descendant folder IDs
		const descendantIds = await getDescendantIds(data.id, context.user.id);
		const allFolderIds = [data.id, ...descendantIds];

		// Count images across all folders
		const imageResults = await db
			.select({ imageId: folderImage.imageId })
			.from(folderImage)
			.where(inArray(folderImage.folderId, allFolderIds));

		// Use Set to count unique images (an image might be in multiple folders)
		const uniqueImageIds = new Set(imageResults.map((r) => r.imageId));

		return {
			nestedFolderCount: descendantIds.length,
			imageCount: uniqueImageIds.size,
		};
	});

// ============================================================================
// Team Folder Functions
// ============================================================================

const CreateTeamFolderInput = z.object({
	name: z.string().min(FOLDER_NAME_MIN_LENGTH).max(FOLDER_NAME_MAX_LENGTH),
	color: z.enum(FOLDER_COLORS).default("indigo"),
	emoji: z.string().max(10).nullable().optional(),
	parentId: z.string().nullable().optional(),
	organizationId: z.string(),
});

const GetTeamFoldersInput = z.object({
	organizationId: z.string(),
	parentId: z.string().nullable().optional(),
});

const TeamFolderIdInput = z.object({
	id: z.string(),
	organizationId: z.string(),
});

const UpdateTeamFolderInput = z.object({
	id: z.string(),
	organizationId: z.string(),
	name: z
		.string()
		.min(FOLDER_NAME_MIN_LENGTH)
		.max(FOLDER_NAME_MAX_LENGTH)
		.optional(),
	color: z.enum(FOLDER_COLORS).optional(),
	emoji: z.string().max(10).nullable().optional(),
});

export type TeamFolder = {
	id: string;
	parentId: string | null;
	name: string;
	color: FolderColor;
	emoji: string | null;
	createdAt: Date;
	updatedAt: Date;
	imageCount: number;
	isFavourited: boolean;
	createdBy: {
		id: string;
		name: string;
		image: string | null;
	};
};

export const createTeamFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(CreateTeamFolderInput)
	.handler(async ({ data, context }) => {
		// Verify user is member of organization
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) {
			throw new Error("You are not a member of this organization");
		}

		// If creating in a subfolder, verify parent belongs to same org
		if (data.parentId) {
			const parent = await db.query.folder.findFirst({
				where: and(
					eq(folder.id, data.parentId),
					eq(folder.organizationId, data.organizationId),
				),
			});

			if (!parent) {
				throw new Error(
					"Parent folder not found or belongs to different organization",
				);
			}
		}

		const newFolder = await db
			.insert(folder)
			.values({
				id: crypto.randomUUID(),
				name: data.name,
				color: data.color,
				emoji: data.emoji ?? null,
				parentId: data.parentId ?? null,
				userId: context.user.id,
				organizationId: data.organizationId,
			})
			.returning();

		return newFolder[0];
	});

export const getTeamFolders = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(GetTeamFoldersInput)
	.handler(async ({ data, context }) => {
		// Verify user is member
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) {
			throw new Error("You are not a member of this organization");
		}

		const parentCondition = data.parentId
			? eq(folder.parentId, data.parentId)
			: isNull(folder.parentId);

		const folders = await db.query.folder.findMany({
			where: and(
				eq(folder.organizationId, data.organizationId),
				parentCondition,
			),
			orderBy: (folder, { asc }) => [asc(folder.name)],
			with: {
				images: { columns: { imageId: true } },
				owner: { columns: { id: true, name: true, image: true } },
				favourites: { columns: { userId: true } },
			},
		});

		return folders.map((f) => ({
			id: f.id,
			parentId: f.parentId,
			name: f.name,
			color: f.color,
			emoji: f.emoji,
			createdAt: f.createdAt,
			updatedAt: f.updatedAt,
			imageCount: f.images.length,
			createdBy: f.owner,
			isFavourited: f.favourites.some((fav) => fav.userId === context.user.id),
		})) satisfies TeamFolder[];
	});

export const updateTeamFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateTeamFolderInput)
	.handler(async ({ data, context }) => {
		const { id, organizationId, ...updates } = data;

		const existingFolder = await db.query.folder.findFirst({
			where: and(eq(folder.id, id), eq(folder.organizationId, organizationId)),
		});

		if (!existingFolder) {
			throw new Error("Team folder not found");
		}

		// Check permissions: creator or org admin/owner
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) {
			throw new Error("You are not a member of this organization");
		}

		const isCreator = existingFolder.userId === context.user.id;
		const isAdminOrOwner = ["owner", "admin"].includes(membership.role);

		if (!isCreator && !isAdminOrOwner) {
			throw new Error(
				"Only the folder creator or organization admins can edit this folder",
			);
		}

		const result = await db
			.update(folder)
			.set(updates)
			.where(eq(folder.id, id))
			.returning();

		return result[0];
	});

export const deleteTeamFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(TeamFolderIdInput)
	.handler(async ({ data, context }) => {
		const existingFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.organizationId, data.organizationId),
			),
		});

		if (!existingFolder) {
			throw new Error("Team folder not found");
		}

		// Check permissions
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) {
			throw new Error("You are not a member of this organization");
		}

		const isCreator = existingFolder.userId === context.user.id;
		const isAdminOrOwner = ["owner", "admin"].includes(membership.role);

		if (!isCreator && !isAdminOrOwner) {
			throw new Error(
				"Only the folder creator or organization admins can delete this folder",
			);
		}

		// Get all descendant folders for cleanup
		const allFolderIds = await getTeamDescendantIds(
			data.id,
			data.organizationId,
		);
		allFolderIds.push(data.id);

		// Handle images (similar to existing deleteFolder logic)
		const affectedImages = await db.query.folderImage.findMany({
			where: inArray(folderImage.folderId, allFolderIds),
			columns: { imageId: true },
		});
		const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

		await db.delete(folder).where(eq(folder.id, data.id));

		// Clean up orphaned images
		if (imageIds.length > 0) {
			const remainingLinks = await db.query.folderImage.findMany({
				where: inArray(folderImage.imageId, imageIds),
				columns: { imageId: true },
			});

			const stillLinkedIds = new Set(remainingLinks.map((r) => r.imageId));
			const orphanedIds = imageIds.filter((id) => !stillLinkedIds.has(id));

			if (orphanedIds.length > 0) {
				const orphanedImages = await db.query.image.findMany({
					where: inArray(image.id, orphanedIds),
					columns: { id: true, storageKey: true },
				});

				await db.delete(image).where(inArray(image.id, orphanedIds));
				await deleteStorageObjects(orphanedImages.map((i) => i.storageKey));
			}
		}

		return { success: true };
	});

async function getTeamDescendantIds(
	folderId: string,
	organizationId: string,
): Promise<string[]> {
	const descendants: string[] = [];
	const queue = [folderId];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) continue;

		const children = await db.query.folder.findMany({
			where: and(
				eq(folder.parentId, currentId),
				eq(folder.organizationId, organizationId),
			),
			columns: { id: true },
		});

		for (const child of children) {
			descendants.push(child.id);
			queue.push(child.id);
		}
	}

	return descendants;
}

export const getTeamFolderPath = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(TeamFolderIdInput)
	.handler(async ({ data, context }) => {
		// Verify membership
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		const path: Array<{ id: string; name: string }> = [];
		let currentId: string | null = data.id;

		while (currentId) {
			const f:
				| { id: string; name: string; parentId: string | null }
				| undefined = await db.query.folder.findFirst({
				where: and(
					eq(folder.id, currentId),
					eq(folder.organizationId, data.organizationId),
				),
				columns: { id: true, name: true, parentId: true },
			});

			if (!f) break;

			path.unshift({ id: f.id, name: f.name });
			currentId = f.parentId;
		}

		return path;
	});

export const getTeamFolderStats = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(TeamFolderIdInput)
	.handler(async ({ data, context }): Promise<FolderStats> => {
		// Verify membership
		const membership = await db.query.member.findFirst({
			where: and(
				eq(member.organizationId, data.organizationId),
				eq(member.userId, context.user.id),
			),
		});

		if (!membership) throw new Error("Not a member of this organization");

		// Verify folder belongs to organization
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.id),
				eq(folder.organizationId, data.organizationId),
			),
		});

		if (!f) throw new Error("Folder not found");

		// Get all descendant folder IDs
		const descendantIds = await getTeamDescendantIds(
			data.id,
			data.organizationId,
		);
		const allFolderIds = [data.id, ...descendantIds];

		// Count images across all folders
		const imageResults = await db
			.select({ imageId: folderImage.imageId })
			.from(folderImage)
			.where(inArray(folderImage.folderId, allFolderIds));

		// Use Set to count unique images
		const uniqueImageIds = new Set(imageResults.map((r) => r.imageId));

		return {
			nestedFolderCount: descendantIds.length,
			imageCount: uniqueImageIds.size,
		};
	});
