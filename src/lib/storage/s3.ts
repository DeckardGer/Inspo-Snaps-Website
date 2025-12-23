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

// 7 days in seconds for presigned URL expiration
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

/**
 * Creates a cache-friendly presigned download URL.
 *
 * THE PROBLEM:
 * Presigned URLs include a timestamp in the signature. If we sign at 10:05:32,
 * we get a different URL than signing at 10:05:33. Browsers cache by URL, so
 * each unique URL = a new download, even for the same image.
 *
 * THE SOLUTION:
 * Round the signing time to 24-hour intervals (midnight UTC). All requests
 * within the same day get the EXACT same URL, enabling browser cache hits.
 *
 * Example with 24-hour rounding:
 * - Request at Mon 10:05 → signs as Mon 00:00 → URL valid for 7 days
 * - Request at Mon 18:30 → signs as Mon 00:00 → SAME URL! Browser uses cache
 * - Request at Tue 09:00 → signs as Tue 00:00 → New URL (new day)
 *
 * We use 24-hour intervals with 7-day expiration, ensuring URLs remain valid
 * well beyond the rounding window.
 */
export async function createPresignedDownloadUrl(
	storageKey: string,
): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: getBucketName(),
		Key: storageKey,
	});

	// Round to the start of the current day (midnight UTC) for cache-friendly signatures
	// All requests within the same day get the exact same URL
	const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
	const signingDate = new Date(
		Math.floor(Date.now() / TWENTY_FOUR_HOURS_MS) * TWENTY_FOUR_HOURS_MS,
	);

	return getSignedUrl(getS3Client(), command, {
		expiresIn: SEVEN_DAYS_SECONDS, // 7 days
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
