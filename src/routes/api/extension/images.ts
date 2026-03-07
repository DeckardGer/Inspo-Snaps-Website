import { createFileRoute } from "@tanstack/react-router";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import type { AppSession, AppUser } from "@/lib/auth/types";
import { db } from "@/lib/db";
import { folder, folderImage, image } from "@/lib/db/schema";
import {
	ALLOWED_IMAGE_MIME_TYPES,
	MAX_IMAGE_SIZE_BYTES,
} from "@/lib/images/constants";
import { generateStorageKey } from "@/lib/storage/functions";
import {
	requireTeamWriteAccess,
} from "@/lib/organizations/authorization";
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
	folderId: z.uuid(),
	organizationId: z.string().nullable().optional(),
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

				const ctx = {
					user: session.user as AppUser,
					session: session.session as AppSession,
				};

				const url = new URL(request.url);
				const action = url.searchParams.get("action");

				if (action === "upload-urls") {
					return handleUploadUrls(request, session.user.id);
				}

				if (action === "save") {
					return handleSaveImages(request, session.user.id, ctx);
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

async function handleSaveImages(
	request: Request,
	userId: string,
	ctx: { user: AppUser; session: AppSession },
) {
	const body = await request.json();
	const parsed = SaveImagesSchema.safeParse(body);

	if (!parsed.success) {
		return Response.json(
			{ error: "Invalid input", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const { folderId, images: imageInputs } = parsed.data;
	const organizationId =
		parsed.data.organizationId ||
		new URL(request.url).searchParams.get("organizationId") ||
		null;

	if (organizationId) {
		try {
			await requireTeamWriteAccess(organizationId, ctx);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Insufficient permissions";
			const status = message.includes("not a member") ? 404 : 403;
			return Response.json({ error: message }, { status });
		}

		// Verify folder belongs to this organization
		const targetFolder = await db.query.folder.findFirst({
			where: and(
				eq(folder.id, folderId),
				eq(folder.organizationId, organizationId),
			),
		});

		if (!targetFolder) {
			return Response.json({ error: "Folder not found" }, { status: 404 });
		}
	} else {
		// Personal folder — verify user owns it
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

	// Insert all images and link to folder
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

		await db.insert(folderImage).values({
			folderId,
			imageId: newImage[0].id,
		});

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
