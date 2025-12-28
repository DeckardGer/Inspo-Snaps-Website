import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { serverEnv } from "@/config/env/server";
import { db } from "@/lib/db";
import { ac, roles } from "./permissions";

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
		plugins: [
			username(),
			organization({
				ac,
				roles,
				async sendInvitationEmail(data) {
					// TODO: Implement actual email sending
					// For now, log the invitation details for development
					const inviteLink = `${serverEnv.VITE_BASE_URL}/accept-invitation/${data.id}`;
					console.log("[Organization Invitation]", {
						email: data.email,
						invitedBy: data.inviter.user.name,
						organization: data.organization.name,
						role: data.role,
						inviteLink,
					});
				},
			}),
			tanstackStartCookies(),
		], // Make sure tanstackStartCookies is the last plugin in the array

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

		socialProviders: {
			google: {
				clientId: serverEnv.GOOGLE_CLIENT_ID,
				clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
			},
		},

		experimental: {
			// https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
			joins: true,
		},
	}),
);

export const auth = getAuthConfig();
