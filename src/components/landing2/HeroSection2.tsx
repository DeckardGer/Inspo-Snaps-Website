import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";
import { ArrowIcon, FadeIn, HEADING_FONT } from "./shared";

const HERO_FOLDERS = [
	{ name: "Design Refs", emoji: "🎨", color: "#8b5cf6", images: 24 },
	{ name: "Photography", emoji: "📸", color: "#f43f5e", images: 89 },
	{ name: "Brand Ideas", emoji: "✨", color: "#f59e0b", images: 12 },
	{ name: "UI Patterns", emoji: "🧩", color: "#10b981", images: 56 },
	{ name: "Typography", emoji: "🔤", color: "#6366f1", images: 31 },
	{ name: "Mood Boards", emoji: "🎭", color: "#0ea5e9", images: 47 },
];

export function HeroSection2() {
	return (
		<section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
			{/* Aurora mesh gradient */}
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<div className="absolute -top-[300px] left-[10%] h-[700px] w-[700px] rounded-full bg-[#fecdd3]/25 blur-[120px] dark:bg-[#fecdd3]/[0.06]" />
				<div className="absolute -top-[200px] right-[15%] h-[600px] w-[600px] rounded-full bg-[#c4b5fd]/20 blur-[100px] dark:bg-[#c4b5fd]/[0.05]" />
				<div className="absolute top-[100px] left-[40%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#fed7aa]/18 blur-[110px] dark:bg-[#fed7aa]/[0.04]" />
				<div className="absolute top-[350px] right-[5%] h-[400px] w-[400px] rounded-full bg-[#bfdbfe]/12 blur-[90px] dark:bg-[#bfdbfe]/[0.03]" />
			</div>

			{/* Grid pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
				aria-hidden
				style={{
					backgroundImage:
						"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-5 sm:px-8">
				<div className="mx-auto max-w-3xl text-center">
					{/* Social proof pill */}
					<FadeIn>
						<div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-[12px] font-medium text-muted-foreground shadow-xs backdrop-blur-sm">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
							</span>
							Loved by 10,000+ creatives worldwide
						</div>
					</FadeIn>

					{/* Headline */}
					<FadeIn delay={80}>
						<h1
							className="text-[2.5rem] leading-[1.08] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
							style={HEADING_FONT}
						>
							Your Inspiration
							<br />
							<span className="relative">
								Deserves Better Than{" "}
								<span className="bg-gradient-to-r from-[#f43f5e] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
									Bookmarks
								</span>
								<svg
									className="absolute -bottom-1.5 left-0 w-full"
									viewBox="0 0 400 10"
									fill="none"
									aria-hidden
									preserveAspectRatio="none"
								>
									<title>Underline</title>
									<path
										d="M4 7C100 3 300 3 396 7"
										stroke="url(#hero-underline)"
										strokeWidth="3"
										strokeLinecap="round"
									/>
									<defs>
										<linearGradient
											id="hero-underline"
											x1="0"
											y1="0"
											x2="400"
											y2="0"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#f43f5e" />
											<stop offset="0.5" stopColor="#8b5cf6" />
											<stop offset="1" stopColor="#3b82f6" />
										</linearGradient>
									</defs>
								</svg>
							</span>
						</h1>
					</FadeIn>

					{/* Subtitle */}
					<FadeIn delay={160}>
						<p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
							Stop losing creative references in cluttered folders and forgotten
							tabs. Organize, curate, and share visual inspiration in beautiful
							collections.
						</p>
					</FadeIn>

					{/* CTAs */}
					<FadeIn delay={240}>
						<div className="mt-9 flex flex-wrap items-center justify-center gap-4">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-xl bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Start Free
								<ArrowIcon />
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/50 px-7 py-3.5 text-[15px] font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
							>
								See How It Works
							</a>
						</div>
					</FadeIn>
				</div>

				{/* App mockup */}
				<FadeIn delay={380} className="mt-16 sm:mt-20">
					<div className="relative mx-auto max-w-4xl">
						{/* Glow behind mockup */}
						<div
							className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#8b5cf6]/15 via-[#6366f1]/8 to-[#3b82f6]/10 blur-3xl dark:from-[#8b5cf6]/8 dark:via-[#6366f1]/4 dark:to-[#3b82f6]/5"
							aria-hidden
						/>

						<div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/[0.06] dark:shadow-black/25">
							{/* Title bar */}
							<div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
								<div className="flex gap-[6px]">
									<div className="size-[10px] rounded-full bg-[#ff5f57]/80" />
									<div className="size-[10px] rounded-full bg-[#febc2e]/80" />
									<div className="size-[10px] rounded-full bg-[#28c840]/80" />
								</div>
								<div className="flex-1 text-center">
									<div className="mx-auto w-52 rounded-md bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground/50">
										app.insposnaps.com
									</div>
								</div>
								<div className="w-12" />
							</div>

							{/* App content */}
							<div className="flex min-h-[280px] sm:min-h-[320px]">
								{/* Sidebar */}
								<div className="hidden w-44 shrink-0 border-r border-border/30 bg-muted/15 px-3 py-4 sm:block">
									<div className="mb-4 flex items-center gap-2 px-2">
										<BrandLogo size={14} />
										<span
											className="text-[10px] font-bold"
											style={HEADING_FONT}
										>
											InspoSnaps
										</span>
									</div>
									{[
										"My Folders",
										"Shared With Me",
										"Team Folders",
										"Favourites",
									].map((item, i) => (
										<div
											key={item}
											className={cn(
												"rounded-md px-2.5 py-[5px] text-[10px]",
												i === 0
													? "bg-primary/10 font-semibold text-primary"
													: "text-muted-foreground/50",
											)}
										>
											{item}
										</div>
									))}
								</div>

								{/* Folder grid */}
								<div className="flex-1 p-4 sm:p-5">
									<div className="mb-3 flex items-center justify-between">
										<span className="text-[11px] font-semibold text-foreground/60">
											My Folders
										</span>
										<div className="rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
											+ New Folder
										</div>
									</div>
									<div className="grid grid-cols-3 gap-2 sm:gap-2.5">
										{HERO_FOLDERS.map((folder) => (
											<div
												key={folder.name}
												className="group overflow-hidden rounded-lg border border-border/30 bg-background/70 transition-all hover:border-border/60 hover:shadow-sm"
											>
												<div
													className="h-[3px]"
													style={{ backgroundColor: folder.color }}
												/>
												<div className="p-2 sm:p-2.5">
													<span className="text-sm leading-none">
														{folder.emoji}
													</span>
													<p className="mt-1 truncate text-[9px] font-semibold leading-tight sm:text-[10px]">
														{folder.name}
													</p>
													<p className="text-[8px] text-muted-foreground/50 sm:text-[9px]">
														{folder.images} images
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Shadow below */}
						<div
							className="absolute -bottom-6 left-1/2 h-12 w-4/5 -translate-x-1/2 rounded-full bg-black/[0.04] blur-2xl dark:bg-white/[0.03]"
							aria-hidden
						/>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
