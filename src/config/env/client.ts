import { z } from "zod";

const clientEnvSchema = z.object({
	VITE_BASE_URL: z.url().default("http://localhost:3000"),
});

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env);
