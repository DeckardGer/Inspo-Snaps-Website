import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckMark, GABARITO, GrainTexture, Reveal, SectionBadge } from "./shared";

const PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		desc: "Perfect for getting started with visual inspiration.",
		features: [
			"5 folders",
			"100 images",
			"Basic sharing via link",
			"Standard gallery view",
			"Community support",
		],
		cta: "Get Started Free",
		featured: false,
	},
	{
		name: "Pro",
		price: "$9",
		period: "/month",
		desc: "For creatives who need more space and power.",
		features: [
			"Unlimited folders",
			"10,000 images",
			"Advanced sharing & permissions",
			"Team collaboration",
			"Bulk upload",
			"Priority support",
		],
		cta: "Start Pro Trial",
		featured: true,
	},
	{
		name: "Team",
		price: "$19",
		period: "/member/mo",
		desc: "For teams building shared visual libraries.",
		features: [
			"Everything in Pro",
			"Team workspaces",
			"Admin controls & roles",
			"Shared team folders",
			"Usage analytics",
			"Dedicated support",
		],
		cta: "Start Team Trial",
		featured: false,
	},
];

export function PricingSection() {
	return (
		<section
			id="pricing"
			className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-24 sm:py-32"
		>
			<GrainTexture />

			<div className="relative mx-auto max-w-7xl px-5 sm:px-8">
				<Reveal className="mx-auto mb-14 max-w-xl text-center">
					<SectionBadge>Pricing</SectionBadge>
					<h2
						className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
						style={GABARITO}
					>
						Simple, Transparent Pricing
					</h2>
					<p className="mt-4 text-base text-muted-foreground sm:text-lg">
						Start free, upgrade when you need more. No hidden fees, no
						surprises.
					</p>
				</Reveal>

				<div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
					{PLANS.map((plan, i) => (
						<Reveal key={plan.name} delay={i * 90}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-shadow duration-300 sm:p-7",
									plan.featured
										? "border-primary/30 shadow-xl shadow-primary/[0.08]"
										: "border-border/50 hover:shadow-lg hover:shadow-primary/[0.04]",
								)}
							>
								{plan.featured && (
									<div className="absolute -top-3 right-5 rounded-full bg-primary px-3.5 py-1 text-[11px] font-bold text-primary-foreground">
										Most Popular
									</div>
								)}

								<div>
									<h3 className="text-sm font-semibold text-muted-foreground">
										{plan.name}
									</h3>
									<div className="mt-3 flex items-baseline gap-1">
										<span
											className="text-4xl font-bold tracking-tight"
											style={GABARITO}
										>
											{plan.price}
										</span>
										<span className="text-sm text-muted-foreground">
											{plan.period}
										</span>
									</div>
									<p className="mt-3 text-[13px] text-muted-foreground">
										{plan.desc}
									</p>
								</div>

								<ul className="mt-6 flex-1 space-y-2.5">
									{plan.features.map((f) => (
										<li
											key={f}
											className="flex items-start gap-2.5 text-[13px]"
										>
											<CheckMark className="mt-0.5 text-primary" />
											<span>{f}</span>
										</li>
									))}
								</ul>

								<div className="mt-8">
									<Button
										variant={plan.featured ? "default" : "outline"}
										className="w-full"
									>
										<Link to="/signup">{plan.cta}</Link>
									</Button>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
