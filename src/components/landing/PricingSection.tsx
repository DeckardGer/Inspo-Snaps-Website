import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { EmailVerificationModal } from "@/components/subscriptions/EmailVerificationModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckout } from "@/hooks/use-checkout";
import {
	trackLandingCtaClicked,
	trackLandingPricingToggled,
} from "@/lib/analytics/capture";
import { authQueryOptions } from "@/lib/auth/queries";
import { type BillingCycle, TIERS } from "@/lib/subscriptions/pricing";
import { cn } from "@/lib/utils";
import { CheckMark, FadeIn, GABARITO, SectionBadge } from "./shared";

const TRIAL_FEATURES = [
	"Full access to all Pro features",
	"Unlimited folders & images",
	"Browser extension",
	"Sync across all devices",
	"No credit card required",
];

export function PricingSection() {
	const [billing, setBilling] = useState<BillingCycle>("monthly");
	const { data: user } = useQuery(authQueryOptions());
	const isLoggedIn = !!user;
	const { checkout, verificationOpen, setVerificationOpen, pendingSlug } =
		useCheckout();

	return (
		<>
			<EmailVerificationModal
				open={verificationOpen}
				onOpenChange={setVerificationOpen}
				checkoutSlug={pendingSlug}
			/>
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
								Start with a 14-day free trial. Pick a plan when you're ready.
							</p>
						</div>
					</FadeIn>

					{/* Billing toggle */}
					<FadeIn delay={80}>
						<div className="mt-8 flex items-center justify-center">
							<Tabs
								value={billing}
								onValueChange={(val) => {
									const cycle = val as BillingCycle;
									setBilling(cycle);
									trackLandingPricingToggled(cycle);
								}}
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
					</FadeIn>

					{/* Pricing cards */}
					<div className="mt-12 grid gap-5 lg:grid-cols-3">
						{/* Trial card */}
						<FadeIn delay={160}>
							<div className="relative flex h-full flex-col rounded-2xl border border-border/50 bg-card/60 p-7 transition-colors hover:border-border">
								{/* Name & tagline */}
								<h3 className="text-xl font-bold" style={GABARITO}>
									Free Trial
								</h3>
								<p className="mt-1 text-[13px] text-muted-foreground">
									Explore everything, no strings attached
								</p>

								{/* Price */}
								<div className="mt-5 flex items-baseline gap-1.5">
									<span
										className="text-4xl font-bold tracking-tight"
										style={GABARITO}
									>
										$0
									</span>
									<span className="text-sm text-muted-foreground">
										for 14 days
									</span>
								</div>
								<p className="mt-1 text-[12px] text-muted-foreground">
									No credit card required
								</p>

								{/* CTA */}
								<div className="mt-4">
									<Button
										className="w-full"
										size="default"
										disabled={isLoggedIn}
										{...(isLoggedIn
											? {}
											: {
													render: <Link to="/signup" />,
													nativeButton: false,
												})}
										onClick={() => {
											if (!isLoggedIn)
												trackLandingCtaClicked(
													"start_free_trial",
													"pricing_trial",
												);
										}}
									>
										{isLoggedIn ? "Already signed up" : "Start free trial"}
										{!isLoggedIn && (
											<HugeiconsIcon
												icon={ArrowRight02Icon}
												size={15}
												strokeWidth={2}
											/>
										)}
									</Button>
								</div>

								{/* Divider */}
								<div className="my-6 h-px bg-border/50" />

								{/* Features */}
								<p className="text-[12px] font-semibold tracking-wide text-muted-foreground/70 uppercase">
									What's included
								</p>
								<ul className="mt-3 flex flex-col gap-2.5">
									{TRIAL_FEATURES.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2.5 text-[13.5px]"
										>
											<CheckMark className="text-muted-foreground" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</FadeIn>

						{/* Paid tier cards */}
						{TIERS.map((tier, i) => (
							<FadeIn key={tier.name} delay={i * 100 + 260}>
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

									{/* Popular badge */}
									{tier.popular && (
										<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/20 bg-background px-3.5 py-1 text-[11px] font-semibold text-primary shadow-sm">
											Most popular
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
											/ month
										</span>
									</div>
									<p className="relative mt-1 text-[12px] text-muted-foreground">
										{billing === "monthly"
											? "Billed monthly, after trial"
											: `Billed $${tier.annualPrice * 12}/year, after trial`}
										{billing === "annual" && (
											<span className="absolute top-1/2 ml-1.5 -translate-y-1/2 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
												17% off
											</span>
										)}
									</p>

									{/* CTA */}
									<div className="mt-4">
										<Button
											variant={
												tier.ctaVariant === "default" ? "default" : "outline"
											}
											className="w-full"
											size="default"
											{...(isLoggedIn
												? {
														onClick: () => {
															trackLandingCtaClicked(
																tier.slug,
																`pricing_${tier.slug}`,
															);
															checkout(`${tier.slug}-${billing}`);
														},
													}
												: {
														render: <Link to="/signup" />,
														nativeButton: false,
														onClick: () =>
															trackLandingCtaClicked(
																"get_started",
																`pricing_${tier.slug}`,
															),
													})}
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
					<FadeIn delay={400}>
						<p className="mt-10 text-center text-[13px] text-muted-foreground">
							All prices in USD. All plans include the browser extension,
							end-to-end encryption, and 24/7 uptime.{" "}
							{!isLoggedIn && (
								<Link
									to="/signup"
									className="rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									Start your free trial
								</Link>
							)}
						</p>
					</FadeIn>
				</div>
			</section>
		</>
	);
}
