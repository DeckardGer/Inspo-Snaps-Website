import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscription, user } from "@/lib/db/schema";
import {
	PLAN_SLUGS,
	type PlanKey,
	type PlanStatus,
	type UserPlanState,
} from "./constants";

function resolvePlan(sub: {
	planSlug: string | null;
	productName: string | null;
}): PlanKey {
	if (sub.planSlug) return PLAN_SLUGS[sub.planSlug] ?? "pro";
	if (sub.productName?.toLowerCase().includes("team")) return "team";
	return "pro";
}

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
			canceledAt: null,
			periodEnd: null,
		};
	}

	// Find an active or trialing subscription (most recent first).
	// Polar keeps status "active" during a cancel grace period (canceledAt is
	// set but status stays "active" until the billing period actually ends).
	// When access truly ends — either the period expires or an immediate
	// revoke — Polar sets status to "canceled".  So we only need to check
	// for active/trialing rows; a "canceled" row always means no access.
	const activeSub = await db.query.subscription.findFirst({
		where: and(
			eq(subscription.userId, userId),
			inArray(subscription.status, ["active", "trialing"]),
		),
		orderBy: desc(subscription.updatedAt),
	});

	if (activeSub) {
		const plan = resolvePlan(activeSub);

		// canceledAt set = user canceled but still within their paid period
		if (activeSub.canceledAt) {
			return {
				plan,
				status: "canceled",
				canWrite: true,
				trialEndsAt: dbUser.trialEndsAt,
				trialDaysRemaining: null,
				activeSlug: activeSub.planSlug,
				canceledAt: activeSub.canceledAt,
				periodEnd: activeSub.currentPeriodEnd,
			};
		}

		return {
			plan,
			status: "active",
			canWrite: true,
			trialEndsAt: dbUser.trialEndsAt,
			trialDaysRemaining: null,
			activeSlug: activeSub.planSlug,
			canceledAt: null,
			periodEnd: activeSub.currentPeriodEnd,
		};
	}

	// No active subscription — check trial
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
			canceledAt: null,
			periodEnd: null,
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
		canceledAt: null,
		periodEnd: null,
	};
}
