import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactElement, useState } from "react";
import { CheckMark } from "@/components/landing/shared";
import { EmailVerificationModal } from "@/components/subscriptions/EmailVerificationModal";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckout } from "@/hooks/use-checkout";
import { type BillingCycle, TIERS } from "@/lib/subscriptions/pricing";
import { cn } from "@/lib/utils";

interface PricingDialogProps {
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function PricingDialog({
	trigger,
	open,
	onOpenChange,
}: PricingDialogProps) {
	const [billing, setBilling] = useState<BillingCycle>("monthly");
	const { checkout, verificationOpen, setVerificationOpen, pendingSlug } =
		useCheckout();

	return (
		<>
			<EmailVerificationModal
				open={verificationOpen}
				onOpenChange={setVerificationOpen}
				checkoutSlug={pendingSlug}
			/>
			<Dialog open={open} onOpenChange={onOpenChange}>
				{trigger && <DialogTrigger render={trigger} />}
				<DialogContent className="flex max-h-[85vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
					<div className="overflow-y-auto">
						{/* Header */}
						<DialogHeader className="px-6 pt-6 pb-0">
							<DialogTitle className="text-center">
								Choose your plan
							</DialogTitle>
						</DialogHeader>

						{/* Billing toggle */}
						<div className="flex items-center justify-center px-6 pt-4">
							<Tabs
								value={billing}
								onValueChange={(val) => setBilling(val as BillingCycle)}
								className="gap-0"
							>
								<TabsList className="!h-auto rounded-full border border-border/50 bg-muted/50 p-1">
									<TabsTrigger
										value="monthly"
										className="!h-auto rounded-full border-none px-5 py-1.5 text-[13px] shadow-none data-active:bg-background data-active:shadow-sm dark:data-active:bg-background dark:data-active:border-transparent"
									>
										Monthly
									</TabsTrigger>
									<TabsTrigger
										value="annual"
										className="!h-auto gap-2 rounded-full border-none px-5 py-1.5 text-[13px] shadow-none data-active:bg-background data-active:shadow-sm dark:data-active:bg-background dark:data-active:border-transparent"
									>
										Annual
										<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
											Save 17%
										</span>
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Tier cards */}
						<div className="grid gap-4 p-6 sm:grid-cols-2">
							{TIERS.map((tier) => (
								<div
									key={tier.slug}
									className={cn(
										"relative flex flex-col rounded-xl border p-5 transition-colors",
										tier.popular
											? "border-primary/30 bg-primary/[0.03] shadow-sm shadow-primary/5"
											: "border-border/50 bg-card/60 hover:border-border",
									)}
								>
									{/* Popular badge */}
									{tier.popular && (
										<span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-primary/20 bg-background px-3 py-0.5 text-[10px] font-semibold text-primary shadow-sm">
											Most popular
										</span>
									)}

									{/* Name & tagline */}
									<h3 className="text-lg font-bold">{tier.name}</h3>
									<p className="mt-0.5 text-[13px] text-muted-foreground">
										{tier.tagline}
									</p>

									{/* Price */}
									<div className="mt-4 flex items-baseline gap-1.5">
										<span className="text-3xl font-bold tracking-tight">
											$
											{billing === "monthly"
												? tier.monthlyPrice
												: tier.annualPrice}
										</span>
										<span className="text-sm text-muted-foreground">
											/ month
										</span>
									</div>
									<p className="relative mt-0.5 text-[12px] text-muted-foreground">
										{billing === "monthly"
											? "Billed monthly"
											: `Billed $${tier.annualPrice * 12}/year`}
										{billing === "annual" && (
											<span className="absolute top-1/2 ml-1.5 -translate-y-1/2 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
												17% off
											</span>
										)}
									</p>

									{/* CTA */}
									<div className="mt-4">
										<Button
											variant={tier.ctaVariant}
											className="w-full"
											size="default"
											onClick={() => {
												checkout(`${tier.slug}-${billing}`);
											}}
										>
											{tier.cta}
											<HugeiconsIcon
												icon={ArrowRight02Icon}
												size={15}
												strokeWidth={2}
											/>
										</Button>
									</div>

									{/* Divider */}
									<div className="my-4 h-px bg-border/50" />

									{/* Features */}
									<p className="text-[11px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
										What's included
									</p>
									<ul className="mt-2.5 flex flex-col gap-2">
										{tier.features.map((feature) => {
											const text =
												typeof feature === "string" ? feature : feature.text;
											const soon = typeof feature === "object" && feature.soon;
											return (
												<li
													key={text}
													className="flex items-center gap-2 text-[13px]"
												>
													<CheckMark
														className={cn(
															tier.popular
																? "text-primary"
																: "text-muted-foreground",
														)}
													/>
													{text}
													{soon && (
														<span className="rounded-full border border-border/50 px-1.5 py-[1.5px] text-[10px] text-muted-foreground">
															Planned
														</span>
													)}
												</li>
											);
										})}
									</ul>
								</div>
							))}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
