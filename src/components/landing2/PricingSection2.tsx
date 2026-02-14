import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CheckIcon, FadeIn, HEADING_FONT, SectionLabel } from "./shared";

const PRICING_PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		description: "Perfect for getting started",
		features: [
			"5 folders",
			"100 images",
			"Basic sharing links",
			"1 GB storage",
			"Community support",
		],
		cta: "Get Started",
		popular: false,
	},
	{
		name: "Pro",
		price: "$9",
		period: "/month",
		description: "For serious creatives",
		features: [
			"Unlimited folders",
			"10,000 images",
			"Advanced sharing controls",
			"50 GB storage",
			"Priority support",
			"Analytics dashboard",
			"Custom branding",
		],
		cta: "Start Free Trial",
		popular: true,
	},
	{
		name: "Team",
		price: "$19",
		period: "/member/mo",
		description: "For creative teams",
		features: [
			"Everything in Pro",
			"Team workspaces",
			"Role-based permissions",
			"200 GB storage",
			"Admin dashboard",
			"SSO & security",
			"Dedicated support",
		],
		cta: "Contact Sales",
		popular: false,
	},
];

export function PricingSection2() {
	return (
		<section id="pricing" className="relative py-20 sm:py-28">
			{/* Soft gradient behind pricing */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-0 left-[20%] h-[500px] w-[500px] rounded-full bg-[#c4b5fd]/8 blur-[120px] dark:bg-[#c4b5fd]/[0.03]" />
				<div className="absolute bottom-0 right-[20%] h-[400px] w-[400px] rounded-full bg-[#fecdd3]/8 blur-[100px] dark:bg-[#fecdd3]/[0.025]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Pricing</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Simple, transparent pricing
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Start free. Upgrade when you need more. No hidden fees, ever.
						</p>
					</div>
				</FadeIn>

				<div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
					{PRICING_PLANS.map((plan, i) => (
						<FadeIn key={plan.name} delay={i * 100}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8",
									plan.popular
										? "border-primary/30 bg-card shadow-xl shadow-primary/[0.06] dark:shadow-primary/[0.12]"
										: "border-border/50 bg-card/60 hover:border-border hover:shadow-md",
								)}
							>
								{plan.popular && (
									<div className="absolute -top-3 right-6 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold text-primary-foreground">
										Most Popular
									</div>
								)}

								<div>
									<p className="text-[13px] font-semibold text-muted-foreground">
										{plan.name}
									</p>
									<div className="mt-3 flex items-baseline gap-1">
										<span
											className="text-4xl font-bold tracking-tight"
											style={HEADING_FONT}
										>
											{plan.price}
										</span>
										<span className="text-sm text-muted-foreground">
											{plan.period}
										</span>
									</div>
									<p className="mt-2 text-[13px] text-muted-foreground">
										{plan.description}
									</p>
								</div>

								<Link
									to="/signup"
									className={cn(
										"mt-6 block w-full rounded-xl py-3 text-center text-[14px] font-semibold transition-all",
										plan.popular
											? "bg-foreground text-background hover:opacity-90"
											: "border border-border bg-background text-foreground hover:bg-muted",
									)}
								>
									{plan.cta}
								</Link>

								<ul className="mt-6 flex-1 space-y-3">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2.5 text-[13px] text-muted-foreground"
										>
											<CheckIcon className="mt-0.5" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
