import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
	server: {
		VITE_BASE_URL: z.url().default("http://localhost:3000"),
		BETTER_AUTH_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		DATABASE_URL: z.url(),
		S3_ENDPOINT: z.string().optional(),
		S3_REGION: z.string().default("us-east-1"),
		S3_ACCESS_KEY_ID: z.string().optional(),
		S3_SECRET_ACCESS_KEY: z.string().optional(),
		S3_BUCKET_NAME: z.string().optional(),
		S3_FORCE_PATH_STYLE: z.coerce.boolean().default(false),
		RESEND_API_KEY: z.string().min(1),
		EMAIL_FROM: z.email().default("InspoSnaps <noreply@insposnaps.com>"),
	},
	runtimeEnv: process.env,
});
