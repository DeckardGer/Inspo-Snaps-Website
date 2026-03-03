import { AlertDiamondIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";

export function UpgradeBanner() {
	const { data: planState } = useQuery(planStateQueryOptions());

	if (!planState || planState.canWrite) return null;

	return (
		<div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-900/50 dark:bg-amber-950/30">
			<HugeiconsIcon
				icon={AlertDiamondIcon}
				className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
				strokeWidth={2}
			/>
			<p className="flex-1 text-sm text-amber-800 dark:text-amber-200">
				Your free trial has ended. Upgrade to keep creating and editing.
			</p>
			<Button
				size="sm"
				variant="outline"
				className="shrink-0 border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-200 dark:hover:bg-amber-900"
				onClick={() => {
					authClient.checkout({ slug: "pro-monthly" });
				}}
			>
				Upgrade to Pro
			</Button>
		</div>
	);
}
