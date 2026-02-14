import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckMark, FadeIn, GABARITO, SectionBadge } from "./shared";

type BillingCycle = "monthly" | "annual";

interface PricingTier {
	name: string;
	tagline: string;
	monthlyPrice: number;
	annualPrice: number;
	cta: string;
	ctaVariant: "outline" | "default";
	popular?: boolean;
	features: (string | { text: string; soon?: boolean })[];
}

const TIERS: PricingTier[] = [
	{
		name: "Free",
		tagline: "For casual collectors getting started",
		monthlyPrice: 0,
		annualPrice: 0,
		cta: "Get Started",
		ctaVariant: "outline",
		features: [
			"Unlimited folders & images",
			"Stored locally on your device",
			"Browser extension",
			"Folder organization & colors",
			"View collections on insposnaps.com",
		],
	},
	{
		name: "Pro",
		tagline: "For creatives who need more power",
		monthlyPrice: 8,
		annualPrice: 6,
		cta: "Get Started",
		ctaVariant: "default",
		popular: true,
		features: [
			"Everything in Free",
			"Unlimited cloud storage",
			"Sync across all devices",
			"Share view-only folders with anyone",
			"Nested folder structures",
			"Priority support",
			{ text: "AI auto-tagging & smart search", soon: true },
		],
	},
	{
		name: "Team",
		tagline: "For teams building together",
		monthlyPrice: 16,
		annualPrice: 12,
		cta: "Get Started",
		ctaVariant: "outline",
		features: [
			"Everything in Pro",
			"Unlimited team workspaces",
			"Viewer & editor roles",
			"Dedicated support",
		],
	},
];

export function PricingSection() {
	const [billing, setBilling] = useState<BillingCycle>("monthly");

	return (
		<section id="pricing" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				{/* Header */}
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionBadge>Pricing</SectionBadge>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={GABARITO}
						>
							Simple pricing, no surprises
						</h2>
						<p className="mt-3 text-base text-muted-foreground">
							Start free, upgrade when you're ready. Cancel anytime.
						</p>
					</div>
				</FadeIn>

				{/* Billing toggle */}
				<FadeIn delay={80}>
					<div className="mt-8 flex items-center justify-center">
						<div className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 p-1">
							<button
								type="button"
								className={cn(
									"relative rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300",
									billing === "monthly"
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
								onClick={() => setBilling("monthly")}
							>
								Monthly
							</button>
							<button
								type="button"
								className={cn(
									"relative flex items-center gap-2 rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300",
									billing === "annual"
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
								onClick={() => setBilling("annual")}
							>
								Annual
								<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
									Save 25%
								</span>
							</button>
						</div>
					</div>
				</FadeIn>

				{/* Pricing cards */}
				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					{TIERS.map((tier, i) => (
						<FadeIn key={tier.name} delay={i * 100 + 160}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border p-7 transition-colors",
									tier.popular
										? "border-primary/30 bg-primary/[0.03] shadow-md shadow-primary/5"
										: "border-border/50 bg-card/60 hover:border-border",
								)}
							>
								{/* Popular glow */}
								{tier.popular && (
									<div
										className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-50 blur-xl"
										style={{
											background:
												"linear-gradient(135deg, color-mix(in oklch, var(--primary) 20%, transparent), color-mix(in oklch, var(--primary) 8%, transparent))",
										}}
										aria-hidden="true"
									/>
								)}

								{/* Popular badge — centered at top of card */}
								{tier.popular && (
									<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/20 bg-background px-3.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
										Popular
									</span>
								)}

								{/* Name & tagline */}
								<h3 className="text-xl font-bold" style={GABARITO}>
									{tier.name}
								</h3>
								<p className="mt-1 text-[13px] text-muted-foreground">
									{tier.tagline}
								</p>

								{/* Price */}
								<div className="mt-5 flex items-baseline gap-1.5">
									<span
										className="text-4xl font-bold tracking-tight"
										style={GABARITO}
									>
										$
										{billing === "monthly"
											? tier.monthlyPrice
											: tier.annualPrice}
									</span>
									<span className="text-sm text-muted-foreground">
										{tier.monthlyPrice === 0 ? "forever" : "/ month"}
									</span>
								</div>
								<p
									className={cn(
										"relative mt-1 text-[12px] text-muted-foreground",
										tier.monthlyPrice === 0 && "invisible",
									)}
								>
									{tier.monthlyPrice > 0
										? billing === "monthly"
											? "Billed monthly"
											: `Billed $${tier.annualPrice * 12}/year`
										: "Placeholder"}
									{tier.monthlyPrice > 0 && (
										<span
											className={cn(
												"absolute top-1/2 ml-1.5 -translate-y-1/2 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500",
												billing === "monthly" ? "opacity-0" : "opacity-100",
											)}
										>
											25% off
										</span>
									)}
								</p>

								{/* CTA */}
								<div className="mt-4">
									{tier.ctaVariant === "default" ? (
										<Button
											className="w-full"
											size="default"
											render={<Link to="/signup" />}
											nativeButton={false}
										>
											{tier.cta}
											<HugeiconsIcon
												icon={ArrowRight02Icon}
												size={15}
												strokeWidth={2}
											/>
										</Button>
									) : (
										<Button
											variant="outline"
											className="w-full"
											size="default"
											render={<Link to="/signup" />}
											nativeButton={false}
										>
											{tier.cta}
											<HugeiconsIcon
												icon={ArrowRight02Icon}
												size={15}
												strokeWidth={2}
											/>
										</Button>
									)}
								</div>

								{/* Divider */}
								<div className="my-6 h-px bg-border/50" />

								{/* Features */}
								<p className="text-[12px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
									What's included
								</p>
								<ul className="mt-3 flex flex-col gap-2.5">
									{tier.features.map((feature) => {
										const text =
											typeof feature === "string" ? feature : feature.text;
										const soon = typeof feature === "object" && feature.soon;
										return (
											<li
												key={text}
												className="flex items-center gap-2.5 text-[13.5px]"
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
						</FadeIn>
					))}
				</div>

				{/* Bottom note */}
				<FadeIn delay={500}>
					<p className="mt-10 text-center text-[13px] text-muted-foreground">
						All prices in USD. All plans include the browser extension,
						end-to-end encryption, and 24/7 uptime.{" "}
						<Link
							to="/signup"
							className="font-medium text-primary underline-offset-4 hover:underline"
						>
							Start with Free
						</Link>
					</p>
				</FadeIn>
			</div>
		</section>
	);
}
