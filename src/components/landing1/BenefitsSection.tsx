import {
	CloudUploadIcon,
	Folder01Icon,
	FolderFavouriteIcon,
	ImageAdd02Icon,
	Share08Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GABARITO, Reveal, SectionBadge } from "./shared";

const BENEFITS = [
	{
		icon: Folder01Icon,
		title: "Hierarchical Folders",
		desc: "Nest folders within folders for unlimited depth. Build your own system that mirrors how you actually think.",
	},
	{
		icon: Share08Icon,
		title: "Share Collections",
		desc: "Share curated collections with anyone via a single link. No account required to view.",
	},
	{
		icon: UserGroupIcon,
		title: "Team Collaboration",
		desc: "Invite your team to shared workspaces. Build mood boards and references together.",
	},
	{
		icon: ImageAdd02Icon,
		title: "Beautiful Gallery",
		desc: "View your images in a stunning, responsive gallery with lightbox. Every detail matters.",
	},
	{
		icon: CloudUploadIcon,
		title: "Quick Upload",
		desc: "Drag and drop images or upload in bulk. Get your inspiration organized in seconds.",
	},
	{
		icon: FolderFavouriteIcon,
		title: "Color-Coded & Expressive",
		desc: "Personalize folders with 9 beautiful colors and emojis. Make your collections as vibrant as your ideas.",
	},
];

export function BenefitsSection() {
	return (
		<section id="features" className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				<Reveal className="mx-auto mb-14 max-w-2xl text-center">
					<SectionBadge>Features</SectionBadge>
					<h2
						className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
						style={GABARITO}
					>
						Everything you need to organize your inspiration
					</h2>
					<p className="mt-4 text-base text-muted-foreground sm:text-lg">
						Built for creatives who are tired of losing their best references in
						a sea of screenshots and bookmarks.
					</p>
				</Reveal>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((b, i) => (
						<Reveal key={b.title} delay={i * 70}>
							<div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.06] sm:p-7">
								{/* Hover gradient overlay */}
								<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<div className="relative">
									<div className="mb-5 inline-flex rounded-xl bg-primary/[0.08] p-3">
										<HugeiconsIcon
											icon={b.icon}
											size={22}
											strokeWidth={1.8}
											className="text-primary"
										/>
									</div>
									<h3 className="mb-2 text-[15px] font-semibold">{b.title}</h3>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{b.desc}
									</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
