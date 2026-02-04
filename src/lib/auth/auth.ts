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
			expiresIn: 60 * 60 * 24 * 90, // 3 months
			updateAge: 60 * 60 * 24 * 7, // Refresh weekly
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60, // 5 minutes
			},
		},

		// https://www.better-auth.com/docs/authentication/email-password
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false, // We'll enforce this in the changePassword function
			sendResetPassword: async ({ user, url, token }) => {
				// TODO: Replace with Resend email sending when wired up
				console.log("[Password Reset]", {
					to: user.email,
					subject: "Reset your password",
					resetUrl: url,
					token,
				});
			},
		},

		// https://www.better-auth.com/docs/authentication/email-verification
		emailVerification: {
			sendVerificationEmail: async ({ user, url, token }) => {
				// TODO: Replace with Resend email sending when wired up
				console.log("[Email Verification]", {
					to: user.email,
					subject: "Verify your email address",
					verificationUrl: url,
					token,
				});
			},
			sendOnSignUp: false,
			autoSignInAfterVerification: true,
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

		trustedOrigins: ["chrome-extension://logjliapdhfaooaeanbjojildfhilaab"],
	}),
);

export const auth = getAuthConfig();
