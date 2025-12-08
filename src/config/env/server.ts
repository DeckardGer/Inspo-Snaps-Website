import { z } from "zod";

const serverEnvSchema = z.object({
	VITE_BASE_URL: z.url().default("http://localhost:3000"),
	BETTER_AUTH_SECRET: z.string().min(1),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	DATABASE_URL: z.url(),
});

// Validate server environment
export const serverEnv = serverEnvSchema.parse(process.env);
