import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
	trackFirstImageUploaded,
	trackImageUploadFailed,
	trackWriteAccessBlocked,
} from "@/lib/analytics/capture";
import {
	ALLOWED_IMAGE_MIME_TYPES,
	type AllowedImageMimeType,
	MAX_IMAGE_SIZE_BYTES,
} from "@/lib/images/constants";
import { saveImage } from "@/lib/images/functions";
import { getImageDimensions } from "@/lib/images/utils";
import { getUploadUrl } from "@/lib/storage/functions";

interface ValidationResult {
	valid: boolean;
	error?: string;
}

export function validateFile(file: File): ValidationResult {
	if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as AllowedImageMimeType)) {
		return {
			valid: false,
			error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_MIME_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
		};
	}

	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		return {
			valid: false,
			error: `File too large. Maximum size: ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
		};
	}

	return { valid: true };
}

export function useImageUpload(folderId: string) {
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);

	const uploadFile = useCallback(
		async (file: File): Promise<boolean | string> => {
			// Validate file
			const validation = validateFile(file);
			if (!validation.valid) {
				return false;
			}

			try {
				// Get presigned upload URL
				const { uploadUrl, storageKey } = await getUploadUrl({
					data: {
						filename: file.name,
						contentType: file.type,
					},
				});

				// Upload to S3
				await uploadToS3(uploadUrl, file);

				// Get image dimensions
				let dimensions: { width: number; height: number } | undefined;
				try {
					dimensions = await getImageDimensions(file);
				} catch {
					// Dimensions are optional, continue without them
				}

				// Save to database
				await saveImage({
					data: {
						filename: file.name,
						storageKey,
						mimeType: file.type,
						sizeBytes: file.size,
						width: dimensions?.width,
						height: dimensions?.height,
						folderId,
					},
				});

				return true;
			} catch (error) {
				// Return server error message (e.g. trial expired) to show to user
				if (error instanceof Error) {
					trackImageUploadFailed(error.message, file.size, file.type);
					if (error.message.includes("trial has expired")) {
						trackWriteAccessBlocked();
					}
					return error.message;
				}
				trackImageUploadFailed("Unknown error", file.size, file.type);
				return false;
			}
		},
		[folderId],
	);

	const uploadFiles = useCallback(
		async (files: File[]) => {
			if (files.length === 0) return;

			setIsUploading(true);

			try {
				const results = await Promise.all(files.map(uploadFile));
				const successCount = results.filter((r) => r === true).length;
				const failCount = results.length - successCount;
				// Check if any failure returned a server error message
				const serverError = results.find((r) => typeof r === "string") as
					| string
					| undefined;

				// Track first image upload and invalidate queries
				if (successCount > 0) {
					trackFirstImageUploaded();
					await queryClient.invalidateQueries({
						queryKey: ["folderImages", folderId],
						exact: true,
					});
					await queryClient.invalidateQueries({
						queryKey: ["folders"],
						refetchType: "active",
					});
				}

				if (serverError) {
					toast.error(
						`Failed to upload ${failCount} image${failCount > 1 ? "s" : ""}`,
						{ description: serverError },
					);
				} else if (successCount > 0 && failCount === 0) {
					toast.success(
						`${successCount} image${successCount > 1 ? "s" : ""} uploaded`,
					);
				} else if (successCount > 0 && failCount > 0) {
					toast.warning(`${successCount} uploaded, ${failCount} failed`);
				} else if (failCount > 0) {
					toast.error(
						`Failed to upload ${failCount} image${failCount > 1 ? "s" : ""}`,
					);
				}
			} finally {
				setIsUploading(false);
			}
		},
		[uploadFile, queryClient, folderId],
	);

	return {
		uploadFiles,
		isUploading,
	};
}

/**
 * Upload a file to S3 using a presigned URL
 */
async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
	const response = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	if (!response.ok) {
		throw new Error(`Upload failed with status ${response.status}`);
	}
}
