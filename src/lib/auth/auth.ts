import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { serverEnv } from "@/config/env/server";
import { db } from "@/lib/db";

const getAuthConfig = createServerOnlyFn(() =>
	betterAuth({
		baseURL: serverEnv.VITE_BASE_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		telemetry: {
			enabled: false,
		},

		// https://www.better-auth.com/docs/integrations/tanstack#usage-tips
		plugins: [tanstackStartCookies()], // Make sure this is the last plugin in the array

		// https://www.better-auth.com/docs/concepts/session-management#session-caching
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60, // 5 minutes
			},
		},

		// https://www.better-auth.com/docs/authentication/email-password
		emailAndPassword: {
			enabled: true,
		},

		experimental: {
			// https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
			joins: true,
		},
	}),
);

export const auth = getAuthConfig();
