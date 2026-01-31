import { createFileRoute } from "@tanstack/react-router";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { folder, folderImage, image } from "@/lib/db/schema";
import {
	ALLOWED_IMAGE_MIME_TYPES,
	MAX_IMAGE_SIZE_BYTES,
} from "@/lib/images/constants";
import { generateStorageKey } from "@/lib/storage/functions";
import {
	createPresignedDownloadUrl,
	createPresignedUploadUrl,
} from "@/lib/storage/s3";

const UploadUrlsSchema = z.object({
	images: z
		.array(
			z.object({
				filename: z.string().min(1),
				contentType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
			}),
		)
		.min(1)
		.max(50),
});

const SaveImagesSchema = z.object({
	folderId: z.uuid().nullable(),
	images: z
		.array(
			z.object({
				filename: z.string().min(1),
				storageKey: z.string().min(1),
				mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
				sizeBytes: z.number().int().positive().max(MAX_IMAGE_SIZE_BYTES),
				width: z.number().int().positive().optional(),
				height: z.number().int().positive().optional(),
				originUrl: z.url().optional(),
			}),
		)
		.min(1)
		.max(50),
});

export const Route = createFileRoute("/api/extension/images")({
	server: {
		handlers: {
			// POST with ?action=upload-urls or ?action=save
			POST: async ({ request }) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});

				if (!session?.user) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const url = new URL(request.url);
				const action = url.searchParams.get("action");

				if (action === "upload-urls") {
					return handleUploadUrls(request, session.user.id);
				}

				if (action === "save") {
					return handleSaveImages(request, session.user.id);
				}

				return Response.json(
					{ error: "Invalid action. Use ?action=upload-urls or ?action=save" },
					{ status: 400 },
				);
			},
		},
	},
});

async function handleUploadUrls(request: Request, userId: string) {
	const body = await request.json();
	const parsed = UploadUrlsSchema.safeParse(body);

	if (!parsed.success) {
		return Response.json(
			{ error: "Invalid input", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const results = await Promise.all(
		parsed.data.images.map(async (img) => {
			const storageKey = generateStorageKey(userId, img.filename);
			const uploadUrl = await createPresignedUploadUrl(
				storageKey,
				img.contentType,
			);
			return { uploadUrl, storageKey, filename: img.filename };
		}),
	);

	return Response.json({ images: results });
}

async function handleSaveImages(request: Request, userId: string) {
	const body = await request.json();
	const parsed = SaveImagesSchema.safeParse(body);

	if (!parsed.success) {
		return Response.json(
			{ error: "Invalid input", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { folderId, images: imageInputs } = parsed.data;

	// Verify user owns the folder (personal folders only)
	if (folderId) {
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, folderId),
				eq(folder.userId, userId),
				isNull(folder.organizationId),
			),
		});

		if (!targetFolder) {
			return Response.json({ error: "Folder not found" }, { status: 404 });
		}
	}

	// Verify all storage keys belong to this user
	const invalidKey = imageInputs.find(
		(img) => !img.storageKey.startsWith(`${userId}/`),
	);
	if (invalidKey) {
		return Response.json({ error: "Invalid storage key" }, { status: 403 });
	}

	// Insert all images and optionally link to folder
	const savedImages = [];

	for (const img of imageInputs) {
		const newImage = await db
			.insert(image)
			.values({
				id: crypto.randomUUID(),
				filename: img.filename,
				storageKey: img.storageKey,
				mimeType: img.mimeType,
				sizeBytes: img.sizeBytes,
				width: img.width ?? null,
				height: img.height ?? null,
				originUrl: img.originUrl ?? null,
				userId,
			})
			.returning();

		if (folderId) {
			await db.insert(folderImage).values({
				folderId,
				imageId: newImage[0].id,
			});
		}

		const src = await createPresignedDownloadUrl(newImage[0].storageKey);

		savedImages.push({
			id: newImage[0].id,
			folderId,
			src,
			createdAt: newImage[0].createdAt.getTime(),
		});
	}

	return Response.json({ images: savedImages });
}
