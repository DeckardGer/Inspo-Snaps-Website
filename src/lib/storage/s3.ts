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

/**
 * Returns a public URL for an S3 object.
 * Uses S3_PUBLIC_URL if set, otherwise constructs from endpoint/bucket config.
 * Used for content that doesn't need presigned URLs (e.g. avatars).
 */
export function getPublicObjectUrl(storageKey: string): string {
	const bucket = getBucketName();
	const endpoint = serverEnv.S3_ENDPOINT;
	if (endpoint && serverEnv.S3_FORCE_PATH_STYLE) {
		// Path-style (MinIO local dev): http://localhost:9000/bucket/key
		return `${endpoint.replace(/\/$/, "")}/${bucket}/${storageKey}`;
	}

	// Virtual-hosted style (AWS S3): https://bucket.s3.region.amazonaws.com/key
	return `https://${bucket}.s3.${serverEnv.S3_REGION}.amazonaws.com/${storageKey}`;
}

// Cache durations
const ONE_YEAR_SECONDS = 31536000;

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
 * Round the signing time to 7-day intervals. All requests within the same
 * 7-day window get the EXACT same URL, enabling browser cache hits.
 *
 * Example with 7-day rounding:
 * - Request on Day 1 at 10:05 → signs as window start → URL valid for 7 days
 * - Request on Day 5 at 18:30 → signs as window start → SAME URL! Cache hit
 * - Request on Day 8 at 09:00 → new window start → New URL (new window)
 *
 * The 7-day rounding matches the 7-day presigned URL expiration (the max
 * allowed by AWS for IAM credentials), maximizing browser cache lifetime.
 */
export async function createPresignedDownloadUrl(
	storageKey: string,
): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: getBucketName(),
		Key: storageKey,
	});

	// Round to the start of the current 7-day window for cache-friendly signatures
	// All requests within the same window get the exact same URL
	const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
	const signingDate = new Date(
		Math.floor(Date.now() / SEVEN_DAYS_MS) * SEVEN_DAYS_MS,
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
