import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import {
	favouriteFolder,
	folder,
	folderImage,
	image,
	shareLink,
	userShare,
} from "@/lib/db/schema";
import { FOLDER_COLORS, type FolderColor } from "@/lib/folders/constants";
import { deleteStorageObjects } from "@/lib/storage/functions";

const CreateFolderInput = z.object({
	name: z.string().min(1).max(255),
	color: z.enum(FOLDER_COLORS).default("indigo"),
	emoji: z.string().max(10).nullable().optional(),
	parentId: z.uuid().nullable().optional(),
});

const UpdateFolderInput = z.object({
	id: z.uuid(),
	name: z.string().min(1).max(255).optional(),
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
	name: string;
	color: FolderColor;
	emoji: string | null;
	createdAt: Date;
	updatedAt: Date;
	imageCount: number;
	isShared: boolean;
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
			where: and(eq(folder.userId, context.user.id), parentCondition),
			orderBy: (folder, { asc }) => [asc(folder.name)],
		});

		const foldersWithStats: Folder[] = await Promise.all(
			folders.map(async (f) => {
				const imageCountResult = await db
					.select({ count: folderImage.imageId })
					.from(folderImage)
					.where(eq(folderImage.folderId, f.id));

				const imageCount = imageCountResult.length;

				const [shareLinkResult, userShareResult] = await Promise.all([
					db.query.shareLink.findFirst({
						where: eq(shareLink.folderId, f.id),
						columns: { id: true },
					}),
					db.query.userShare.findFirst({
						where: eq(userShare.folderId, f.id),
						columns: { folderId: true },
					}),
				]);

				const isShared = !!shareLinkResult || !!userShareResult;

				return {
					id: f.id,
					name: f.name,
					color: f.color,
					emoji: f.emoji,
					createdAt: f.createdAt,
					updatedAt: f.updatedAt,
					imageCount,
					isShared,
				};
			}),
		);

		return foldersWithStats;
	});

export const getFolder = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const result = await db.query.folder.findFirst({
			where: and(eq(folder.id, data.id), eq(folder.userId, context.user.id)),
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
			.where(and(eq(folder.id, id), eq(folder.userId, context.user.id)))
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
			where: and(eq(folder.id, data.id), eq(folder.userId, context.user.id)),
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

		const affectedImages = await db.query.folderImage.findMany({
			where: inArray(folderImage.folderId, allFolderIds),
			columns: { imageId: true },
		});
		const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

		await db
			.delete(folder)
			.where(and(eq(folder.id, data.id), eq(folder.userId, context.user.id)));

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

async function getAncestorIds(
	folderId: string,
	userId: string,
): Promise<string[]> {
	const ancestors: string[] = [];
	let currentId: string | null = folderId;

	while (currentId) {
		const f: { parentId: string | null } | undefined =
			await db.query.folder.findFirst({
				where: and(eq(folder.id, currentId), eq(folder.userId, userId)),
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
			where: and(eq(folder.parentId, currentId), eq(folder.userId, userId)),
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
		const f = await db.query.folder.findFirst({
			where: and(eq(folder.id, data.id), eq(folder.userId, context.user.id)),
		});
		if (!f) throw new Error("Folder not found or access denied");

		await db
			.insert(favouriteFolder)
			.values({
				userId: context.user.id,
				folderId: data.id,
			})
			.onConflictDoNothing();

		return { success: true };
	});

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
	name: string;
	color: string | null;
	emoji: string | null;
	url: string;
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
						name: true,
						color: true,
						emoji: true,
					},
				},
			},
			orderBy: (ff, { desc }) => [desc(ff.createdAt)],
		});

		return favourites.map((fav) => ({
			...fav.folder,
			url: `/folders/${fav.folder.id}`,
		})) satisfies FavouriteFolder[];
	});

export const isFolderFavourited = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const favourite = await db.query.favouriteFolder.findFirst({
			where: and(
				eq(favouriteFolder.userId, context.user.id),
				eq(favouriteFolder.folderId, data.id),
			),
		});

		return { isFavourited: !!favourite };
	});
