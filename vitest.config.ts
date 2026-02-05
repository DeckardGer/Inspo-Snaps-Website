import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "node",
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.test.ts"],
		globals: true,
		mockReset: true,
		restoreMocks: true,
		coverage: {
			provider: "v8",
			include: ["src/lib/**/*.ts"],
			exclude: [
				"src/lib/db/schema/**",
				"src/**/*.test.ts",
				"src/lib/db/index.ts",
				"src/lib/auth/auth.ts",
				"src/lib/auth/auth-client.ts",
			],
		},
	},
});
