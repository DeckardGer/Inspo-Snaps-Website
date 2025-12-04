import { z } from "zod";

const serverEnvSchema = z.object({
	DATABASE_URL: z.url(),
	VITE_BASE_URL: z.url().default("http://localhost:3000"),
	BETTER_AUTH_SECRET: z.string().min(1),
});

// Validate server environment
export const serverEnv = serverEnvSchema.parse(process.env);
