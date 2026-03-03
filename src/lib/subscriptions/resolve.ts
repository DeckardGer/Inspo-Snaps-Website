import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscription, user } from "@/lib/db/schema";
import {
	PLAN_SLUGS,
	type PlanKey,
	type PlanStatus,
	type UserPlanState,
} from "./constants";

const ACTIVE_STATUSES = ["active", "trialing"];

export async function resolveUserPlanState(
	userId: string,
): Promise<UserPlanState> {
	// Get user's trial info
	const dbUser = await db.query.user.findFirst({
		where: eq(user.id, userId),
		columns: { trialEndsAt: true },
	});

	if (!dbUser) {
		return {
			plan: "trial",
			status: "expired",
			canWrite: false,
			trialEndsAt: null,
			trialDaysRemaining: null,
			activeSlug: null,
		};
	}

	// Check for active subscription
	const activeSub = await db.query.subscription.findFirst({
		where: and(
			eq(subscription.userId, userId),
			inArray(subscription.status, ACTIVE_STATUSES),
		),
	});

	if (activeSub) {
		const plan: PlanKey = activeSub.planSlug
			? (PLAN_SLUGS[activeSub.planSlug] ?? "pro")
			: "pro";

		return {
			plan,
			status: "active",
			canWrite: true,
			trialEndsAt: dbUser.trialEndsAt,
			trialDaysRemaining: null,
			activeSlug: activeSub.planSlug,
		};
	}

	// Check for canceled subscription (still within period)
	const canceledSub = await db.query.subscription.findFirst({
		where: and(
			eq(subscription.userId, userId),
			eq(subscription.status, "canceled"),
		),
	});

	if (
		canceledSub?.currentPeriodEnd &&
		canceledSub.currentPeriodEnd > new Date()
	) {
		const plan: PlanKey = canceledSub.planSlug
			? (PLAN_SLUGS[canceledSub.planSlug] ?? "pro")
			: "pro";

		return {
			plan,
			status: "canceled",
			canWrite: true,
			trialEndsAt: dbUser.trialEndsAt,
			trialDaysRemaining: null,
			activeSlug: canceledSub.planSlug,
		};
	}

	// Check trial
	const now = new Date();
	const trialEndsAt = dbUser.trialEndsAt;
	const trialActive = trialEndsAt > now;

	if (trialActive) {
		const msRemaining = trialEndsAt.getTime() - now.getTime();
		const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

		return {
			plan: "trial",
			status: "trialing" as PlanStatus,
			canWrite: true,
			trialEndsAt,
			trialDaysRemaining: daysRemaining,
			activeSlug: null,
		};
	}

	// Trial expired, no active subscription
	return {
		plan: "trial",
		status: "expired",
		canWrite: false,
		trialEndsAt,
		trialDaysRemaining: 0,
		activeSlug: null,
	};
}
