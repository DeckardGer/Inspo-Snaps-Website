import { createFileRoute } from "@tanstack/react-router";
import { and, eq, inArray, isNull, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
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
	organizationId: z.string().nullable().optional(),
});

const UpdateFolderSchema = z.object({
	name: z
		.string()
		.min(FOLDER_NAME_MIN_LENGTH)
		.max(FOLDER_NAME_MAX_LENGTH)
		.optional(),
	parentId: z.string().uuid().nullable().optional(),
});

async function verifyMembership(userId: string, organizationId: string) {
	return db.query.member.findFirst({
		where: and(
			eq(member.organizationId, organizationId),
			eq(member.userId, userId),
		),
	});
}

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

				const url = new URL(request.url);
				const organizationId = url.searchParams.get("organizationId");

				if (organizationId) {
					const membership = await verifyMembership(
						session.user.id,
						organizationId,
					);
					if (!membership) {
						return Response.json(
							{ error: "Organization not found" },
							{ status: 404 },
						);
					}
				}

				const whereCondition = organizationId
					? eq(folder.organizationId, organizationId)
					: and(
							eq(folder.userId, session.user.id),
							isNull(folder.organizationId),
						);

				const folders = await db
					.select({
						id: folder.id,
						name: folder.name,
						parentId: folder.parentId,
						createdAt: folder.createdAt,
						updatedAt: folder.updatedAt,
					})
					.from(folder)
					.where(whereCondition);

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
				const organizationId =
					parsed.data.organizationId ||
					new URL(request.url).searchParams.get("organizationId") ||
					null;

				if (organizationId) {
					const membership = await verifyMembership(
						session.user.id,
						organizationId,
					);
					if (!membership) {
						return Response.json(
							{ error: "Organization not found" },
							{ status: 404 },
						);
					}
					if (membership.role === "viewer") {
						return Response.json(
							{ error: "Insufficient permissions" },
							{ status: 403 },
						);
					}

					// Verify parent belongs to same organization
					if (parentId) {
						const parent = await db.query.folder.findFirst({
							where: and(
								eq(folder.id, parentId),
								eq(folder.organizationId, organizationId),
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
							organizationId,
						})
						.returning();

					return Response.json({ folder: toStoredFolder(newFolder[0]) });
				}

				// Personal folder creation
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
				const organizationId = url.searchParams.get("organizationId");

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

				if (organizationId) {
					const membership = await verifyMembership(
						session.user.id,
						organizationId,
					);
					if (!membership) {
						return Response.json(
							{ error: "Organization not found" },
							{ status: 404 },
						);
					}

					// Check existing folder for creator-based permission
					const existingFolder = await db.query.folder.findFirst({
						where: and(
							eq(folder.id, id),
							eq(folder.organizationId, organizationId),
						),
						columns: { userId: true },
					});

					if (!existingFolder) {
						return Response.json(
							{ error: "Folder not found" },
							{ status: 404 },
						);
					}

					const isCreator = existingFolder.userId === session.user.id;
					const isAdminOrOwner = ["owner", "admin"].includes(membership.role);

					if (!isCreator && !isAdminOrOwner) {
						return Response.json(
							{ error: "Insufficient permissions" },
							{ status: 403 },
						);
					}

					const result = await db
						.update(folder)
						.set(parsed.data)
						.where(
							and(eq(folder.id, id), eq(folder.organizationId, organizationId)),
						)
						.returning();

					return Response.json({ folder: toStoredFolder(result[0]) });
				}

				// Personal folder update
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
				const organizationId = url.searchParams.get("organizationId");

				if (!id) {
					return Response.json({ error: "Missing folder id" }, { status: 400 });
				}

				if (organizationId) {
					return handleDeleteOrgFolder(id, organizationId, session.user.id);
				}

				return handleDeletePersonalFolder(id, session.user.id);
			},
		},
	},
});

async function handleDeleteOrgFolder(
	id: string,
	organizationId: string,
	userId: string,
) {
	const membership = await verifyMembership(userId, organizationId);
	if (!membership) {
		return Response.json({ error: "Organization not found" }, { status: 404 });
	}

	const folderToDelete = await db.query.folder.findFirst({
		where: and(eq(folder.id, id), eq(folder.organizationId, organizationId)),
		columns: { id: true, name: true, userId: true },
	});

	if (!folderToDelete) {
		return Response.json({ error: "Folder not found" }, { status: 404 });
	}

	const isCreator = folderToDelete.userId === userId;
	const isAdminOrOwner = ["owner", "admin"].includes(membership.role);
	if (!isCreator && !isAdminOrOwner) {
		return Response.json(
			{ error: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	const allFolderIds = await getDescendantIdsForOrg(id, organizationId);
	allFolderIds.push(id);

	const affectedImages = await db.query.folderImage.findMany({
		where: inArray(folderImage.folderId, allFolderIds),
		columns: { imageId: true },
	});
	const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

	await db
		.delete(favouriteFolder)
		.where(inArray(favouriteFolder.folderId, allFolderIds));

	await db
		.delete(folder)
		.where(and(eq(folder.id, id), eq(folder.organizationId, organizationId)));

	if (imageIds.length > 0) {
		const remainingLinks = await db.query.folderImage.findMany({
			where: inArray(folderImage.imageId, imageIds),
			columns: { imageId: true },
		});

		const stillLinkedIds = new Set(remainingLinks.map((r) => r.imageId));
		const orphanedIds = imageIds.filter((imgId) => !stillLinkedIds.has(imgId));

		if (orphanedIds.length > 0) {
			const orphanedImages = await db.query.image.findMany({
				where: inArray(image.id, orphanedIds),
				columns: { id: true, storageKey: true },
			});

			await db.delete(image).where(inArray(image.id, orphanedIds));
			await deleteStorageObjects(orphanedImages.map((i) => i.storageKey));
		}
	}

	return Response.json({ success: true });
}

async function handleDeletePersonalFolder(id: string, userId: string) {
	const allFolderIds = await getDescendantIdsForUser(id, userId);
	allFolderIds.push(id);

	const folderToDelete = await db.query.folder.findFirst({
		where: and(
			eq(folder.id, id),
			eq(folder.userId, userId),
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
			or(eq(userShare.status, "pending"), eq(userShare.status, "accepted")),
		),
		columns: { sharedWithUserId: true },
		with: { folder: { columns: { name: true } } },
	});

	const affectedImages = await db.query.folderImage.findMany({
		where: inArray(folderImage.folderId, allFolderIds),
		columns: { imageId: true },
	});
	const imageIds = [...new Set(affectedImages.map((fi) => fi.imageId))];

	await db
		.delete(favouriteFolder)
		.where(inArray(favouriteFolder.folderId, allFolderIds));

	await db
		.delete(folder)
		.where(
			and(
				eq(folder.id, id),
				eq(folder.userId, userId),
				isNull(folder.organizationId),
			),
		);

	if (imageIds.length > 0) {
		const remainingLinks = await db.query.folderImage.findMany({
			where: inArray(folderImage.imageId, imageIds),
			columns: { imageId: true },
		});

		const stillLinkedIds = new Set(remainingLinks.map((r) => r.imageId));
		const orphanedIds = imageIds.filter((imgId) => !stillLinkedIds.has(imgId));

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
		Array.from(userFolderMap.entries()).map(([recipientId, folderName]) =>
			createFolderAccessRevokedNotification({
				recipientId,
				actorId: userId,
				folderName,
			}),
		),
	);

	return Response.json({ success: true });
}

async function getDescendantIdsForOrg(
	folderId: string,
	organizationId: string,
): Promise<string[]> {
	return getDescendantIdsWithCondition(
		folderId,
		eq(folder.organizationId, organizationId),
	);
}

async function getDescendantIdsForUser(
	folderId: string,
	userId: string,
): Promise<string[]> {
	return getDescendantIdsWithCondition(
		folderId,
		and(eq(folder.userId, userId), isNull(folder.organizationId)),
	);
}

async function getDescendantIdsWithCondition(
	folderId: string,
	scopeCondition: SQL | undefined,
): Promise<string[]> {
	const descendants: string[] = [];
	const queue = [folderId];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) continue;

		const children = await db.query.folder.findMany({
			where: and(eq(folder.parentId, currentId), scopeCondition),
			columns: { id: true },
		});

		for (const child of children) {
			descendants.push(child.id);
			queue.push(child.id);
		}
	}

	return descendants;
}
