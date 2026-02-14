import { Link } from "@tanstack/react-router";
import { Anim, ArrowSvg, H } from "./shared";

const FLOATING_FOLDERS = [
	{ name: "Design Refs", emoji: "🎨", color: "#8b5cf6", count: 24, top: "4%", left: "6%", rot: -5, z: 3, w: 152, delay: 0 },
	{ name: "Photography", emoji: "📸", color: "#f43f5e", count: 89, top: "1%", left: "56%", rot: 3, z: 4, w: 148, delay: 0.4 },
	{ name: "Brand Ideas", emoji: "✨", color: "#f59e0b", count: 12, top: "36%", left: "2%", rot: -3, z: 2, w: 140, delay: 0.8 },
	{ name: "UI Patterns", emoji: "🧩", color: "#10b981", count: 56, top: "32%", left: "50%", rot: 4, z: 5, w: 156, delay: 1.2 },
	{ name: "Typography", emoji: "🔤", color: "#6366f1", count: 31, top: "64%", left: "12%", rot: -2, z: 1, w: 144, delay: 0.6 },
	{ name: "Mood Boards", emoji: "🎭", color: "#0ea5e9", count: 47, top: "60%", left: "58%", rot: 2, z: 3, w: 136, delay: 1.0 },
] as const;

export function Hero3() {
	return (
		<section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
			{/* Warm gradient mesh */}
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<div className="absolute -top-[300px] -left-[100px] h-[700px] w-[700px] rounded-full bg-[#fec6a1]/20 blur-[140px] dark:bg-[#fec6a1]/[0.04]" />
				<div className="absolute -top-[150px] right-[5%] h-[550px] w-[550px] rounded-full bg-[#c4b5fd]/18 blur-[120px] dark:bg-[#c4b5fd]/[0.04]" />
				<div className="absolute top-[100px] left-[35%] h-[450px] w-[450px] rounded-full bg-[#fda4af]/12 blur-[110px] dark:bg-[#fda4af]/[0.03]" />
			</div>

			{/* Dot pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
				aria-hidden
				style={{
					backgroundImage:
						"radial-gradient(circle, currentColor 1px, transparent 1px)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
				{/* Left: Copy */}
				<div>
					<Anim>
						<div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[12px] font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
							</span>
							Loved by 10,000+ creatives
						</div>
					</Anim>

					<Anim delay={80}>
						<h1
							className="text-[2.4rem] leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]"
							style={H}
						>
							Stop Losing Your{" "}
							<span className="bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
								Best Ideas
							</span>
						</h1>
					</Anim>

					<Anim delay={160}>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[17px]">
							Your visual inspiration is scattered across bookmarks,
							screenshots, and messy folders. InspoSnaps brings it all
							into one beautiful, organized space.
						</p>
					</Anim>

					<Anim delay={240}>
						<div className="mt-8 flex flex-wrap items-center gap-3.5">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Start Free <ArrowSvg />
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-6 py-3.5 text-[14px] font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
							>
								See How It Works
							</a>
						</div>
					</Anim>

					<Anim delay={340}>
						<div className="mt-8 flex flex-wrap items-center gap-5 text-[12px] font-medium text-muted-foreground/60">
							<span>10K+ Creatives</span>
							<span className="h-3 w-px bg-border" />
							<span>50K+ Folders</span>
							<span className="h-3 w-px bg-border" />
							<span>1M+ Images</span>
						</div>
					</Anim>
				</div>

				{/* Right: Floating folder cards (desktop) */}
				<Anim delay={300} className="hidden lg:block">
					<div className="relative h-[440px]">
						{FLOATING_FOLDERS.map((f, i) => (
							<div
								key={f.name}
								className="absolute"
								style={{
									top: f.top,
									left: f.left,
									width: f.w,
									zIndex: f.z,
									animation: `l3-float-${i % 2 === 0 ? "a" : "b"} ${6 + i * 0.4}s ease-in-out infinite`,
									animationDelay: `${f.delay}s`,
								}}
							>
								<div
									className="overflow-hidden rounded-xl border border-border/50 bg-card/90 shadow-lg shadow-black/[0.04] backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:shadow-black/20"
									style={{
										transform: `rotate(${f.rot}deg)`,
									}}
								>
									<div
										className="h-[3px]"
										style={{ backgroundColor: f.color }}
									/>
									<div className="p-3">
										<span className="text-lg leading-none">
											{f.emoji}
										</span>
										<p
											className="mt-1.5 truncate text-[11px] font-semibold"
											style={H}
										>
											{f.name}
										</p>
										<p className="text-[10px] text-muted-foreground/60">
											{f.count} images
										</p>
									</div>
								</div>
							</div>
						))}
						{/* Ambient glow */}
						<div
							className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[80px] dark:bg-primary/[0.03]"
							aria-hidden
						/>
					</div>
				</Anim>

				{/* Mobile: compact folder grid */}
				<Anim delay={300} className="lg:hidden">
					<div className="grid grid-cols-3 gap-2.5">
						{FLOATING_FOLDERS.map((f) => (
							<div
								key={f.name}
								className="overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-sm"
							>
								<div
									className="h-[3px]"
									style={{ backgroundColor: f.color }}
								/>
								<div className="p-2.5">
									<span className="text-base">{f.emoji}</span>
									<p
										className="mt-1 truncate text-[10px] font-semibold"
										style={H}
									>
										{f.name}
									</p>
									<p className="text-[9px] text-muted-foreground/50">
										{f.count} imgs
									</p>
								</div>
							</div>
						))}
					</div>
				</Anim>
			</div>
		</section>
	);
}
