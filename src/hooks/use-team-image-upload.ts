import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { validateFile } from "./use-image-upload";
import { saveTeamImage } from "@/lib/images/functions";
import { getImageDimensions } from "@/lib/images/utils";
import { getUploadUrl } from "@/lib/storage/functions";

export function useTeamImageUpload(organizationId: string, folderId: string) {
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);

	const uploadFile = useCallback(
		async (file: File): Promise<boolean> => {
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
				await saveTeamImage({
					data: {
						filename: file.name,
						storageKey,
						mimeType: file.type,
						sizeBytes: file.size,
						width: dimensions?.width,
						height: dimensions?.height,
						folderId,
						organizationId,
					},
				});

				return true;
			} catch {
				return false;
			}
		},
		[folderId, organizationId],
	);

	const uploadFiles = useCallback(
		async (files: File[]) => {
			if (files.length === 0) return;

			setIsUploading(true);

			try {
				const results = await Promise.all(files.map(uploadFile));
				const successCount = results.filter(Boolean).length;
				const failCount = results.length - successCount;

				// Invalidate queries once after all uploads complete
				if (successCount > 0) {
					await queryClient.invalidateQueries({
						queryKey: ["teamFolderImages", organizationId, folderId],
						exact: true,
					});
					await queryClient.invalidateQueries({
						queryKey: ["teamFolders", organizationId],
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
			} finally {
				setIsUploading(false);
			}
		},
		[uploadFile, queryClient, folderId, organizationId],
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
