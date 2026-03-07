import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { folder, folderImage, image, member } from "@/lib/db/schema";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/images/constants";
import { uploadRateLimitMiddleware } from "@/lib/rate-limit/middleware";
import {
	createPresignedDownloadUrl,
	deleteStorageObject,
} from "@/lib/storage/functions";
import { writeAccessMiddleware } from "@/lib/subscriptions/middleware";

const SaveImageInput = z.object({
	filename: z.string(),
	storageKey: z.string(),
	mimeType: z.string(),
	sizeBytes: z.number().int().positive().max(MAX_IMAGE_SIZE_BYTES),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	originUrl: z.url().optional(),
	folderId: z.uuid(),
});

const AddToFolderInput = z.object({
	imageId: z.uuid(),
	folderId: z.uuid(),
});

const RemoveFromFolderInput = z.object({
	imageId: z.uuid(),
	folderId: z.uuid(),
});

const ImageIdInput = z.object({
	id: z.uuid(),
});

const FolderIdInput = z.object({
	folderId: z.uuid(),
});

export const saveImage = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware, uploadRateLimitMiddleware])
	.inputValidator(SaveImageInput)
	.handler(async ({ data, context }) => {
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!targetFolder) throw new Error("Folder not found or access denied");

		const newImage = await db
			.insert(image)
			.values({
				id: crypto.randomUUID(),
				filename: data.filename,
				storageKey: data.storageKey,
				mimeType: data.mimeType,
				sizeBytes: data.sizeBytes,
				width: data.width ?? null,
				height: data.height ?? null,
				originUrl: data.originUrl ?? null,
				userId: context.user.id,
			})
			.returning();

		await db.insert(folderImage).values({
			folderId: data.folderId,
			imageId: newImage[0].id,
		});

		return newImage[0];
	});

export const addImageToFolder = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(AddToFolderInput)
	.handler(async ({ data, context }) => {
		const img = await db.query.image.findFirst({
			where: and(eq(image.id, data.imageId), eq(image.userId, context.user.id)),
		});

		if (!img) throw new Error("Image not found");

		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!targetFolder) throw new Error("Folder not found");

		const existing = await db.query.folderImage.findFirst({
			where: and(
				eq(folderImage.folderId, data.folderId),
				eq(folderImage.imageId, data.imageId),
			),
		});

		if (existing) throw new Error("Image already in folder");

		await db.insert(folderImage).values({
			folderId: data.folderId,
			imageId: data.imageId,
		});

		return { success: true };
	});

export const removeImageFromFolder = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(RemoveFromFolderInput)
	.handler(async ({ data, context }) => {
		// Check if user owns the folder
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.userId, context.user.id),
			),
		});

		if (!targetFolder) throw new Error("Folder not found or access denied");

		// Verify the image exists in this folder
		const folderImageEntry = await db.query.folderImage.findFirst({
			where: and(
				eq(folderImage.folderId, data.folderId),
				eq(folderImage.imageId, data.imageId),
			),
			with: { image: true },
		});

		if (!folderImageEntry) throw new Error("Image not found in folder");

		// Remove the folder-image relationship
		await db
			.delete(folderImage)
			.where(
				and(
					eq(folderImage.folderId, data.folderId),
					eq(folderImage.imageId, data.imageId),
				),
			);

		// Delete the image if no other folders reference it
		const remaining = await db.query.folderImage.findFirst({
			where: eq(folderImage.imageId, data.imageId),
		});

		if (!remaining) {
			const img = folderImageEntry.image;
			await db.delete(image).where(eq(image.id, data.imageId));
			await deleteStorageObject(img.storageKey);
			return { deleted: true };
		}

		return { deleted: false };
	});

export const getImage = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(ImageIdInput)
	.handler(async ({ data, context }) => {
		const img = await db.query.image.findFirst({
			where: and(eq(image.id, data.id), eq(image.userId, context.user.id)),
		});

		if (!img) throw new Error("Image not found");

		return img;
	});

export const getFolderImages = createServerFn({ method: "GET" })
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

// Team folder image functions

const SaveTeamImageInput = z.object({
	filename: z.string(),
	storageKey: z.string(),
	mimeType: z.string(),
	sizeBytes: z.number().int().positive().max(MAX_IMAGE_SIZE_BYTES),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	originUrl: z.url().optional(),
	folderId: z.uuid(),
	organizationId: z.string(),
});

const TeamFolderImageInput = z.object({
	folderId: z.uuid(),
	organizationId: z.string(),
});

const RemoveTeamImageInput = z.object({
	imageId: z.uuid(),
	folderId: z.uuid(),
	organizationId: z.string(),
});

export const saveTeamImage = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware, uploadRateLimitMiddleware])
	.inputValidator(SaveTeamImageInput)
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

		const hasTeamWriteAccess =
			membership.role !== "viewer" &&
			context.session.canWrite &&
			context.session.plan !== "pro";

		if (!hasTeamWriteAccess) {
			throw new Error("You don't have permission to add images in this team");
		}

		// Verify folder belongs to the organization
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.organizationId, data.organizationId),
			),
		});

		if (!targetFolder) throw new Error("Folder not found or access denied");

		const newImage = await db
			.insert(image)
			.values({
				id: crypto.randomUUID(),
				filename: data.filename,
				storageKey: data.storageKey,
				mimeType: data.mimeType,
				sizeBytes: data.sizeBytes,
				width: data.width ?? null,
				height: data.height ?? null,
				originUrl: data.originUrl ?? null,
				userId: context.user.id,
			})
			.returning();

		await db.insert(folderImage).values({
			folderId: data.folderId,
			imageId: newImage[0].id,
		});

		return newImage[0];
	});

export const getTeamFolderImages = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(TeamFolderImageInput)
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

		// Verify folder belongs to the organization
		const f = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.organizationId, data.organizationId),
			),
		});

		if (!f) throw new Error("Folder not found");

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

export const removeTeamImageFromFolder = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware])
	.inputValidator(RemoveTeamImageInput)
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

		const hasTeamWriteAccess =
			membership.role !== "viewer" &&
			context.session.canWrite &&
			context.session.plan !== "pro";

		if (!hasTeamWriteAccess) {
			throw new Error("You don't have permission to remove images in this team");
		}

		// Verify folder belongs to the organization
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, data.folderId),
				eq(folder.organizationId, data.organizationId),
			),
		});

		if (!targetFolder) throw new Error("Folder not found or access denied");

		// Verify the image exists in this folder
		const folderImageEntry = await db.query.folderImage.findFirst({
			where: and(
				eq(folderImage.folderId, data.folderId),
				eq(folderImage.imageId, data.imageId),
			),
			with: { image: true },
		});

		if (!folderImageEntry) throw new Error("Image not found in folder");

		// Remove the folder-image relationship
		await db
			.delete(folderImage)
			.where(
				and(
					eq(folderImage.folderId, data.folderId),
					eq(folderImage.imageId, data.imageId),
				),
			);

		// Delete the image if no other folders reference it
		const remaining = await db.query.folderImage.findFirst({
			where: eq(folderImage.imageId, data.imageId),
		});

		if (!remaining) {
			const img = folderImageEntry.image;
			await db.delete(image).where(eq(image.id, data.imageId));
			await deleteStorageObject(img.storageKey);
			return { deleted: true };
		}

		return { deleted: false };
	});
