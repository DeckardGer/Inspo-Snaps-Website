import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, organization, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq, sql } from "drizzle-orm";
import { serverEnv } from "@/config/env/server";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema/auth.schema";
import {
	sendPasswordResetEmail,
	sendTeamInvitationEmail,
	sendVerificationEmail,
	sendWelcomeVerificationEmail,
} from "@/lib/email/send";
import { resolveUserPlanState } from "@/lib/subscriptions/resolve";
import { upsertSubscription } from "@/lib/subscriptions/sync";
import { ac, roles } from "./permissions";

/**
 * Generate a unique username for OAuth users who don't provide one.
 * Derives a base from the user's name or email, then appends random digits if taken.
 */
async function generateUniqueUsername(
	name: string | null | undefined,
	email: string,
): Promise<string> {
	// Derive base from name (e.g. "John Doe" → "john.doe") or email prefix
	const raw = name?.trim()
		? name.trim().toLowerCase().replace(/\s+/g, ".")
		: email.split("@")[0].toLowerCase();

	// Strip invalid characters, ensure min length
	let base = raw.replace(/[^a-z0-9._]/g, "").replace(/\.{2,}/g, ".");
	if (base.length < 3) base = base.padEnd(3, "0");
	if (base.length > 24) base = base.slice(0, 24);

	// Check if base username is available
	const [existing] = await db
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(sql`lower(${userTable.username})`, base))
		.limit(1);

	if (!existing) return base;

	// Append random digits until we find a unique one
	for (let i = 0; i < 10; i++) {
		const suffix = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
		const candidate = `${base.slice(0, 25)}.${suffix}`;

		const [taken] = await db
			.select({ id: userTable.id })
			.from(userTable)
			.where(eq(sql`lower(${userTable.username})`, candidate))
			.limit(1);

		if (!taken) return candidate;
	}

	// Final fallback: use a UUID fragment
	return `user.${crypto.randomUUID().slice(0, 8)}`;
}

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
								productId: "debd60d1-df39-4cd7-b719-b17ca8c41232",
								slug: "pro-monthly",
							},
							{
								productId: "f08ffdf1-4bea-48e6-ba30-d960ccce14f1",
								slug: "pro-annual",
							},
							{
								productId: "4c6a4694-4e51-4d1e-8864-df1d3362e60a",
								slug: "team-monthly",
							},
							{
								productId: "9782b2a0-5e2c-4bc8-8d32-d489696d1fb4",
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
				if (!user.emailVerified) {
					// First verification (signup) — send welcome email
					void sendWelcomeVerificationEmail(user.email, url, user.name);
				} else {
					// Re-verification (manual request) — send plain verification email
					void sendVerificationEmail(user.email, url);
				}
			},
			sendOnSignUp: true,
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

		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						// Only generate username for OAuth users (email signup already provides one)
						if (user.username) return;

						const generatedUsername = await generateUniqueUsername(
							user.name,
							user.email,
						);

						return {
							data: {
								...user,
								username: generatedUsername,
								displayUsername: generatedUsername,
							},
						};
					},
				},
			},
		},
	}),
);

export const auth = getAuthConfig();
