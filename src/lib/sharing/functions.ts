import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { folder, shareLink, user, userShare } from "@/lib/db/schema";

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
	userId: z.uuid(),
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

		return db.query.shareLink.findMany({
			where: eq(shareLink.folderId, data.folderId),
			orderBy: (sl, { desc }) => [desc(sl.createdAt)],
		});
	});

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

		if (existing) throw new Error("Already shared with this user");

		await db.insert(userShare).values({
			folderId: data.folderId,
			sharedWithUserId: targetUser.id,
			sharedByUserId: context.user.id,
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
			with: {
				sharedWith: {
					columns: { id: true, name: true, email: true, image: true },
				},
			},
		});
	});

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

		await db
			.delete(userShare)
			.where(
				and(
					eq(userShare.folderId, data.folderId),
					eq(userShare.sharedWithUserId, data.userId),
				),
			);

		return { success: true };
	});

export const getSharedWithMe = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const shares = await db.query.userShare.findMany({
			where: eq(userShare.sharedWithUserId, context.user.id),
			with: {
				folder: {
					with: {
						owner: { columns: { id: true, name: true, image: true } },
					},
				},
				sharedBy: { columns: { id: true, name: true } },
			},
		});

		return shares.map((s) => ({
			folder: s.folder,
			sharedBy: s.sharedBy,
			sharedAt: s.createdAt,
		}));
	});

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

		return f;
	});

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
