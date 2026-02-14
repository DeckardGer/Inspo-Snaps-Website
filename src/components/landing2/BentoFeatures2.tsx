import { cn } from "@/lib/utils";
import { FadeIn, HEADING_FONT, SectionLabel } from "./shared";

const BENEFITS = [
	{
		title: "Smart Folders",
		description:
			"Organize with custom colors, emojis, and infinitely nested hierarchy. Find anything in seconds.",
		icon: "🎨",
		gradient: "from-violet-500/20 to-indigo-500/20",
		large: true,
	},
	{
		title: "Instant Sharing",
		description:
			"Share any collection with a single link. Control access and permissions with ease.",
		icon: "🔗",
		gradient: "from-rose-500/20 to-orange-500/20",
		large: false,
	},
	{
		title: "Team Workspaces",
		description:
			"Collaborate in real-time with shared folders, permissions, and activity feeds.",
		icon: "👥",
		gradient: "from-emerald-500/20 to-teal-500/20",
		large: false,
	},
	{
		title: "Beautiful Gallery",
		description:
			"Every collection looks stunning. Multiple view modes including masonry, grid, and slideshow.",
		icon: "💎",
		gradient: "from-amber-500/20 to-yellow-500/20",
		large: true,
	},
	{
		title: "Cross-Device Sync",
		description:
			"Access your inspiration anywhere — desktop, tablet, or phone. Always in sync.",
		icon: "📱",
		gradient: "from-sky-500/20 to-cyan-500/20",
		large: false,
	},
	{
		title: "Visual Search",
		description:
			"Find images by color, tag, or visual similarity. AI-powered discovery that learns your taste.",
		icon: "🔍",
		gradient: "from-fuchsia-500/20 to-pink-500/20",
		large: true,
	},
];

export function BentoFeatures() {
	return (
		<section id="features" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.025] blur-[100px]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Features</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Everything you need to stay inspired
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Powerful tools that make organizing visual inspiration feel
							effortless.
						</p>
					</div>
				</FadeIn>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((item, i) => (
						<FadeIn
							key={item.title}
							delay={i * 70}
							className={cn(item.large && "lg:col-span-2")}
						>
							<div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg sm:p-8">
								{/* Gradient accent */}
								<div
									className={cn(
										"absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70",
										item.gradient,
									)}
									aria-hidden
								/>

								<div className="relative">
									<span className="text-3xl">{item.icon}</span>
									<h3
										className="mt-4 text-lg font-bold"
										style={HEADING_FONT}
									>
										{item.title}
									</h3>
									<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
