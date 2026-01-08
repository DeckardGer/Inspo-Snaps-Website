import { createFileRoute } from "@tanstack/react-router";
import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import {
	favouriteFolder,
	folder,
	folderImage,
	image,
	userShare,
} from "@/lib/db/schema";
import {
	FOLDER_NAME_MAX_LENGTH,
	FOLDER_NAME_MIN_LENGTH,
} from "@/lib/folders/constants";
import { createFolderAccessRevokedNotification } from "@/lib/notifications/create";
import { deleteStorageObjects } from "@/lib/storage/functions";

interface StoredFolder {
	id: string;
	name: string;
	parentId: string | null;
	createdAt: number;
	updatedAt: number;
}

function toStoredFolder(f: {
	id: string;
	name: string;
	parentId: string | null;
	createdAt: Date;
	updatedAt: Date;
}): StoredFolder {
	return {
		id: f.id,
		name: f.name,
		parentId: f.parentId,
		createdAt: f.createdAt.getTime(),
		updatedAt: f.updatedAt.getTime(),
	};
}

const CreateFolderSchema = z.object({
	name: z.string().min(FOLDER_NAME_MIN_LENGTH).max(FOLDER_NAME_MAX_LENGTH),
	parentId: z.string().uuid().nullable().optional(),
});

const UpdateFolderSchema = z.object({
	name: z
		.string()
		.min(FOLDER_NAME_MIN_LENGTH)
		.max(FOLDER_NAME_MAX_LENGTH)
		.optional(),
	parentId: z.string().uuid().nullable().optional(),
});

export const Route = createFileRoute("/api/extension/folders")({
	server: {
		handlers: {
			// GET all folders
			GET: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const folders = await db
					.select({
						id: folder.id,
						name: folder.name,
						parentId: folder.parentId,
						createdAt: folder.createdAt,
						updatedAt: folder.updatedAt,
					})
					.from(folder)
					.where(
						and(
							eq(folder.userId, session.user.id),
							isNull(folder.organizationId),
						),
					);

				const storedFolders: StoredFolder[] = folders.map(toStoredFolder);

				return Response.json({ folders: storedFolders });
			},

			// POST create folder
			POST: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const body = await request.json();
				const parsed = CreateFolderSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ error: "Invalid input", details: parsed.error.flatten() },
						{ status: 400 },
					);
				}

				const { name, parentId } = parsed.data;

				// Verify parent folder if provided
				if (parentId) {
					const parent = await db.query.folder.findFirst({
						where: and(
							eq(folder.id, parentId),
							eq(folder.userId, session.user.id),
							isNull(folder.organizationId),
						),
					});

					if (!parent) {
						return Response.json(
							{ error: "Parent folder not found" },
							{ status: 404 },
						);
					}
				}

				const newFolder = await db
					.insert(folder)
					.values({
						id: crypto.randomUUID(),
						name,
						color: "indigo",
						parentId: parentId ?? null,
						userId: session.user.id,
					})
					.returning();

				return Response.json({ folder: toStoredFolder(newFolder[0]) });
			},

			// TODO: Add support for moving folders into other folders
			// PATCH update folder
			PATCH: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const url = new URL(request.url);
				const id = url.searchParams.get("id");

				if (!id) {
					return Response.json({ error: "Missing folder id" }, { status: 400 });
				}

				const body = await request.json();
				const parsed = UpdateFolderSchema.safeParse(body);

				if (!parsed.success) {
					return Response.json(
						{ error: "Invalid input", details: parsed.error.flatten() },
						{ status: 400 },
					);
				}

				const result = await db
					.update(folder)
					.set(parsed.data)
					.where(
						and(
							eq(folder.id, id),
							eq(folder.userId, session.user.id),
							isNull(folder.organizationId),
						),
					)
					.returning();

				if (result.length === 0) {
					return Response.json({ error: "Folder not found" }, { status: 404 });
				}

				return Response.json({ folder: toStoredFolder(result[0]) });
			},

			// DELETE folder
			DELETE: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const url = new URL(request.url);
				const id = url.searchParams.get("id");

				if (!id) {
					return Response.json({ error: "Missing folder id" }, { status: 400 });
				}

				const allFolderIds = await getDescendantIds(id, session.user.id);
				allFolderIds.push(id);

				// Get folder info for notifications
				const folderToDelete = await db.query.folder.findFirst({
					where: and(
						eq(folder.id, id),
						eq(folder.userId, session.user.id),
						isNull(folder.organizationId),
					),
					columns: { id: true, name: true },
				});

				if (!folderToDelete) {
					return Response.json({ error: "Folder not found" }, { status: 404 });
				}

				// Get shared users for notifications
				const sharedUsers = await db.query.userShare.findMany({
					where: and(
						inArray(userShare.folderId, allFolderIds),
						or(
							eq(userShare.status, "pending"),
							eq(userShare.status, "accepted"),
						),
					),
					columns: { sharedWithUserId: true },
					with: { folder: { columns: { name: true } } },
				});

				// Get affected images
				const affectedImages = await db.query.folderImage.findMany({
					where: inArray(folderImage.folderId, allFolderIds),
					columns: { imageId: true },
				});
				const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

				// Remove from favourites first
				await db
					.delete(favouriteFolder)
					.where(inArray(favouriteFolder.folderId, allFolderIds));

				// Delete folder (cascades to children)
				await db
					.delete(folder)
					.where(
						and(
							eq(folder.id, id),
							eq(folder.userId, session.user.id),
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
					const orphanedIds = imageIds.filter(
						(imgId) => !stillLinkedIds.has(imgId),
					);

					if (orphanedIds.length > 0) {
						const orphanedImages = await db.query.image.findMany({
							where: inArray(image.id, orphanedIds),
							columns: { id: true, storageKey: true },
						});

						await db.delete(image).where(inArray(image.id, orphanedIds));
						await deleteStorageObjects(orphanedImages.map((i) => i.storageKey));
					}
				}

				// Notify shared users
				const userFolderMap = new Map<string, string>();
				for (const share of sharedUsers) {
					if (!userFolderMap.has(share.sharedWithUserId)) {
						userFolderMap.set(share.sharedWithUserId, share.folder.name);
					}
				}

				await Promise.all(
					Array.from(userFolderMap.entries()).map(([userId, folderName]) =>
						createFolderAccessRevokedNotification({
							recipientId: userId,
							actorId: session.user.id,
							folderName,
						}),
					),
				);

				return Response.json({ success: true });
			},
		},
	},
});

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
