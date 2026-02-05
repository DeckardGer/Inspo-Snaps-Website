/**
 * S3 storage mock utilities for testing
 */
import type { Mock } from "vitest";

// Type for mocked S3 functions
export type MockS3Functions = {
	createPresignedUploadUrl: Mock;
	createPresignedDownloadUrl: Mock;
	deleteStorageObject: Mock;
	deleteStorageObjects: Mock;
};

/**
 * Get the mocked S3 functions from storage/s3
 */
export async function getMockS3(): Promise<MockS3Functions> {
	const s3 = await import("@/lib/storage/s3");
	return s3 as unknown as MockS3Functions;
}

/**
 * Get the mocked storage functions
 */
export async function getMockStorageFunctions(): Promise<MockS3Functions> {
	const storage = await import("@/lib/storage/functions");
	return storage as unknown as MockS3Functions;
}

/**
 * Configure presigned upload URL mock
 */
export function mockPresignedUploadUrl(
	s3: MockS3Functions,
	url = "https://s3.example.com/upload-url",
): void {
	s3.createPresignedUploadUrl.mockResolvedValue(url);
}

/**
 * Configure presigned download URL mock
 */
export function mockPresignedDownloadUrl(
	s3: MockS3Functions,
	url = "https://s3.example.com/download-url",
): void {
	s3.createPresignedDownloadUrl.mockResolvedValue(url);
}

/**
 * Configure delete storage object mock
 */
export function mockDeleteStorageObject(
	s3: MockS3Functions,
	success = true,
	error?: Error,
): void {
	if (success) {
		s3.deleteStorageObject.mockResolvedValue(undefined);
	} else {
		s3.deleteStorageObject.mockRejectedValue(
			error || new Error("Delete failed"),
		);
	}
}

/**
 * Configure delete storage objects (batch) mock
 */
export function mockDeleteStorageObjects(
	s3: MockS3Functions,
	success = true,
	error?: Error,
): void {
	if (success) {
		s3.deleteStorageObjects.mockResolvedValue(undefined);
	} else {
		s3.deleteStorageObjects.mockRejectedValue(
			error || new Error("Batch delete failed"),
		);
	}
}

/**
 * Reset all S3 mocks
 */
export function resetS3Mocks(s3: MockS3Functions): void {
	s3.createPresignedUploadUrl.mockReset();
	s3.createPresignedDownloadUrl.mockReset();
	s3.deleteStorageObject.mockReset();
	s3.deleteStorageObjects.mockReset();

	// Re-initialize with default implementations
	mockPresignedUploadUrl(s3);
	mockPresignedDownloadUrl(s3);
	mockDeleteStorageObject(s3);
	mockDeleteStorageObjects(s3);
}
