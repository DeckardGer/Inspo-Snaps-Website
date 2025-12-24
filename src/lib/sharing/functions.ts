import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import {
	favouriteFolder,
	folder,
	folderImage,
	shareLink,
	user,
	userShare,
} from "@/lib/db/schema";
import { createPresignedDownloadUrl } from "@/lib/storage/functions";

const CreateShareLinkInput = z.object({
	folderId: z.uuid(),
	expiresAt: z.coerce.date().nullable().optional(),
});

const ShareWithUserInput = z.object({
	folderId: z.uuid(),
	identifier: z.string(),
});

const RevokeShareInput = z.object({
	folderId: z.uuid(),
	userId: z.string().min(1),
});

const FolderIdInput = z.object({
	folderId: z.uuid(),
});

const LinkIdInput = z.object({
	linkId: z.uuid(),
});

const DeleteShareLinkInput = z.object({
	id: z.uuid(),
});

const GetSharedFolderContentsInput = z.object({
	folderId: z.uuid(),
	accessType: z.enum(["link", "user"]),
	linkId: z.uuid().optional(),
});

export const createShareLink = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(CreateShareLinkInput)
	.handler(async ({ data, context }) => {
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!f) throw new Error("Folder not found or access denied");

		const expiryDate =
			data.expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		const link = await db
			.insert(shareLink)
			.values({
				id: crypto.randomUUID(),
				folderId: data.folderId,
				createdBy: context.user.id,
				expiresAt: expiryDate,
			})
			.returning();

		return link[0];
	});

// TODO: Not currently used
export const getShareLinks = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!f) throw new Error("Folder not found");

		// Only return non-expired links (null expiresAt = never expires)
		return db.query.shareLink.findMany({
			where: and(
				eq(shareLink.folderId, data.folderId),
				or(isNull(shareLink.expiresAt), gt(shareLink.expiresAt, new Date())),
			),
			orderBy: (sl, { desc }) => [desc(sl.createdAt)],
		});
	});

// TODO: Not currently used
export const deleteShareLink = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(DeleteShareLinkInput)
	.handler(async ({ data, context }) => {
		const link = await db.query.shareLink.findFirst({
			where: eq(shareLink.id, data.id),
			with: { folder: true },
		});

		if (!link || link.folder.userId !== context.user.id) {
			throw new Error("Share link not found or access denied");
		}

		await db.delete(shareLink).where(eq(shareLink.id, data.id));

		return { success: true };
	});

export const shareWithUser = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(ShareWithUserInput)
	.handler(async ({ data, context }) => {
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!f) throw new Error("Folder not found or access denied");

		const targetUser = await db.query.user.findFirst({
			where: or(
				eq(user.email, data.identifier),
				eq(user.username, data.identifier),
			),
		});

		if (!targetUser) throw new Error("User not found");
		if (targetUser.id === context.user.id)
			throw new Error("Cannot share with yourself");

		const existing = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, data.folderId),
				eq(userShare.sharedWithUserId, targetUser.id),
			),
		});

		if (existing) {
			// If cancelled, re-invite by setting back to pending
			if (existing.status === "cancelled") {
				await db
					.update(userShare)
					.set({ status: "pending", sharedByUserId: context.user.id })
					.where(
						and(
							eq(userShare.folderId, data.folderId),
							eq(userShare.sharedWithUserId, targetUser.id),
						),
					);
				return { success: true, sharedWithName: targetUser.name };
			}
			// Already pending or accepted
			throw new Error("Already shared with this user");
		}

		// Create new pending invitation
		await db.insert(userShare).values({
			folderId: data.folderId,
			sharedWithUserId: targetUser.id,
			sharedByUserId: context.user.id,
			status: "pending",
		});

		return { success: true, sharedWithName: targetUser.name };
	});

export const getSharedUsers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});
		if (!f) throw new Error("Folder not found");

		return db.query.userShare.findMany({
			where: eq(userShare.folderId, data.folderId),
			columns: {
				status: true,
			},
			with: {
				sharedWith: {
					columns: { id: true, name: true, email: true, image: true },
				},
			},
		});
	});

// TODO: Not currently used
export const revokeUserShare = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(RevokeShareInput)
	.handler(async ({ data, context }) => {
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});
		if (!f) throw new Error("Folder not found or access denied");

		// Get all descendant folder IDs (including the shared folder)
		const allFolderIds = await getAllDescendantFolderIds(data.folderId);

		// Delete the share entry
		await db
			.delete(userShare)
			.where(
				and(
					eq(userShare.folderId, data.folderId),
					eq(userShare.sharedWithUserId, data.userId),
				),
			);

		// Remove favourites for the folder and all its descendants
		if (allFolderIds.length > 0) {
			await db
				.delete(favouriteFolder)
				.where(
					and(
						inArray(favouriteFolder.folderId, allFolderIds),
						eq(favouriteFolder.userId, data.userId),
					),
				);
		}

		return { success: true };
	});

export const getSharedWithMe = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const shares = await db.query.userShare.findMany({
			where: and(
				eq(userShare.sharedWithUserId, context.user.id),
				eq(userShare.status, "accepted"),
			),
			with: {
				folder: {
					with: {
						owner: { columns: { id: true, name: true, image: true } },
					},
				},
				sharedBy: { columns: { id: true, name: true } },
			},
		});

		if (shares.length === 0) {
			return [];
		}

		const folderIds = shares.map((s) => s.folderId);

		// Get all image counts in a single query
		const imageCounts = await db
			.select({
				folderId: folderImage.folderId,
				count: count(),
			})
			.from(folderImage)
			.where(inArray(folderImage.folderId, folderIds))
			.groupBy(folderImage.folderId);

		// Get all favourites for these folders
		const favourites = await db.query.favouriteFolder.findMany({
			where: and(
				eq(favouriteFolder.userId, context.user.id),
				inArray(favouriteFolder.folderId, folderIds),
			),
			columns: { folderId: true },
		});

		// Create maps for quick lookup
		const countMap = new Map(imageCounts.map((ic) => [ic.folderId, ic.count]));
		const favouriteSet = new Set(favourites.map((f) => f.folderId));

		return shares.map((s) => ({
			folder: {
				...s.folder,
				imageCount: countMap.get(s.folderId) ?? 0,
				isFavourited: favouriteSet.has(s.folderId),
			},
			sharedBy: s.sharedBy,
			sharedAt: s.createdAt,
		}));
	});

// TODO: Not currently used
export const accessSharedLink = createServerFn({ method: "GET" })
	.inputValidator(LinkIdInput)
	.handler(async ({ data }) => {
		const link = await db.query.shareLink.findFirst({
			where: and(
				eq(shareLink.id, data.linkId),
				or(isNull(shareLink.expiresAt), gt(shareLink.expiresAt, new Date())),
			),
			with: {
				folder: {
					with: {
						owner: { columns: { id: true, name: true, image: true } },
					},
				},
			},
		});

		if (!link) throw new Error("Share link not found or expired");

		return {
			folder: link.folder,
			expiresAt: link.expiresAt,
		};
	});

export const acceptShareLinkInvite = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(LinkIdInput)
	.handler(async ({ data, context }) => {
		// Validate the share link
		const link = await db.query.shareLink.findFirst({
			where: and(
				eq(shareLink.id, data.linkId),
				or(isNull(shareLink.expiresAt), gt(shareLink.expiresAt, new Date())),
			),
			with: {
				folder: true,
			},
		});

		if (!link) throw new Error("Share link not found or expired");

		// Can't accept invite to your own folder
		if (link.folder.userId === context.user.id) {
			throw new Error("You cannot accept an invite to your own folder");
		}

		// Check if already shared with this user
		const existing = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, link.folderId),
				eq(userShare.sharedWithUserId, context.user.id),
			),
		});

		if (existing) {
			// If cancelled or pending, update to accepted
			if (existing.status !== "accepted") {
				await db
					.update(userShare)
					.set({ status: "accepted" })
					.where(
						and(
							eq(userShare.folderId, link.folderId),
							eq(userShare.sharedWithUserId, context.user.id),
						),
					);
				return { folderId: link.folderId, alreadyAccepted: false };
			}
			// Already accepted
			return { folderId: link.folderId, alreadyAccepted: true };
		}

		// Create the user share entry with accepted status
		await db.insert(userShare).values({
			folderId: link.folderId,
			sharedWithUserId: context.user.id,
			sharedByUserId: link.createdBy,
			status: "accepted",
		});

		return { folderId: link.folderId, alreadyAccepted: false };
	});

// TODO: Not currently used
export const getSharedFolderContents = createServerFn({ method: "GET" })
	.inputValidator(GetSharedFolderContentsInput)
	.handler(async ({ data }) => {
		let rootFolderId: string;

		if (data.accessType === "link" && data.linkId) {
			const link = await db.query.shareLink.findFirst({
				where: and(
					eq(shareLink.id, data.linkId),
					or(isNull(shareLink.expiresAt), gt(shareLink.expiresAt, new Date())),
				),
			});

			if (!link) throw new Error("Invalid or expired link");

			rootFolderId = link.folderId;
		} else {
			throw new Error("User-based access should use authenticated endpoint");
		}

		const isDescendant = await verifyFolderInHierarchy(
			data.folderId,
			rootFolderId,
		);

		if (!isDescendant && data.folderId !== rootFolderId) {
			throw new Error("Access denied");
		}

		const f = await db.query.folder.findFirst({
			where: eq(folder.id, data.folderId),
			with: {
				children: true,
			},
		});

		return f;
	});

async function verifyFolderInHierarchy(
	targetFolderId: string,
	rootFolderId: string,
): Promise<boolean> {
	let currentId: string | null = targetFolderId;

	while (currentId) {
		if (currentId === rootFolderId) return true;

		const f: { parentId: string | null } | undefined =
			await db.query.folder.findFirst({
				where: eq(folder.id, currentId),
				columns: { parentId: true },
			});

		currentId = f?.parentId ?? null;
	}

	return false;
}

export const getSharedFolderContentsAuth = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const hasAccess = await checkUserShareAccess(
			data.folderId,
			context.user.id,
		);

		if (!hasAccess) throw new Error("Access denied");

		const f = await db.query.folder.findFirst({
			where: eq(folder.id, data.folderId),
			with: {
				children: true,
				owner: { columns: { id: true, name: true, image: true } },
			},
		});

		if (!f) return null;

		// Get favourite status for all children
		const childIds = f.children.map((c) => c.id);
		const favourites =
			childIds.length > 0
				? await db.query.favouriteFolder.findMany({
						where: and(
							eq(favouriteFolder.userId, context.user.id),
							inArray(favouriteFolder.folderId, childIds),
						),
						columns: { folderId: true },
					})
				: [];

		const favouriteSet = new Set(favourites.map((fav) => fav.folderId));

		return {
			...f,
			children: f.children.map((child) => ({
				...child,
				isFavourited: favouriteSet.has(child.id),
			})),
		};
	});

export const getSharedFolderPath = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		// First verify user has access to this folder
		const hasAccess = await checkUserShareAccess(
			data.folderId,
			context.user.id,
		);

		if (!hasAccess) throw new Error("Access denied");

		// Find the root shared folder (where the share entry exists)
		const rootShareFolderId = await findRootSharedFolder(
			data.folderId,
			context.user.id,
		);

		// Build path from root shared folder to current folder
		const path: Array<{ id: string; name: string }> = [];
		let currentId: string | null = data.folderId;

		while (currentId) {
			const f:
				| { id: string; name: string; parentId: string | null }
				| undefined = await db.query.folder.findFirst({
				where: eq(folder.id, currentId),
				columns: { id: true, name: true, parentId: true },
			});

			if (!f) break;

			path.unshift({ id: f.id, name: f.name });

			// Stop when we reach the root shared folder
			if (f.id === rootShareFolderId) break;

			currentId = f.parentId;
		}

		return path;
	});

async function findRootSharedFolder(
	folderId: string,
	userId: string,
): Promise<string> {
	let currentId: string | null = folderId;
	let rootId = folderId;

	while (currentId) {
		const share = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, currentId),
				eq(userShare.sharedWithUserId, userId),
				eq(userShare.status, "accepted"),
			),
		});

		if (share) {
			rootId = currentId;
		}

		const f: { parentId: string | null } | undefined =
			await db.query.folder.findFirst({
				where: eq(folder.id, currentId),
				columns: { parentId: true },
			});

		currentId = f?.parentId ?? null;
	}

	return rootId;
}

async function checkUserShareAccess(
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

export const getSharedFolderImages = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const hasAccess = await checkUserShareAccess(
			data.folderId,
			context.user.id,
		);

		if (!hasAccess) throw new Error("Access denied");

		const results = await db.query.folderImage.findMany({
			where: eq(folderImage.folderId, data.folderId),
			with: { image: true },
			orderBy: (fi, { desc }) => [desc(fi.addedAt)],
		});

		// Generate presigned URLs for all images in parallel
		const imagesWithUrls = await Promise.all(
			results.map(async (r) => ({
				...r.image,
				addedAt: r.addedAt,
				imageUrl: await createPresignedDownloadUrl(r.image.storageKey),
			})),
		);

		return imagesWithUrls;
	});

const GetLinkSharedImagesInput = z.object({
	folderId: z.uuid(),
	linkId: z.uuid(),
});

export const getLinkSharedFolderImages = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(GetLinkSharedImagesInput)
	.handler(async ({ data }) => {
		// Verify link is valid and not expired
		const link = await db.query.shareLink.findFirst({
			where: and(
				eq(shareLink.id, data.linkId),
				or(isNull(shareLink.expiresAt), gt(shareLink.expiresAt, new Date())),
			),
		});

		if (!link) throw new Error("Invalid or expired link");

		// Verify folder is within shared hierarchy
		const isDescendant = await verifyFolderInHierarchy(
			data.folderId,
			link.folderId,
		);

		if (!isDescendant && data.folderId !== link.folderId) {
			throw new Error("Access denied");
		}

		const results = await db.query.folderImage.findMany({
			where: eq(folderImage.folderId, data.folderId),
			with: { image: true },
			orderBy: (fi, { desc }) => [desc(fi.addedAt)],
		});

		// Generate presigned URLs for all images in parallel
		const imagesWithUrls = await Promise.all(
			results.map(async (r) => ({
				...r.image,
				addedAt: r.addedAt,
				imageUrl: await createPresignedDownloadUrl(r.image.storageKey),
			})),
		);

		return imagesWithUrls;
	});

// Get details of a specific pending invitation
export const getInvitationDetails = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const invitation = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, data.folderId),
				eq(userShare.sharedWithUserId, context.user.id),
				eq(userShare.status, "pending"),
			),
			with: {
				folder: {
					with: {
						owner: { columns: { id: true, name: true, image: true } },
					},
				},
				sharedBy: { columns: { id: true, name: true, image: true } },
			},
		});

		if (!invitation) {
			throw new Error("Invitation not found or already accepted");
		}

		return {
			folder: invitation.folder,
			sharedBy: invitation.sharedBy,
			invitedAt: invitation.createdAt,
		};
	});

// Get pending invitations for the current user
export const getPendingInvitations = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const invitations = await db.query.userShare.findMany({
			where: and(
				eq(userShare.sharedWithUserId, context.user.id),
				eq(userShare.status, "pending"),
			),
			with: {
				folder: {
					columns: { id: true, name: true, color: true, emoji: true },
					with: {
						owner: { columns: { id: true, name: true, image: true } },
					},
				},
				sharedBy: { columns: { id: true, name: true, image: true } },
			},
			orderBy: (us, { desc }) => [desc(us.createdAt)],
		});

		return invitations.map((inv) => ({
			folder: inv.folder,
			sharedBy: inv.sharedBy,
			invitedAt: inv.createdAt,
		}));
	});

// Accept a pending invitation
export const acceptInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const invitation = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, data.folderId),
				eq(userShare.sharedWithUserId, context.user.id),
				eq(userShare.status, "pending"),
			),
		});

		if (!invitation) {
			throw new Error("Invitation not found");
		}

		await db
			.update(userShare)
			.set({ status: "accepted" })
			.where(
				and(
					eq(userShare.folderId, data.folderId),
					eq(userShare.sharedWithUserId, context.user.id),
				),
			);

		return { success: true };
	});

// Cancel (permanently reject) a pending invitation
export const cancelInvitation = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		const invitation = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, data.folderId),
				eq(userShare.sharedWithUserId, context.user.id),
				eq(userShare.status, "pending"),
			),
		});

		if (!invitation) {
			throw new Error("Invitation not found");
		}

		await db
			.update(userShare)
			.set({ status: "cancelled" })
			.where(
				and(
					eq(userShare.folderId, data.folderId),
					eq(userShare.sharedWithUserId, context.user.id),
				),
			);

		return { success: true };
	});

// Remove yourself from a shared folder (leave/unshare)
export const removeFromShared = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		// Verify the share exists for this user
		const share = await db.query.userShare.findFirst({
			where: and(
				eq(userShare.folderId, data.folderId),
				eq(userShare.sharedWithUserId, context.user.id),
			),
		});

		if (!share) {
			throw new Error("Share not found");
		}

		// Get all descendant folder IDs (including the root folder)
		const allFolderIds = await getAllDescendantFolderIds(data.folderId);

		// Delete the share entry
		await db
			.delete(userShare)
			.where(
				and(
					eq(userShare.folderId, data.folderId),
					eq(userShare.sharedWithUserId, context.user.id),
				),
			);

		// Remove favorites for the folder and all its descendants
		if (allFolderIds.length > 0) {
			await db
				.delete(favouriteFolder)
				.where(
					and(
						inArray(favouriteFolder.folderId, allFolderIds),
						eq(favouriteFolder.userId, context.user.id),
					),
				);
		}

		return { success: true };
	});

// Helper to get all descendant folder IDs (including the root folder itself)
async function getAllDescendantFolderIds(
	rootFolderId: string,
): Promise<string[]> {
	const result: string[] = [rootFolderId];
	const queue: string[] = [rootFolderId];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (!currentId) break;

		const children = await db.query.folder.findMany({
			where: eq(folder.parentId, currentId),
			columns: { id: true },
		});

		for (const child of children) {
			result.push(child.id);
			queue.push(child.id);
		}
	}

	return result;
}

// Clone a shared folder and all its contents to user's own folders
export const cloneSharedFolder = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(FolderIdInput)
	.handler(async ({ data, context }) => {
		// 1. Verify access to the shared folder
		const hasAccess = await checkUserShareAccess(
			data.folderId,
			context.user.id,
		);
		if (!hasAccess) throw new Error("Access denied");

		// 2. Get source folder
		const sourceFolder = await db.query.folder.findFirst({
			where: eq(folder.id, data.folderId),
		});
		if (!sourceFolder) throw new Error("Folder not found");

		// 3. Get all descendant folder IDs
		const allDescendantIds = await getAllDescendantFolderIds(data.folderId);

		// 4. Get all folders in hierarchy
		const allFolders = await db.query.folder.findMany({
			where: inArray(folder.id, allDescendantIds),
		});

		// 5. Get all folder-image relationships
		const allFolderImages = await db.query.folderImage.findMany({
			where: inArray(folderImage.folderId, allDescendantIds),
		});

		// 6. Create ID mapping (old ID -> new ID)
		const idMap = new Map<string, string>();
		for (const f of allFolders) {
			idMap.set(f.id, crypto.randomUUID());
		}

		// 7. Sort folders by depth to ensure parents exist before children
		// Build a depth map by traversing from root
		const depthMap = new Map<string, number>();
		depthMap.set(data.folderId, 0);

		const queue = [data.folderId];
		while (queue.length > 0) {
			const currentId = queue.shift();
			if (!currentId) break;
			const currentDepth = depthMap.get(currentId) ?? 0;

			for (const f of allFolders) {
				if (f.parentId === currentId && !depthMap.has(f.id)) {
					depthMap.set(f.id, currentDepth + 1);
					queue.push(f.id);
				}
			}
		}

		const sortedFolders = [...allFolders].sort((a, b) => {
			const depthA = depthMap.get(a.id) ?? 0;
			const depthB = depthMap.get(b.id) ?? 0;
			return depthA - depthB;
		});

		// 8. Insert new folders
		for (const f of sortedFolders) {
			const newId = idMap.get(f.id);
			if (!newId) continue;

			const newParentId =
				f.id === data.folderId
					? null // Root of clone goes to top level
					: idMap.get(f.parentId ?? "");

			await db.insert(folder).values({
				id: newId,
				name: f.name,
				color: f.color,
				emoji: f.emoji,
				userId: context.user.id,
				parentId: newParentId ?? null,
			});
		}

		// 9. Insert new folder-image relationships
		for (const fi of allFolderImages) {
			const newFolderId = idMap.get(fi.folderId);
			if (newFolderId) {
				await db.insert(folderImage).values({
					folderId: newFolderId,
					imageId: fi.imageId,
				});
			}
		}

		// 10. Return the new root folder ID
		return {
			success: true,
			newFolderId: idMap.get(data.folderId),
			folderName: sourceFolder.name,
		};
	});
