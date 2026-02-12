import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateUserGradient } from "@/lib/utils";
import { GABARITO, Reveal } from "./shared";

function AppMockup() {
	const folders = [
		{ name: "Design Refs", emoji: "🎨", color: "bg-indigo-500", count: 24 },
		{ name: "Photography", emoji: "📸", color: "bg-rose-500", count: 89 },
		{ name: "Brand Ideas", emoji: "✨", color: "bg-amber-500", count: 12 },
		{
			name: "UI Patterns",
			emoji: "🧩",
			color: "bg-emerald-500",
			count: 56,
		},
		{
			name: "Typography",
			emoji: "🔤",
			color: "bg-violet-500",
			count: 31,
		},
		{
			name: "Mood Boards",
			emoji: "🎭",
			color: "bg-sky-500",
			count: 47,
		},
	];

	const sidebarItems = [
		{ label: "My Folders", active: true },
		{ label: "Shared With Me", active: false },
		{ label: "Team Folders", active: false },
		{ label: "Favourites", active: false },
	];

	return (
		<div className="relative">
			{/* Ambient glow */}
			<div className="absolute -inset-10 rounded-3xl bg-gradient-to-br from-[#8098f9]/20 via-[#6172f3]/10 to-[#444ce7]/10 blur-3xl" />

			<div
				className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/[0.07]"
				style={{
					transform: "perspective(2400px) rotateY(-2deg) rotateX(1.5deg)",
				}}
			>
				{/* Titlebar */}
				<div className="flex items-center border-b border-border/50 bg-muted/40 px-4 py-2.5">
					<div className="flex gap-[6px]">
						<div className="size-[10px] rounded-full bg-[#ff5f57]" />
						<div className="size-[10px] rounded-full bg-[#febc2e]" />
						<div className="size-[10px] rounded-full bg-[#28c840]" />
					</div>
					<div className="flex-1 text-center text-[11px] font-medium text-muted-foreground/70">
						InspoSnaps
					</div>
				</div>

				<div className="flex min-h-[260px]">
					{/* Sidebar */}
					<div className="hidden w-40 shrink-0 border-r border-border/40 bg-muted/20 px-3 py-3 sm:block">
						<div className="space-y-0.5">
							{sidebarItems.map((item) => (
								<div
									key={item.label}
									className={cn(
										"rounded-md px-2.5 py-[6px] text-[11px] transition-colors",
										item.active
											? "bg-primary/10 font-semibold text-primary"
											: "text-muted-foreground/70",
									)}
								>
									{item.label}
								</div>
							))}
						</div>
					</div>

					{/* Content grid */}
					<div className="flex-1 p-3 sm:p-4">
						<div className="grid grid-cols-3 gap-2">
							{folders.map((f) => (
								<div
									key={f.name}
									className="overflow-hidden rounded-[10px] border border-border/40 bg-background/80 transition-shadow hover:shadow-md"
								>
									<div className={cn("h-[5px]", f.color)} />
									<div className="px-2 pt-1.5 pb-2">
										<span className="text-sm leading-none">{f.emoji}</span>
										<p className="mt-1 truncate text-[10px] font-semibold leading-tight">
											{f.name}
										</p>
										<p className="text-[9px] text-muted-foreground">
											{f.count} images
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function HeroSection() {
	const avatarNames = ["elena", "james", "priya", "oscar", "mika"];

	return (
		<section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
			{/* Background */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-0 left-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-gradient-to-b from-[#8098f9]/[0.12] via-[#6172f3]/[0.06] to-transparent blur-[80px]" />
				<div className="absolute top-32 right-0 size-[420px] rounded-full bg-[#444ce7]/[0.04] blur-[60px]" />
				{/* Dot grid */}
				<div
					className="absolute inset-0 opacity-30 dark:opacity-20"
					style={{
						backgroundImage:
							"radial-gradient(circle, oklch(0.51 0.23 277 / 0.1) 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>
				{/* Floating decorative shapes */}
				<div
					className="absolute top-36 right-[12%] h-14 w-10 rotate-12 rounded-lg bg-[#8098f9]/[0.08]"
					style={{ animation: "float 6s ease-in-out infinite" }}
				/>
				<div
					className="absolute top-52 left-[8%] h-10 w-14 -rotate-6 rounded-lg bg-[#6172f3]/[0.06]"
					style={{
						animation: "float 8s ease-in-out infinite 1s",
					}}
				/>
			</div>

			<div className="relative mx-auto max-w-7xl px-5 sm:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Copy */}
					<div className="max-w-xl">
						{/* Social proof pill */}
						<Reveal>
							<div className="mb-7 inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/80 py-1.5 pr-4 pl-1.5 shadow-xs backdrop-blur-sm">
								<div className="flex -space-x-2">
									{avatarNames.map((name) => {
										const g = generateUserGradient(name);
										return (
											<div
												key={name}
												className="size-7 rounded-full border-2 border-card"
												style={{ background: g.css }}
											/>
										);
									})}
								</div>
								<span className="text-xs text-muted-foreground">
									Loved by{" "}
									<span className="font-semibold text-foreground">1,000+</span>{" "}
									creatives
								</span>
							</div>
						</Reveal>

						{/* Headline */}
						<Reveal delay={80}>
							<h1
								className="text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
								style={GABARITO}
							>
								Your Inspiration
								<br />
								<span className="bg-gradient-to-r from-[#444ce7] to-[#8098f9] bg-clip-text text-transparent">
									Deserves a Home
								</span>
							</h1>
						</Reveal>

						{/* Sub */}
						<Reveal delay={160}>
							<p className="mt-5 text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
								Stop losing creative references in cluttered folders and
								forgotten bookmarks. Organize, curate, and share visual
								inspiration in beautiful collections.
							</p>
						</Reveal>

						{/* CTAs */}
						<Reveal delay={240}>
							<div className="mt-8 flex flex-wrap items-center gap-4">
								<Button size="lg" className="h-12 gap-2 px-6 text-[15px]">
									<Link to="/signup">Start Organizing — It's Free</Link>
									<svg
										className="size-4"
										viewBox="0 0 16 16"
										fill="none"
										aria-hidden="true"
									>
										<path
											d="M3 8h10m0 0l-4-4m4 4l-4 4"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</Button>
								<a
									href="#how-it-works"
									className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									See How It Works
									<HugeiconsIcon
										icon={ArrowDown01Icon}
										size={16}
										strokeWidth={2}
										className="transition-transform group-hover:translate-y-0.5"
									/>
								</a>
							</div>
						</Reveal>
					</div>

					{/* Mockup */}
					<Reveal delay={320} className="lg:pl-4">
						<AppMockup />
					</Reveal>
				</div>
			</div>
		</section>
	);
}
