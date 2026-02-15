import { type ReactNode, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { FadeIn, GABARITO, SectionBadge } from "./shared";

/* ─── BentoCard Shell ────────────────────────────────────────── */

function BentoCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<div data-bento-card className="group relative h-full rounded-2xl p-px">
			{/* Default border background */}
			<div className="absolute inset-0 rounded-2xl bg-border/60" />

			{/* Mouse-tracking glow overlay — extends beyond border for corner visibility */}
			<div
				className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
				style={{
					background:
						"radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), color-mix(in srgb, var(--primary) 60%, transparent), transparent 40%)",
				}}
			/>

			{/* Card content */}
			<div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-card">
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent"
					aria-hidden
				/>
				<div className="px-5 pt-5 sm:px-6 sm:pt-6">
					<h3
						className="text-[15px] font-bold tracking-tight sm:text-base"
						style={GABARITO}
					>
						{title}
					</h3>
					<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
						{description}
					</p>
				</div>
				<div className="flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-5">
					{children}
				</div>
			</div>
		</div>
	);
}

/* ─── 1. Save from Any Website ───────────────────────────────── */

function SaveFromWebIllustration() {
	return (
		<div
			className="relative mx-auto w-full max-w-[272px] select-none pointer-events-none"
			aria-hidden
		>
			<div className="overflow-hidden rounded-lg border border-border/50 bg-background shadow-lg shadow-black/[0.05] dark:shadow-black/20">
				{/* Browser chrome */}
				<div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-2.5 py-[5px]">
					<div className="flex gap-[5px]">
						<div className="size-[6px] rounded-full bg-[#ff5f57]/60 dark:bg-[#ff5f57]/40" />
						<div className="size-[6px] rounded-full bg-[#febc2e]/60 dark:bg-[#febc2e]/40" />
						<div className="size-[6px] rounded-full bg-[#28c840]/60 dark:bg-[#28c840]/40" />
					</div>
					<div className="flex-1 truncate rounded bg-background/60 px-2 py-[2px] text-[7px] text-muted-foreground/40">
						dribbble.com/shots/popular
					</div>
				</div>

				{/* Content area */}
				<div className="relative px-2 pb-2.5">
					{/* Floating InspoSnaps toolbar */}
					<div className="flex justify-center py-2.5">
						<div className="flex items-center gap-[5px] rounded-full border border-primary/20 bg-background/95 py-[3px] pl-2 pr-[3px] shadow-lg shadow-primary/[0.06] dark:bg-card/95 dark:shadow-primary/[0.12]">
							<svg
								aria-hidden="true"
								className="size-[10px] shrink-0 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
							</svg>
							<span className="whitespace-nowrap text-[7px] font-semibold text-foreground">
								Photography
							</span>
							<svg
								aria-hidden="true"
								className="size-[5px] shrink-0 text-muted-foreground/50"
								viewBox="0 0 6 6"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M1 2L3 4L5 2" />
							</svg>
							<div className="ml-[2px] flex size-[14px] shrink-0 items-center justify-center rounded-full bg-primary">
								<svg
									aria-hidden="true"
									className="size-[7px] text-primary-foreground"
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M13 4.5L6.5 11 3 7.5" />
								</svg>
							</div>
						</div>
					</div>

					{/* Image grid 3×2 */}
					<div className="relative grid grid-cols-3 gap-[5px]">
						{[1, 2, 3, 4, 5, 6].map((n) => (
							<div
								key={n}
								className={cn(
									"relative aspect-[4/3] overflow-hidden rounded",
									n === 4
										? "z-10 scale-105 ring-2 ring-primary shadow-lg shadow-primary/20"
										: "opacity-70",
								)}
							>
								<img
									src={`/landing/mock/${String(n).padStart(2, "0")}.jpg`}
									alt=""
									className="h-full w-full object-cover"
								/>
								{/* Cursor on selected image */}
								{n === 4 && (
									<svg
										aria-hidden="true"
										className="absolute bottom-0.5 right-0.5 size-4 drop-shadow-md"
										viewBox="0 0 24 24"
										fill="white"
										stroke="black"
										strokeWidth="1"
									>
										<path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.86 2.36a.5.5 0 0 0-.36-.15z" />
									</svg>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

/* ─── 2. Folder Customisation ────────────────────────────────── */

const FANNED_FOLDERS = [
	{
		emoji: "🎵",
		bg: "bg-gradient-to-br from-orange-100 to-orange-300/80 dark:from-orange-500 dark:to-orange-700/80 dark:saturate-80",
		fg: "bg-orange-300/70 dark:bg-orange-800/80",
		rotate: -7,
		x: 0,
	},
	{
		emoji: "📸",
		bg: "bg-gradient-to-br from-rose-100 to-rose-300/80 dark:from-rose-500 dark:to-rose-700/80 dark:saturate-80",
		fg: "bg-rose-300/70 dark:bg-rose-800/80",
		rotate: -2,
		x: 48,
	},
	{
		emoji: "🧭",
		bg: "bg-gradient-to-br from-green-100 to-green-300/80 dark:from-green-500 dark:to-green-700/80 dark:saturate-80",
		fg: "bg-green-300/70 dark:bg-green-800/80",
		rotate: 3,
		x: 94,
	},
	{
		emoji: "🎨",
		bg: "bg-gradient-to-br from-indigo-100 to-indigo-300/80 dark:from-indigo-500 dark:to-indigo-700/80 dark:saturate-80",
		fg: "bg-indigo-300/70 dark:bg-indigo-800/80",
		rotate: 7,
		x: 140,
	},
] as const;

function FolderCustomIllustration() {
	return (
		<div
			className="flex items-center justify-center select-none pointer-events-none"
			aria-hidden
		>
			<div className="relative h-[72px] w-[220px]">
				{FANNED_FOLDERS.map((card, i) => (
					<div
						key={card.emoji}
						className={cn(
							"absolute top-1/2 h-[52px] w-[80px] rounded-xl shadow-md",
							card.bg,
						)}
						style={{
							left: card.x,
							transform: `translateY(-50%) rotate(${card.rotate}deg)`,
							zIndex: i,
						}}
					>
						<div className="flex h-full flex-col items-center justify-center">
							<div
								className={cn(
									"flex size-7 items-center justify-center rounded-full",
									card.fg,
								)}
							>
								<span className="text-sm drop-shadow-sm">{card.emoji}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/* ─── 3. Share in One Click ──────────────────────────────────── */

function ShareLinkIllustration() {
	return (
		<div
			className="relative mx-auto w-full max-w-[248px] select-none pointer-events-none"
			aria-hidden
		>
			<div className="space-y-2.5">
				{/* Link field */}
				<div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background px-2.5 py-[7px] shadow-sm">
					<svg
						aria-hidden="true"
						className="size-3 shrink-0 text-muted-foreground/50"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
					</svg>
					<span className="flex-1 truncate text-[8px] text-muted-foreground/60">
						insposnaps.com/s/a8k2xR...
					</span>
					<svg
						aria-hidden="true"
						className="size-2.5 shrink-0 text-muted-foreground/40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect width="14" height="14" x="8" y="8" rx="2" />
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
					</svg>
				</div>

				{/* Success toast */}
				<div className="flex justify-center">
					<div className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-[3px] text-[8px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
						<svg
							aria-hidden="true"
							className="size-2"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M13 4.5L6.5 11 3 7.5" />
						</svg>
						Link copied!
					</div>
				</div>

				{/* Separator */}
				<div className="h-px bg-border/40" />

				{/* Preview card */}
				<div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-background p-2.5 shadow-sm">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-300/80 dark:from-indigo-500/80 dark:to-indigo-700/60">
						<span className="text-sm">🎨</span>
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-[9px] font-semibold text-foreground">
							Design Refs
						</p>
						<p className="text-[7px] text-muted-foreground/60">24 images</p>
					</div>
					<svg
						aria-hidden="true"
						className="size-3 shrink-0 text-muted-foreground/25"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</div>
			</div>
		</div>
	);
}

/* ─── 4. Built for Teams ─────────────────────────────────────── */

const TEAM_AVATARS = [
	{ gradient: "from-rose-400 to-pink-500", initials: "JD" },
	{ gradient: "from-sky-400 to-blue-500", initials: "SK" },
	{ gradient: "from-amber-400 to-orange-500", initials: "AM" },
	{ gradient: "from-emerald-400 to-teal-500", initials: "LW" },
] as const;

const ROLE_BADGES = [
	{
		label: "Owner",
		cls: "bg-primary/10 text-primary border-primary/20",
	},
	{
		label: "Editor",
		cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	},
	{
		label: "Viewer",
		cls: "bg-muted text-muted-foreground border-border/50",
	},
] as const;

function TeamAvatarsIllustration() {
	return (
		<div
			className="flex flex-col items-center gap-3.5 select-none pointer-events-none"
			aria-hidden
		>
			{/* Overlapping avatars */}
			<div className="flex justify-center">
				<div className="flex -space-x-2.5">
					{TEAM_AVATARS.map((avatar, i) => (
						<div
							key={avatar.initials}
							className={cn(
								"flex size-10 items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-card",
								avatar.gradient,
							)}
							style={{ zIndex: TEAM_AVATARS.length - i }}
						>
							<span className="text-[10px] font-bold text-white/90">
								{avatar.initials}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Role badges */}
			<div className="flex items-center gap-1.5">
				{ROLE_BADGES.map((r) => (
					<span
						key={r.label}
						className={cn(
							"rounded-full border px-2 py-[2px] text-[7px] font-semibold",
							r.cls,
						)}
					>
						{r.label}
					</span>
				))}
			</div>
		</div>
	);
}

/* ─── 5. Private by Default ──────────────────────────────────── */

function PrivateByDefaultIllustration() {
	return (
		<div
			className="relative flex items-center justify-center select-none pointer-events-none"
			aria-hidden
		>
			{/* Glow behind lock */}
			<div className="absolute inset-0 flex items-center justify-center translate-y-3">
				<div className="size-20 rounded-full bg-primary/[0.12] blur-xl dark:bg-primary/[0.2]" />
			</div>

			<div className="relative flex flex-col items-center">
				{/* Lock shackle */}
				<div className="relative z-10 mx-auto h-[56px] w-[56px]">
					<div className="absolute inset-x-[5px] top-0 h-full rounded-t-full border-[6px] border-primary/70 border-b-0 dark:border-primary/50" />
				</div>

				{/* Lock body */}
				<div className="relative flex h-[68px] w-[82px] items-center justify-center rounded-xl bg-gradient-to-b from-primary/80 to-primary shadow-lg shadow-primary/20 dark:from-primary/60 dark:to-primary/80 dark:shadow-primary/30">
					{/* Face plate highlight */}
					<div className="absolute inset-x-2 top-2 h-4 rounded-t-lg bg-white/[0.08]" />

					{/* Keyhole */}
					<div className="relative flex flex-col items-center">
						<div className="size-4 rounded-full bg-background/90 dark:bg-background/80" />
						<div className="-mt-[3px] h-3.5 w-[7px] rounded-b-sm bg-background/90 dark:bg-background/80" />
					</div>

					{/* Bottom edge highlight */}
					<div className="absolute inset-x-2 bottom-2 h-px bg-white/[0.06]" />
				</div>
			</div>
		</div>
	);
}

/* ─── 6. Sync Everywhere ─────────────────────────────────────── */

function DeviceSyncIllustration() {
	return (
		<div
			className="flex items-center justify-center gap-3 select-none pointer-events-none"
			aria-hidden
		>
			{/* Laptop — landscape screen */}
			<div className="flex flex-col items-center">
				<div className="w-[120px] overflow-hidden rounded-t-md border border-border/50 bg-background shadow-sm">
					<div className="border-b border-border/30 bg-muted/30 px-1.5 py-[3px]">
						<div className="flex gap-[3px]">
							<div className="size-[4px] rounded-full bg-muted-foreground/20" />
							<div className="size-[4px] rounded-full bg-muted-foreground/20" />
							<div className="size-[4px] rounded-full bg-muted-foreground/20" />
						</div>
					</div>
					<div className="grid grid-cols-3 gap-[2px] p-[3px]">
						{[7, 8, 9, 10, 11, 12].map((n) => (
							<div
								key={n}
								className="aspect-[4/3] overflow-hidden rounded-[2px]"
							>
								<img
									src={`/landing/mock/${String(n).padStart(2, "0")}.jpg`}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
				<div className="h-[4px] w-[136px] rounded-b-sm border-x border-b border-border/40 bg-muted/40" />
			</div>

			{/* Sync arrows — vertically stacked for proper alignment */}
			<div className="flex flex-col items-center gap-1">
				<svg
					aria-hidden="true"
					className="h-2.5 w-7 text-primary"
					viewBox="0 0 28 10"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M0 5h22" />
					<path d="M19 2l4 3-4 3" />
				</svg>
				<svg
					aria-hidden="true"
					className="h-2.5 w-7 text-primary"
					viewBox="0 0 28 10"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M28 5H6" />
					<path d="M9 2L5 5l4 3" />
				</svg>
			</div>

			{/* Phone — portrait screen */}
			<div className="w-[48px] overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
				<div className="flex justify-center py-[3px]">
					<div className="h-[2px] w-4 rounded-full bg-muted-foreground/15" />
				</div>
				<div className="grid grid-cols-2 gap-[2px] px-[3px] pb-[3px]">
					{[7, 8, 9, 10, 11, 12].map((n) => (
						<div
							key={n}
							className="aspect-square overflow-hidden rounded-[2px]"
						>
							<img
								src={`/landing/mock/${String(n).padStart(2, "0")}.jpg`}
								alt=""
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
				<div className="h-[4px]" />
			</div>
		</div>
	);
}

/* ─── Section ────────────────────────────────────────────────── */

export function FeatureShowcase() {
	const gridRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		const cards =
			gridRef.current?.querySelectorAll<HTMLElement>("[data-bento-card]");
		cards?.forEach((card) => {
			const rect = card.getBoundingClientRect();
			card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
			card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
		});
	}, []);

	return (
		<section id="features" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				{/* Section header */}
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionBadge>Features</SectionBadge>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={GABARITO}
						>
							Everything you need, nothing you don't
						</h2>
						<p className="mt-3 text-base text-muted-foreground">
							Powerful tools to capture, organize, and share your visual
							inspiration.
						</p>
					</div>
				</FadeIn>

				{/* Staggered 3-column bento */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: decorative mouse tracking for border glow effect */}
				<div
					ref={gridRef}
					className="group/bento mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3"
					onMouseMove={handleMouseMove}
				>
					{/* Column 1 — 3:2 split */}
					<div className="flex flex-col gap-4">
						<FadeIn className="lg:flex-[3] lg:min-h-0">
							<BentoCard
								title="Save from Any Website"
								description="Browse the web as usual. When something catches your eye, activate the toolbar and click to save — straight to any folder, from any site."
							>
								<SaveFromWebIllustration />
							</BentoCard>
						</FadeIn>
						<FadeIn delay={80} className="lg:flex-[2] lg:min-h-0">
							<BentoCard
								title="Built for Teams"
								description="Create workspaces, invite your team, and assign Viewer or Editor roles to keep everyone in sync."
							>
								<TeamAvatarsIllustration />
							</BentoCard>
						</FadeIn>
					</div>

					{/* Column 2 — 2:3 split */}
					<div className="flex flex-col gap-4">
						<FadeIn delay={100} className="lg:flex-[2] lg:min-h-0">
							<BentoCard
								title="Make It Yours"
								description="Nest folders as deep as you need, pick from 9 colors, and add emojis for instant recognition."
							>
								<FolderCustomIllustration />
							</BentoCard>
						</FadeIn>
						<FadeIn delay={180} className="lg:flex-[3] lg:min-h-0">
							<BentoCard
								title="Share in One Click"
								description="Generate a link to any collection and share it instantly. No sign-up required to view."
							>
								<ShareLinkIllustration />
							</BentoCard>
						</FadeIn>
					</div>

					{/* Column 3 — 3:2 split */}
					<div className="flex flex-col gap-4">
						<FadeIn delay={200} className="lg:flex-[3] lg:min-h-0">
							<BentoCard
								title="Private by Default"
								description="Your collections are yours. Nothing is public unless you explicitly choose to share it."
							>
								<PrivateByDefaultIllustration />
							</BentoCard>
						</FadeIn>
						<FadeIn delay={280} className="lg:flex-[2] lg:min-h-0">
							<BentoCard
								title="Sync Everywhere"
								description="Save on your laptop, browse on your phone. Your collections follow you across every device."
							>
								<DeviceSyncIllustration />
							</BentoCard>
						</FadeIn>
					</div>
				</div>
			</div>
		</section>
	);
}
