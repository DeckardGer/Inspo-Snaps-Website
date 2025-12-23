import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { folder, folderImage, image } from "@/lib/db/schema";
import {
	createPresignedDownloadUrl,
	deleteStorageObject,
} from "@/lib/storage/functions";

const SaveImageInput = z.object({
	filename: z.string(),
	storageKey: z.string(),
	mimeType: z.string(),
	sizeBytes: z.number().int().positive(),
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
	.middleware([authMiddleware])
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
	.middleware([authMiddleware])
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
	.middleware([authMiddleware])
	.inputValidator(RemoveFromFolderInput)
	.handler(async ({ data, context }) => {
		const img = await db.query.image.findFirst({
			where: and(eq(image.id, data.imageId), eq(image.userId, context.user.id)),
		});

		if (!img) throw new Error("Image not found");

		await db
			.delete(folderImage)
			.where(
				and(
					eq(folderImage.folderId, data.folderId),
					eq(folderImage.imageId, data.imageId),
				),
			);

		const remaining = await db.query.folderImage.findFirst({
			where: eq(folderImage.imageId, data.imageId),
		});

		if (!remaining) {
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
