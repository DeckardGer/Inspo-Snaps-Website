import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";

const TRIAL_WARNING_DAYS = 5;

export function TrialBanner() {
	const { data: planState } = useQuery(planStateQueryOptions());

	if (!planState) return null;
	if (planState.status !== "trialing") return null;
	if (
		planState.trialDaysRemaining === null ||
		planState.trialDaysRemaining > TRIAL_WARNING_DAYS
	)
		return null;

	const daysText =
		planState.trialDaysRemaining === 1
			? "1 day"
			: `${planState.trialDaysRemaining} days`;

	return (
		<div className="flex items-center gap-3 border-b border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-900/50 dark:bg-blue-950/30">
			<HugeiconsIcon
				icon={InformationCircleIcon}
				className="size-4 shrink-0 text-blue-600 dark:text-blue-400"
				strokeWidth={2}
			/>
			<p className="flex-1 text-sm text-blue-800 dark:text-blue-200">
				Your free trial ends in {daysText}. Upgrade to keep full access.
			</p>
			<Button
				size="sm"
				variant="outline"
				className="shrink-0 border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900"
				onClick={() => {
					authClient.checkout({ slug: "pro-monthly" });
				}}
			>
				Upgrade
			</Button>
		</div>
	);
}
