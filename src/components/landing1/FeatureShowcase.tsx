import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn, generateUserGradient } from "@/lib/utils";
import { CheckMark, GABARITO, Reveal, SectionBadge } from "./shared";

function FoldersMockup() {
	const crumbs = ["My Folders", "Design", "UI Patterns"];
	const items = [
		{ name: "Buttons", emoji: "🔲", color: "bg-indigo-500", n: 18 },
		{ name: "Navigation", emoji: "🧭", color: "bg-emerald-500", n: 24 },
		{ name: "Forms", emoji: "📝", color: "bg-amber-500", n: 11 },
		{ name: "Cards", emoji: "🃏", color: "bg-rose-500", n: 33 },
	];

	return (
		<div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-lg shadow-primary/[0.04]">
			<div className="flex items-center gap-1 border-b border-border/40 px-4 py-2.5 text-[11px] text-muted-foreground">
				{crumbs.map((c, i) => (
					<span key={c} className="flex items-center gap-1">
						{i > 0 && <span className="mx-1 text-border">/</span>}
						<span
							className={
								i === crumbs.length - 1 ? "font-semibold text-foreground" : ""
							}
						>
							{c}
						</span>
					</span>
				))}
			</div>
			<div className="grid grid-cols-2 gap-2.5 p-4">
				{items.map((f) => (
					<div
						key={f.name}
						className="overflow-hidden rounded-[10px] border border-border/40 bg-background transition-shadow hover:shadow-md"
					>
						<div className={cn("h-[5px]", f.color)} />
						<div className="p-2.5">
							<span className="text-base leading-none">{f.emoji}</span>
							<p className="mt-1 text-xs font-semibold">{f.name}</p>
							<p className="text-[10px] text-muted-foreground">{f.n} images</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function SharingMockup() {
	const people = ["sarah", "marcus", "aisha"];

	return (
		<div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-lg shadow-primary/[0.04]">
			<div className="border-b border-border/40 px-4 py-3">
				<p className="text-xs font-semibold">Share "Design Refs"</p>
			</div>
			<div className="space-y-4 p-4">
				{/* Link section */}
				<div className="rounded-lg border border-border/40 bg-muted/30 p-3">
					<div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
						<HugeiconsIcon
							icon={LinkSquare02Icon}
							size={14}
							strokeWidth={2}
							className="text-primary"
						/>
						Share via link
					</div>
					<div className="flex gap-2">
						<div className="min-w-0 flex-1 truncate rounded-md border border-border/50 bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground">
							insposnaps.com/s/d3s1gn-r3fs...
						</div>
						<div className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground">
							Copy
						</div>
					</div>
				</div>

				{/* People */}
				<div>
					<p className="mb-2 text-[11px] font-semibold text-muted-foreground">
						Shared with
					</p>
					<div className="space-y-2">
						{people.map((u) => {
							const g = generateUserGradient(u);
							return (
								<div key={u} className="flex items-center gap-2.5 rounded-md">
									<div
										className="size-6 rounded-full"
										style={{ background: g.css }}
									/>
									<span className="flex-1 text-[11px] font-medium capitalize">
										{u}
									</span>
									<span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
										Can view
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export function FeatureShowcase() {
	return (
		<section className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				{/* Feature 1 */}
				<Reveal className="mb-28">
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						<div className="order-2 lg:order-1">
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
						<div className="order-1 lg:order-2">
							<FoldersMockup />
						</div>
					</div>
				</Reveal>

				{/* Feature 2 */}
				<Reveal>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						<div>
							<SharingMockup />
						</div>
						<div>
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
				</Reveal>
			</div>
		</section>
	);
}
