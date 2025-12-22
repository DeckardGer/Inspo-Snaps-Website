import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createServerOnlyFn } from "@tanstack/react-start";
import { serverEnv } from "@/config/env/server";

// Cached singleton instances
let _s3Client: S3Client | null = null;
let _bucketName: string | null = null;

// Lazy singleton getter - only called when functions execute (on server)
const getS3Client = createServerOnlyFn(() => {
	if (!_s3Client) {
		_s3Client = new S3Client({
			region: serverEnv.S3_REGION,
			endpoint: serverEnv.S3_ENDPOINT || undefined,
			forcePathStyle: serverEnv.S3_FORCE_PATH_STYLE,
			credentials: {
				accessKeyId: serverEnv.S3_ACCESS_KEY_ID || "",
				secretAccessKey: serverEnv.S3_SECRET_ACCESS_KEY || "",
			},
		});
	}
	return _s3Client;
});

const getBucketName = createServerOnlyFn(() => {
	if (_bucketName === null) {
		_bucketName = serverEnv.S3_BUCKET_NAME || "";
	}
	return _bucketName;
});

// Cache durations
const ONE_YEAR_SECONDS = 31536000;
const TWENTY_FOUR_HOURS_SECONDS = 86400;

// Cache-Control header value for uploaded images
// Exported so the client can send the same header during upload
export const IMAGE_CACHE_CONTROL = `public, max-age=${ONE_YEAR_SECONDS}, immutable`;

export async function createPresignedUploadUrl(
	storageKey: string,
	contentType: string,
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: getBucketName(),
		Key: storageKey,
		ContentType: contentType,
		// Cache-Control tells browsers how long to cache the image.
		// - "public": Can be cached by browsers and CDNs
		// - "max-age=31536000": Cache for 1 year (in seconds)
		// - "immutable": Image will never change (safe because we use unique UUIDs)
		// This header is stored with the S3 object and sent with every download.
		CacheControl: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
	});

	return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
}

/**
 * Creates a cache-friendly presigned download URL.
 *
 * THE PROBLEM:
 * Presigned URLs include a timestamp in the signature. If we sign at 10:05:32,
 * we get a different URL than signing at 10:05:33. Browsers cache by URL, so
 * each unique URL = a new download, even for the same image.
 *
 * THE SOLUTION:
 * Round the signing time to fixed intervals (e.g., every hour). All requests
 * within the same hour get the EXACT same URL, enabling browser cache hits.
 *
 * Example with 1-hour rounding:
 * - Request at 10:05 → signs as 10:00 → URL valid until 11:00 (55 min left)
 * - Request at 10:45 → signs as 10:00 → SAME URL! Browser uses cache
 * - Request at 11:05 → signs as 11:00 → New URL (previous expired)
 *
 * We use 1-hour intervals with 24-hour expiration, giving 23-24 hours validity.
 */
export async function createPresignedDownloadUrl(
	storageKey: string,
): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: getBucketName(),
		Key: storageKey,
	});

	// Round to the start of the current hour for cache-friendly signatures
	// All requests within the same hour get the exact same URL
	const ONE_HOUR_MS = 3600 * 1000;
	const signingDate = new Date(
		Math.floor(Date.now() / ONE_HOUR_MS) * ONE_HOUR_MS,
	);

	return getSignedUrl(getS3Client(), command, {
		expiresIn: TWENTY_FOUR_HOURS_SECONDS, // 24 hours
		signingDate, // Use rounded time for consistent URLs
	});
}

export async function deleteStorageObject(storageKey: string): Promise<void> {
	const command = new DeleteObjectCommand({
		Bucket: getBucketName(),
		Key: storageKey,
	});

	await getS3Client().send(command);
}

export async function deleteStorageObjects(
	storageKeys: string[],
): Promise<void> {
	if (storageKeys.length === 0) return;

	const s3Client = getS3Client();
	const bucketName = getBucketName();

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
