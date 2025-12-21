import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { bucketName, s3Client } from "@/lib/storage/s3-client";

const GetUploadUrlInput = z.object({
	filename: z.string(),
	contentType: z.string(),
});

const GetDownloadUrlInput = z.object({
	storageKey: z.string(),
});

export function generateStorageKey(userId: string, filename: string): string {
	const ext = filename.split(".").pop() || "";
	const uuid = crypto.randomUUID();

	return `${userId}/${uuid}${ext ? `.${ext}` : ""}`;
}

// TODO: Not currently used
export const getUploadUrl = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(GetUploadUrlInput)
	.handler(async ({ data, context }) => {
		const storageKey = generateStorageKey(context.user.id, data.filename);

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: storageKey,
			ContentType: data.contentType,
		});

		const uploadUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		return { uploadUrl, storageKey };
	});

// TODO: Not currently used
export const getDownloadUrl = createServerFn({ method: "POST" })
	.inputValidator(GetDownloadUrlInput)
	.handler(async ({ data }) => {
		const command = new GetObjectCommand({
			Bucket: bucketName,
			Key: data.storageKey,
		});

		const downloadUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		return { downloadUrl };
	});

export async function deleteStorageObject(storageKey: string): Promise<void> {
	const command = new DeleteObjectCommand({
		Bucket: bucketName,
		Key: storageKey,
	});

	await s3Client.send(command);
}

export async function deleteStorageObjects(
	storageKeys: string[],
): Promise<void> {
	if (storageKeys.length === 0) return;

	const chunks: string[][] = [];
	for (let i = 0; i < storageKeys.length; i += 1000) {
		chunks.push(storageKeys.slice(i, i + 1000));
	}

	for (const chunk of chunks) {
		const command = new DeleteObjectsCommand({
			Bucket: bucketName,
			Delete: {
				Objects: chunk.map((key) => ({ Key: key })),
			},
		});

		await s3Client.send(command);
	}
}
