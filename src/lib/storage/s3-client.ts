import { S3Client } from "@aws-sdk/client-s3";
import { createServerOnlyFn } from "@tanstack/react-start";
import { serverEnv } from "@/config/env/server";

const getS3Client = createServerOnlyFn(() => {
	return new S3Client({
		region: serverEnv.S3_REGION,
		endpoint: serverEnv.S3_ENDPOINT || undefined,
		forcePathStyle: serverEnv.S3_FORCE_PATH_STYLE,
		credentials: {
			accessKeyId: serverEnv.S3_ACCESS_KEY_ID || "",
			secretAccessKey: serverEnv.S3_SECRET_ACCESS_KEY || "",
		},
	});
});

export const s3Client = getS3Client();
export const bucketName = serverEnv.S3_BUCKET_NAME || "";
