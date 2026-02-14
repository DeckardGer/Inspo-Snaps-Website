import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Anim, H, Tag, TickSvg } from "./shared";

const PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		desc: "Get started and explore",
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
		desc: "For serious creatives",
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
		desc: "For creative teams",
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
] as const;

export function Pricing3() {
	return (
		<section id="pricing" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-0 left-[15%] h-[500px] w-[500px] rounded-full bg-[#fec6a1]/[0.05] blur-[120px] dark:bg-[#fec6a1]/[0.02]" />
				<div className="absolute bottom-0 right-[15%] h-[400px] w-[400px] rounded-full bg-[#c4b5fd]/[0.05] blur-[100px] dark:bg-[#c4b5fd]/[0.02]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Pricing</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Simple, transparent pricing
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Start free. Upgrade when you need more. No surprises.
						</p>
					</div>
				</Anim>

				<div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
					{PLANS.map((p, i) => (
						<Anim key={p.name} delay={i * 100}>
							<div
								className={cn(
									"relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8",
									p.popular
										? "scale-[1.02] border-primary/30 bg-card shadow-xl shadow-primary/[0.06] dark:shadow-primary/[0.1]"
										: "border-border/50 bg-card/60 hover:border-border hover:shadow-md",
								)}
							>
								{p.popular && (
									<div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-[#f97316] to-[#ec4899] px-4 py-1 text-[11px] font-semibold text-white shadow-sm">
										Most Popular
									</div>
								)}

								<div>
									<p className="text-[13px] font-semibold text-muted-foreground">
										{p.name}
									</p>
									<div className="mt-3 flex items-baseline gap-1">
										<span
											className="text-4xl font-bold tracking-tight"
											style={H}
										>
											{p.price}
										</span>
										<span className="text-sm text-muted-foreground">
											{p.period}
										</span>
									</div>
									<p className="mt-2 text-[13px] text-muted-foreground">
										{p.desc}
									</p>
								</div>

								<Link
									to="/signup"
									className={cn(
										"mt-6 block w-full rounded-full py-3 text-center text-[14px] font-semibold transition-all",
										p.popular
											? "bg-foreground text-background hover:opacity-90"
											: "border border-border bg-background text-foreground hover:bg-muted",
									)}
								>
									{p.cta}
								</Link>

								<ul className="mt-6 flex-1 space-y-3">
									{p.features.map((f) => (
										<li
											key={f}
											className="flex items-start gap-2.5 text-[13px] text-muted-foreground"
										>
											<TickSvg className="mt-0.5" />
											{f}
										</li>
									))}
								</ul>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}
