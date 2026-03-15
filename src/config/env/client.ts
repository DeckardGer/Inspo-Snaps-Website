import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_BASE_URL: z.url().default("http://localhost:3000"),
		VITE_POSTHOG_KEY: z.string().default(""),
	},
	runtimeEnv: import.meta.env,
});
