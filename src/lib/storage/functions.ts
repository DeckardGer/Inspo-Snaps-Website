import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { uploadRateLimitMiddleware } from "@/lib/rate-limit/middleware";
import {
	createPresignedDownloadUrl,
	createPresignedUploadUrl,
	deleteStorageObject,
	deleteStorageObjects,
} from "@/lib/storage/s3";
import { writeAccessMiddleware } from "@/lib/subscriptions/middleware";

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

export const getUploadUrl = createServerFn({ method: "POST" })
	.middleware([writeAccessMiddleware, uploadRateLimitMiddleware])
	.inputValidator(GetUploadUrlInput)
	.handler(async ({ data, context }) => {
		const storageKey = generateStorageKey(context.user.id, data.filename);
		const uploadUrl = await createPresignedUploadUrl(
			storageKey,
			data.contentType,
		);

		return { uploadUrl, storageKey };
	});

export const getDownloadUrl = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(GetDownloadUrlInput)
	.handler(async ({ data }) => {
		const downloadUrl = await createPresignedDownloadUrl(data.storageKey);

		return { downloadUrl };
	});

// Re-export for use in other server functions
export {
	createPresignedDownloadUrl,
	deleteStorageObject,
	deleteStorageObjects,
};
