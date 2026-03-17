import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, organization, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { serverEnv } from "@/config/env/server";
import { db } from "@/lib/db";
import {
	sendPasswordResetEmail,
	sendTeamInvitationEmail,
	sendVerificationEmail,
} from "@/lib/email/send";
import { resolveUserPlanState } from "@/lib/subscriptions/resolve";
import { upsertSubscription } from "@/lib/subscriptions/sync";
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

		// https://www.better-auth.com/docs/concepts/rate-limit
		rateLimit: {
			enabled: true,
			window: 60, // 60 second window
			max: 100, // 100 requests per window (general endpoints)
			storage: "database", // Persist across serverless invocations
			modelName: "rateLimit",
			customRules: {
				// Strict limits on auth endpoints to prevent brute force
				"/sign-in/email": { window: 60, max: 5 }, // 5 login attempts per minute
				"/sign-up/email": { window: 60, max: 3 }, // 3 signups per minute
				"/forget-password": { window: 60, max: 3 }, // 3 reset requests per minute
				"/reset-password": { window: 60, max: 5 }, // 5 reset attempts per minute
				"/verify-email": { window: 60, max: 5 }, // 5 verification attempts per minute
				"/send-verification-email": { window: 300, max: 3 }, // 3 emails per 5 minutes
				"/change-password": { window: 60, max: 3 }, // 3 password changes per minute
				// OAuth is less sensitive as it's provider-controlled
				"/sign-in/social": { window: 60, max: 10 },
				// Session endpoints can be more relaxed
				"/get-session": false, // No limit on session checks
			},
		},

		// https://www.better-auth.com/docs/integrations/tanstack#usage-tips
		plugins: [
			username(),
			organization({
				ac,
				roles,
				async sendInvitationEmail(data) {
					const inviteLink = `${serverEnv.VITE_BASE_URL}/accept-invitation/${data.id}`;
					await sendTeamInvitationEmail(data.email, {
						inviteLink,
						inviterName: data.inviter.user.name ?? "Someone",
						teamName: data.organization.name,
						role: data.role,
					});
				},
			}),
			polar({
				client: new Polar({
					accessToken: serverEnv.POLAR_ACCESS_TOKEN,
					server:
						process.env.NODE_ENV === "production" ? "production" : "sandbox",
				}),
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: [
							{
								productId: "6b7dc528-6d34-48b0-af3a-6b62c72d374f",
								slug: "pro-monthly",
							},
							{
								productId: "8ab63a02-f7b5-46a7-ab21-884030c820f1",
								slug: "pro-annual",
							},
							{
								productId: "ac1ff4bf-5edd-46ab-9e4e-52ce9d78de09",
								slug: "team-monthly",
							},
							{
								productId: "d153bd52-c282-404a-b55a-28a4fc4093cd",
								slug: "team-annual",
							},
						],
						successUrl: "/my-folders?checkout=success",
						authenticatedUsersOnly: true,
					}),
					portal(),
					webhooks({
						secret: serverEnv.POLAR_WEBHOOK_SECRET,
						onSubscriptionCreated: async (payload) => {
							await upsertSubscription(payload.data);
						},
						onSubscriptionUpdated: async (payload) => {
							await upsertSubscription(payload.data);
						},
						onSubscriptionActive: async (payload) => {
							await upsertSubscription(payload.data);
						},
						onSubscriptionCanceled: async (payload) => {
							await upsertSubscription(payload.data);
						},
						onSubscriptionRevoked: async (payload) => {
							await upsertSubscription(payload.data);
						},
						onSubscriptionUncanceled: async (payload) => {
							await upsertSubscription(payload.data);
						},
					}),
				],
			}),
			customSession(async ({ user, session }) => {
				const planState = await resolveUserPlanState(user.id);
				return {
					user,
					session: {
						...session,
						plan: planState.plan,
						planStatus: planState.status,
						canWrite: planState.canWrite,
						trialDaysRemaining: planState.trialDaysRemaining,
						activeSlug: planState.activeSlug,
						canceledAt: planState.canceledAt,
						periodEnd: planState.periodEnd,
					},
				};
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
			sendResetPassword: async ({ user, url }) => {
				await sendPasswordResetEmail(user.email, url);
			},
		},

		// https://www.better-auth.com/docs/authentication/email-verification
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await sendVerificationEmail(user.email, url);
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

		trustedOrigins: ["chrome-extension://ohbhjbpbdoddddokobagmhfcpadhklef"],
	}),
);

export const auth = getAuthConfig();
