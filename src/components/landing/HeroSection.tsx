import {
	ArrowLeft01Icon,
	ArrowRight02Icon,
	CloudUploadIcon,
	Folder01Icon,
	Home07Icon,
	Notification02Icon,
	Share08Icon,
	Sun03Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";
import { FadeIn, GABARITO } from "./shared";

const SIDEBAR_FAVOURITES = [
	{ name: "Photography", emoji: "📸", color: "rose" },
	{ name: "Brand Ideas", emoji: "✨", color: "amber" },
	{ name: "UI Patterns", emoji: "🧩", color: "emerald" },
	{ name: "Mood Boards", emoji: "🎭", color: "sky" },
];

const FAV_COLORS: Record<string, string> = {
	rose: "bg-rose-400/60 dark:bg-rose-500/50",
	amber: "bg-amber-400/60 dark:bg-amber-500/50",
	emerald: "bg-emerald-400/60 dark:bg-emerald-500/50",
	sky: "bg-sky-400/60 dark:bg-sky-500/50",
};

// Curated Unsplash photos — self-hosted small crops (public/landing/mock/)
const MOCK_IMAGES = Array.from(
	{ length: 15 },
	(_, i) => `/landing/mock/${String(i + 1).padStart(2, "0")}.jpg`,
);

export function HeroSection() {
	return (
		<section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-22">
			{/* Aurora mesh gradient */}
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<div className="absolute -top-[250px] -left-[5%] h-[700px] w-[700px] rounded-full bg-[#e535a0]/20 blur-[120px] dark:bg-[#e535a0]/[0.06]" />
				<div className="absolute -top-[150px] right-[10%] h-[600px] w-[600px] rounded-full bg-[#818cf8]/18 blur-[110px] dark:bg-[#818cf8]/[0.05]" />
				<div className="absolute top-[50px] left-[50%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#4f46e5]/14 blur-[120px] dark:bg-[#4f46e5]/[0.05]" />
				<div className="absolute top-[300px] right-[0%] h-[500px] w-[500px] rounded-full bg-[#7c3aed]/10 blur-[100px] dark:bg-[#7c3aed]/[0.04]" />
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
							style={GABARITO}
						>
							Your Inspiration
							<br />
							Deserves Better Than{" "}
							<span className="relative inline-block">
								<span className="bg-gradient-to-r from-[#e535a0] via-[#6b8aff] to-[#3b3ef0] bg-clip-text text-transparent">
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
											<stop stopColor="#e535a0" />
											<stop offset="0.5" stopColor="#6b8aff" />
											<stop offset="1" stopColor="#3b3ef0" />
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
						<div className="mt-9 flex flex-wrap items-center justify-center gap-3">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
							>
								Start Free
								<HugeiconsIcon
									icon={ArrowRight02Icon}
									size={16}
									strokeWidth={2}
								/>
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/50 px-5 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
							>
								See How It Works
							</a>
						</div>
					</FadeIn>
				</div>

				{/* App mockup */}
				<FadeIn delay={380} className="mt-16 sm:mt-20">
					<div className="relative mx-auto max-w-5xl">
						{/* Glow behind mockup */}
						<div
							className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#8b5cf6]/15 via-[#6366f1]/8 to-[#3b82f6]/10 blur-3xl dark:from-[#8b5cf6]/8 dark:via-[#6366f1]/4 dark:to-[#3b82f6]/5"
							aria-hidden
						/>

						<div className="relative select-none overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/[0.06] dark:shadow-black/25">
							{/* Title bar */}
							<div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
								<div className="flex gap-[6px]">
									<div className="size-[10px] rounded-full bg-[#ff5f57]/80" />
									<div className="size-[10px] rounded-full bg-[#febc2e]/80" />
									<div className="size-[10px] rounded-full bg-[#28c840]/80" />
								</div>
								<div className="flex-1 text-center">
									<div className="mx-auto w-52 rounded-md bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground/50">
										insposnaps.com
									</div>
								</div>
								<div className="w-12" />
							</div>

							{/* App content */}
							<div className="flex h-[460px] sm:h-[560px]">
								{/* Sidebar */}
								<div className="hidden w-44 shrink-0 flex-col border-r border-border/30 bg-muted/15 sm:flex">
									<div className="px-3 pt-3.5 pb-2">
										<div className="mb-3 flex items-center gap-2 px-2">
											<BrandLogo size={14} />
											<span className="text-[10px] font-bold" style={GABARITO}>
												InspoSnaps
											</span>
										</div>

										{/* Nav items */}
										{[
											{
												label: "My Folders",
												icon: Folder01Icon,
												active: true,
											},
											{
												label: "Shared Folders",
												icon: Share08Icon,
												active: false,
											},
											{
												label: "Team Folders",
												icon: UserGroupIcon,
												active: false,
											},
										].map((item) => (
											<div
												key={item.label}
												className={cn(
													"flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[10px]",
													item.active
														? "bg-primary/10 font-semibold text-primary"
														: "text-muted-foreground/50",
												)}
											>
												<HugeiconsIcon
													icon={item.icon}
													size={12}
													strokeWidth={2}
												/>
												{item.label}
											</div>
										))}
									</div>

									{/* Favourites */}
									<div className="px-3 pt-2">
										<span className="px-2.5 text-[9px] font-medium tracking-wide text-muted-foreground/40 uppercase">
											Favourites
										</span>
										<div className="mt-1.5 space-y-px">
											{SIDEBAR_FAVOURITES.map((fav) => (
												<div
													key={fav.name}
													className={cn(
														"flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[10px]",
														fav.name === "Photography"
															? "bg-primary/[0.06] font-medium text-foreground/80"
															: "text-muted-foreground/50",
													)}
												>
													<span
														className={cn(
															"size-2 shrink-0 rounded-[3px]",
															FAV_COLORS[fav.color],
														)}
													/>
													<span className="truncate">
														{fav.emoji} {fav.name}
													</span>
												</div>
											))}
										</div>
									</div>

									{/* Footer */}
									<div className="mt-auto border-t border-border/30 px-3 py-2.5">
										<div className="flex items-center gap-2 px-1">
											<div className="size-5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500" />
											<span className="truncate text-[9px] text-muted-foreground/60">
												@sarahdesigns
											</span>
										</div>
									</div>
								</div>

								{/* Main content */}
								<div className="flex flex-1 flex-col">
									{/* Navbar */}
									<div className="flex h-8 shrink-0 items-center justify-between border-b border-border/30 px-3 sm:px-4">
										<div className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
											<HugeiconsIcon
												icon={Home07Icon}
												size={12}
												strokeWidth={2}
												className="text-muted-foreground/40"
											/>
											<span className="mx-0.5">/</span>
											<span>My Folders</span>
											<span className="mx-0.5">/</span>
											<span className="font-medium text-foreground/70">
												Photography
											</span>
										</div>
										<div className="flex items-center gap-1.5 text-muted-foreground/30">
											<HugeiconsIcon
												icon={Notification02Icon}
												size={12}
												strokeWidth={2}
											/>
											<HugeiconsIcon
												icon={Sun03Icon}
												size={12}
												strokeWidth={2}
											/>
										</div>
									</div>

									{/* Toolbar */}
									<div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5">
										<div className="flex items-center gap-2">
											<HugeiconsIcon
												icon={ArrowLeft01Icon}
												size={14}
												strokeWidth={2}
												className="text-muted-foreground/40"
											/>
											<span className="text-[11px] font-semibold text-foreground/80">
												📸 Photography
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-[9px] text-muted-foreground/40">
												89 images
											</span>
											<div className="rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
												+ Add Images
											</div>
										</div>
									</div>

									{/* Image grid */}
									<div className="flex-1 px-3 sm:px-4">
										<div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
											{/* Drop placeholder */}
											<div className="flex h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 sm:h-[128px]">
												<div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
													<HugeiconsIcon
														icon={CloudUploadIcon}
														size={16}
														strokeWidth={1.5}
													/>
												</div>
												<span className="text-[9px] font-medium text-muted-foreground/40">
													Drop images here
												</span>
											</div>

											{/* Image cards */}
											{MOCK_IMAGES.map((src, i) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: Statis array
													key={i}
													className="relative h-[100px] overflow-hidden rounded-xl bg-muted/30 shadow-sm sm:h-[128px]"
												>
													<img
														src={src}
														alt=""
														loading="lazy"
														className="h-full w-full object-cover brightness-[0.92] saturate-[1.15]"
													/>
													<div
														className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]"
														aria-hidden
													/>
												</div>
											))}
										</div>
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
