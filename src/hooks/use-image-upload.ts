import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { saveImage } from "@/lib/images/functions";
import { getImageDimensions } from "@/lib/images/utils";
import { getUploadUrl } from "@/lib/storage/functions";

const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadStatus = "pending" | "uploading" | "success" | "error";

export interface UploadProgress {
	id: string;
	filename: string;
	status: UploadStatus;
	progress: number; // 0-100
	error?: string;
}

interface ValidationResult {
	valid: boolean;
	error?: string;
}

export function validateFile(file: File): ValidationResult {
	if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
		return {
			valid: false,
			error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		};
	}

	return { valid: true };
}

export function useImageUpload(folderId: string) {
	const queryClient = useQueryClient();
	const [uploads, setUploads] = useState<UploadProgress[]>([]);

	const updateUpload = useCallback(
		(id: string, updates: Partial<UploadProgress>) => {
			setUploads((prev) =>
				prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
			);
		},
		[],
	);

	const clearCompleted = useCallback(() => {
		setUploads((prev) =>
			prev.filter((u) => u.status !== "success" && u.status !== "error"),
		);
	}, []);

	const uploadFile = useCallback(
		async (file: File): Promise<boolean> => {
			const uploadId = crypto.randomUUID();

			// Add to upload list
			setUploads((prev) => [
				...prev,
				{
					id: uploadId,
					filename: file.name,
					status: "pending",
					progress: 0,
				},
			]);

			// Validate file
			const validation = validateFile(file);
			if (!validation.valid) {
				updateUpload(uploadId, {
					status: "error",
					error: validation.error,
				});
				return false;
			}

			try {
				updateUpload(uploadId, { status: "uploading", progress: 10 });

				// Get presigned upload URL
				const { uploadUrl, storageKey } = await getUploadUrl({
					data: {
						filename: file.name,
						contentType: file.type,
					},
				});

				updateUpload(uploadId, { progress: 20 });

				// Upload to S3 with progress tracking
				await uploadToS3(uploadUrl, file, (progress) => {
					// Scale progress: 20-80% is the actual upload
					updateUpload(uploadId, { progress: 20 + progress * 0.6 });
				});

				updateUpload(uploadId, { progress: 85 });

				// Get image dimensions
				let dimensions: { width: number; height: number } | undefined;
				try {
					dimensions = await getImageDimensions(file);
				} catch {
					// Dimensions are optional, continue without them
				}

				updateUpload(uploadId, { progress: 90 });

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

				updateUpload(uploadId, { status: "success", progress: 100 });

				return true;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Upload failed";
				updateUpload(uploadId, { status: "error", error: errorMessage });
				return false;
			}
		},
		[folderId, updateUpload],
	);

	const uploadFiles = useCallback(
		async (files: File[]) => {
			if (files.length === 0) return;

			const results = await Promise.all(files.map(uploadFile));
			const successCount = results.filter(Boolean).length;
			const failCount = results.length - successCount;

			// Invalidate queries once after all uploads complete to avoid AbortError
			if (successCount > 0) {
				await queryClient.invalidateQueries({
					queryKey: ["folderImages", folderId],
					exact: true,
				});
				await queryClient.invalidateQueries({
					queryKey: ["folders"],
					refetchType: "active",
				});
			}

			if (successCount > 0 && failCount === 0) {
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
		},
		[uploadFile, queryClient, folderId],
	);

	return {
		uploads,
		uploadFiles,
		clearCompleted,
		isUploading: uploads.some((u) => u.status === "uploading"),
	};
}

/**
 * Upload a file to S3 using a presigned URL with progress tracking
 */
async function uploadToS3(
	uploadUrl: string,
	file: File,
	onProgress: (progress: number) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener("progress", (e) => {
			if (e.lengthComputable) {
				onProgress((e.loaded / e.total) * 100);
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
			} else {
				reject(new Error(`Upload failed with status ${xhr.status}`));
			}
		});

		xhr.addEventListener("error", () => {
			reject(new Error("Network error during upload"));
		});

		xhr.open("PUT", uploadUrl);
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.send(file);
	});
}
