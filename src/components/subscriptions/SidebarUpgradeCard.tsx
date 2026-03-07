import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { PricingDialog } from "@/components/subscriptions/PricingDialog";
import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	useSidebar,
} from "@/components/ui/sidebar";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";

const TRIAL_TOTAL_DAYS = 14;

export function SidebarUpgradeCard() {
	const { data: planState } = useQuery(planStateQueryOptions());
	const { state, isMobile } = useSidebar();

	// Always render the SidebarGroup wrapper so the tree is stable for hydration
	const hidden =
		!planState ||
		planState.status === "active" ||
		planState.status === "canceled";

	if (hidden) {
		return <SidebarGroup className="mt-auto !p-0" />;
	}

	const isExpired = !planState.canWrite;
	const isTrialing = planState.status === "trialing";

	// Calculate progress for trial
	const daysRemaining = planState.trialDaysRemaining ?? 0;
	const daysUsed = TRIAL_TOTAL_DAYS - daysRemaining;
	const progress = Math.min(
		Math.max((daysUsed / TRIAL_TOTAL_DAYS) * 100, 0),
		100,
	);

	const daysText = daysRemaining === 1 ? "1 day" : `${daysRemaining} days`;

	// Collapsed sidebar: show just a sparkle icon button
	// On mobile, the sidebar opens as a full-width sheet, so always show the expanded card
	if (state === "collapsed" && !isMobile) {
		return (
			<SidebarGroup className="mt-auto">
				<SidebarGroupContent className="flex justify-center">
					<PricingDialog
						trigger={
							<button
								type="button"
								className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
							>
								<HugeiconsIcon icon={SparklesIcon} className="size-4" />
							</button>
						}
					/>
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	return (
		<SidebarGroup className="mt-auto">
			<SidebarGroupContent>
				<div className="relative overflow-hidden rounded-xl border border-sidebar-border p-3.5">
					{/* Gradient background */}
					<div
						className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
						style={{
							background:
								"linear-gradient(225deg, rgba(129,140,248,0.45) 0%, rgba(165,180,252,0.3) 25%, rgba(199,210,254,0.25) 50%, rgba(224,231,255,0.15) 75%, transparent 100%)",
						}}
					/>
					{/* Dot pattern overlay — top-right corner */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
						style={{
							backgroundImage:
								"radial-gradient(circle, currentColor 0.75px, transparent 0.75px)",
							backgroundSize: "8px 8px",
							maskImage: "linear-gradient(225deg, black 0%, transparent 50%)",
							WebkitMaskImage:
								"linear-gradient(225deg, black 0%, transparent 50%)",
						}}
					/>
					{/* Content */}
					<div className="relative">
						<div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-sidebar-foreground dark:bg-sidebar-foreground/90">
							<HugeiconsIcon
								icon={SparklesIcon}
								className="size-4 text-sidebar"
							/>
						</div>
						<span className="mb-1 block text-sm font-semibold text-sidebar-foreground">
							{isExpired ? "Trial Ended" : "Upgrade to Pro"}
						</span>

						{isTrialing && (
							<>
								<div className="mb-1.5 flex items-center justify-between">
									<span className="text-xs text-sidebar-foreground/60">
										Free Trial
									</span>
									<span className="text-xs font-medium text-sidebar-foreground/80">
										{daysText} left
									</span>
								</div>
								<div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-sidebar-foreground/10">
									<div
										className="h-full rounded-full bg-sidebar-foreground/70 transition-all"
										style={{ width: `${progress}%` }}
									/>
								</div>
							</>
						)}

						<p className="mb-3 text-xs leading-relaxed text-sidebar-foreground/60">
							{isExpired
								? "Your trial has ended. Upgrade to keep creating and editing."
								: "Unlock unlimited folders, images, and team collaboration."}
						</p>

						<PricingDialog
							trigger={
								<Button
									size="sm"
									variant="outline"
									className="w-full bg-sidebar/80 backdrop-blur-sm"
								>
									Upgrade Now
								</Button>
							}
						/>
					</div>
				</div>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
