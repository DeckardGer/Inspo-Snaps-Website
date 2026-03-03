export const PLANS = {
	trial: { name: "Trial", canWrite: true },
	pro: { name: "Pro", canWrite: true },
	team: { name: "Team", canWrite: true },
} as const;

export type PlanKey = keyof typeof PLANS;

export type PlanStatus = "trialing" | "active" | "expired" | "canceled";

export interface UserPlanState {
	plan: PlanKey;
	status: PlanStatus;
	canWrite: boolean;
	trialEndsAt: Date | null;
	trialDaysRemaining: number | null;
	activeSlug: string | null;
	/** When the subscription was canceled (set immediately on cancel) */
	canceledAt: Date | null;
	/** When the current billing period ends (access continues until this date) */
	periodEnd: Date | null;
}

export const PLAN_SLUGS: Record<string, PlanKey> = {
	"pro-monthly": "pro",
	"pro-annual": "pro",
	"team-monthly": "team",
	"team-annual": "team",
};

// Map Polar product IDs to plan slugs
// Replace these with your actual Polar product IDs
export const PRODUCT_ID_TO_SLUG: Record<string, string> = {
	"6b7dc528-6d34-48b0-af3a-6b62c72d374f": "pro-monthly",
	"8ab63a02-f7b5-46a7-ab21-884030c820f1": "pro-annual",
	"ac1ff4bf-5edd-46ab-9e4e-52ce9d78de09": "team-monthly",
	"d153bd52-c282-404a-b55a-28a4fc4093cd": "team-annual",
};
