import { cn } from "@/lib/utils";
import { Anim, H, Tag } from "./shared";

const BENEFITS = [
	{
		title: "Smart Folders",
		desc: "Organize with custom colors, emojis, and infinitely nested folders. Your system, your way.",
		icon: "📂",
		accent: "from-violet-500/20 to-indigo-500/10",
		span: 2,
	},
	{
		title: "One-Click Sharing",
		desc: "Generate a link and share any collection instantly. Control who sees what.",
		icon: "🔗",
		accent: "from-rose-500/20 to-orange-400/10",
		span: 1,
	},
	{
		title: "Team Workspaces",
		desc: "Collaborate in real-time with shared folders, permissions, and activity tracking.",
		icon: "👥",
		accent: "from-emerald-500/20 to-teal-400/10",
		span: 1,
	},
	{
		title: "Beautiful Gallery",
		desc: "Every collection looks stunning with masonry, grid, and slideshow view modes.",
		icon: "💎",
		accent: "from-amber-500/20 to-yellow-400/10",
		span: 2,
	},
	{
		title: "Works Everywhere",
		desc: "Desktop, tablet, or phone — your collections stay in sync across every device.",
		icon: "📱",
		accent: "from-sky-500/20 to-cyan-400/10",
		span: 1,
	},
	{
		title: "Visual Search",
		desc: "Find images by color, tag, or visual similarity. AI-powered discovery that learns your taste.",
		icon: "🔍",
		accent: "from-pink-500/20 to-fuchsia-400/10",
		span: 2,
	},
] as const;

export function Bento3() {
	return (
		<section id="features" className="relative py-20 sm:py-28">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fec6a1]/[0.04] blur-[100px] dark:bg-[#fec6a1]/[0.02]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Features</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Everything you need to stay inspired
						</h2>
						<p className="mt-4 text-base text-muted-foreground sm:text-lg">
							Powerful yet simple tools that make organizing visual
							inspiration feel effortless.
						</p>
					</div>
				</Anim>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((b, i) => (
						<Anim
							key={b.title}
							delay={i * 70}
							className={cn(b.span === 2 && "lg:col-span-2")}
						>
							<div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg sm:p-7">
								<div
									className={cn(
										"absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-80",
										b.accent,
									)}
									aria-hidden
								/>
								<div className="relative">
									<span className="text-3xl">{b.icon}</span>
									<h3
										className="mt-4 text-[17px] font-bold"
										style={H}
									>
										{b.title}
									</h3>
									<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
										{b.desc}
									</p>
								</div>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}
