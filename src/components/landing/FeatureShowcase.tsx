import { Home07Icon, Link04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn, generateUserGradient } from "@/lib/utils";
import { CheckMark, FadeIn, GABARITO, SectionBadge } from "./shared";

const MOCK_FOLDERS = [
	{
		name: "Buttons",
		emoji: "🔲",
		bg: "bg-gradient-to-br from-indigo-100 to-indigo-300/80 dark:from-indigo-500 dark:to-indigo-700/80 dark:saturate-80",
		fg: "bg-indigo-300/70 dark:bg-indigo-800/80",
		n: 18,
	},
	{
		name: "Navigation",
		emoji: "🧭",
		bg: "bg-gradient-to-br from-green-100 to-green-300/80 dark:from-green-500 dark:to-green-700/80 dark:saturate-80",
		fg: "bg-green-300/70 dark:bg-green-800/80",
		n: 24,
	},
	{
		name: "Forms",
		emoji: "📝",
		bg: "bg-gradient-to-br from-orange-100 to-orange-300/80 dark:from-orange-500 dark:to-orange-700/80 dark:saturate-80",
		fg: "bg-orange-300/70 dark:bg-orange-800/80",
		n: 11,
	},
	{
		name: "Cards",
		emoji: "🃏",
		bg: "bg-gradient-to-br from-rose-100 to-rose-300/80 dark:from-rose-500 dark:to-rose-700/80 dark:saturate-80",
		fg: "bg-rose-300/70 dark:bg-rose-800/80",
		n: 33,
	},
];

function FoldersMockup() {
	return (
		<div className="relative">
			{/* Glow behind mockup */}
			<div
				className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#818cf8]/12 via-[#6366f1]/6 to-[#4f46e5]/8 blur-2xl dark:from-[#818cf8]/6 dark:via-[#6366f1]/3 dark:to-[#4f46e5]/4"
				aria-hidden
			/>

			<div className="relative select-none overflow-hidden rounded-xl border border-border/50 bg-background shadow-lg shadow-primary/[0.04]">
				{/* Navbar with breadcrumbs */}
				<div className="flex items-center border-b border-border/40 bg-card px-3 py-2 text-[10px] text-muted-foreground">
					<div className="flex items-center gap-1">
						<HugeiconsIcon
							icon={Home07Icon}
							size={12}
							strokeWidth={2}
							className="text-muted-foreground/50"
						/>
						<span className="mx-0.5 text-border">/</span>
						<span>My Folders</span>
						<span className="mx-0.5 text-border">/</span>
						<span>Design</span>
						<span className="mx-0.5 text-border">/</span>
						<span className="font-medium text-foreground">UI Patterns</span>
					</div>
				</div>

				{/* Folder section label */}
				<div className="px-3">
					<span className="text-[10px] font-medium text-muted-foreground">
						Folders
					</span>
				</div>

				{/* Folder grid */}
				<div className="grid grid-cols-2 gap-3 p-3 pt-2">
					{MOCK_FOLDERS.map((f) => (
						<div key={f.name} className="rounded-xl bg-card shadow-md">
							<div
								className={cn(
									"flex h-28 items-center justify-center rounded-xl",
									f.bg,
								)}
							>
								<div
									className={cn(
										"flex size-12 items-center justify-center rounded-full",
										f.fg,
									)}
								>
									<span className="text-xl leading-none">{f.emoji}</span>
								</div>
							</div>
							<div className="m-2">
								<div className="flex items-center justify-between">
									<span className="text-[11px] font-semibold">{f.name}</span>
									<span className="text-[10px] font-medium text-muted-foreground">
										{f.n}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const MOCK_SHARED_USERS = [
	{ name: "Sarah Chen", status: "accepted" },
	{ name: "Aisha Patel", status: "pending" },
];

function SharingMockup() {
	return (
		<div className="relative">
			{/* Glow behind mockup */}
			<div
				className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#e535a0]/10 via-[#8b5cf6]/6 to-[#6366f1]/8 blur-2xl dark:from-[#e535a0]/5 dark:via-[#8b5cf6]/3 dark:to-[#6366f1]/4"
				aria-hidden
			/>

			<div className="relative select-none overflow-hidden rounded-xl border border-border/50 bg-background shadow-lg shadow-primary/[0.04]">
				{/* Dialog header */}
				<div className="px-4 pt-4 pb-3">
					<p className="text-xs font-semibold">Share "Design Refs"</p>
					<p className="mt-0.5 text-[10px] text-muted-foreground">
						Create a link or share with specific users.
					</p>
				</div>

				<div className="space-y-3 px-4 pb-4">
					{/* Generate link section */}
					<div className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-2.5">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
							<HugeiconsIcon icon={Link04Icon} size={14} strokeWidth={2} />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[10px] font-medium">Shareable link</p>
							<p className="text-[9px] text-muted-foreground">
								Generate a read-only link
							</p>
						</div>
						<div className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[9px] font-semibold text-primary-foreground">
							Generate
						</div>
					</div>

					{/* Separator */}
					<div className="h-px bg-border" />

					{/* Invite people */}
					<div>
						<p className="mb-1.5 text-[10px] font-medium">Invite people</p>
						<div className="flex gap-1.5">
							<div className="min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-[9px] text-muted-foreground/50">
								Email or username
							</div>
							<div className="shrink-0 rounded-md bg-primary px-2.5 py-1.5 text-[9px] font-semibold text-primary-foreground">
								Invite
							</div>
						</div>
					</div>

					{/* Shared users */}
					<div>
						<p className="mb-1.5 text-[9px] text-muted-foreground">
							2 people have access
						</p>
						<div className="space-y-1.5">
							{MOCK_SHARED_USERS.map((u) => {
								const g = generateUserGradient(u.name);
								return (
									<div
										key={u.name}
										className="flex items-center gap-2 rounded-lg border p-2"
									>
										<div
											className="size-5 shrink-0 rounded-full"
											style={{ background: g.css }}
										/>
										<span className="min-w-0 flex-1 text-[10px] font-medium">
											{u.name}
										</span>
										<span
											className={cn(
												"rounded-full border px-1.5 py-0.5 text-[8px] font-medium",
												u.status === "accepted"
													? "text-green-500"
													: "text-muted-foreground",
											)}
										>
											{u.status === "accepted" ? "Accepted" : "Pending"}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function FeatureShowcase() {
	return (
		<section id="features" className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				{/* Feature 1 — Smart Organization */}
				<FadeIn className="mb-28">
					<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
						<div className="lg:order-1">
							<SectionBadge>Smart Organization</SectionBadge>
							<h3
								className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl"
								style={GABARITO}
							>
								Folders That Actually
								<br />
								Make Sense
							</h3>
							<p className="mt-4 text-muted-foreground">
								Build your own organizational hierarchy that mirrors how you
								think. Nest folders as deep as you need, personalize with colors
								and emojis, and find anything instantly.
							</p>
							<ul className="mt-6 space-y-3">
								{[
									"Unlimited nesting depth for complex projects",
									"9 beautiful colors to categorize visually",
									"Add emojis for instant recognition",
									"One image can live in multiple folders",
								].map((item) => (
									<li key={item} className="flex items-start gap-3 text-sm">
										<CheckMark className="mt-0.5 text-primary" />
										<span className="text-muted-foreground">{item}</span>
									</li>
								))}
							</ul>
						</div>
						<FadeIn
							direction="left"
							className="mx-auto w-full max-w-[576px] lg:mx-0 lg:order-2"
						>
							<FoldersMockup />
						</FadeIn>
					</div>
				</FadeIn>

				{/* Feature 2 — Collaboration */}
				<FadeIn>
					<div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
						<FadeIn
							direction="right"
							className="order-2 mx-auto w-full max-w-[576px] lg:mx-0 lg:order-1"
						>
							<SharingMockup />
						</FadeIn>
						<div className="order-1 lg:order-2">
							<SectionBadge>Collaboration</SectionBadge>
							<h3
								className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl"
								style={GABARITO}
							>
								Sharing Made
								<br />
								Effortless
							</h3>
							<p className="mt-4 text-muted-foreground">
								Share your curated collections with a single link, or invite
								specific people to collaborate. Control who sees what, and keep
								your creative process flowing.
							</p>
							<ul className="mt-6 space-y-3">
								{[
									"One-click shareable links for any collection",
									"Invite collaborators by username",
									"Granular permission controls",
									"No account needed to view shared links",
								].map((item) => (
									<li key={item} className="flex items-start gap-3 text-sm">
										<CheckMark className="mt-0.5 text-primary" />
										<span className="text-muted-foreground">{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
