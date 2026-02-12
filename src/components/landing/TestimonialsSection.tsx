import { generateUserGradient } from "@/lib/utils";
import { GABARITO, Reveal, SectionBadge } from "./shared";

const TESTIMONIALS = [
	{
		name: "Sarah Chen",
		role: "UI Designer",
		handle: "sarah-chen",
		quote:
			"InspoSnaps completely changed how I organize my design references. The nested folders and color coding make it so easy to find exactly what I need mid-project.",
	},
	{
		name: "Marcus Rivera",
		role: "Creative Director",
		handle: "marcus-rivera",
		quote:
			"I used to have inspiration scattered across Pinterest, Are.na, and a dozen browser tabs. Now everything lives in InspoSnaps, and my team can access it too.",
	},
	{
		name: "Aisha Patel",
		role: "Photographer",
		handle: "aisha-patel",
		quote:
			"The sharing feature is a game-changer for client work. I curate reference boards and share them with a single link — no account needed on their end.",
	},
	{
		name: "Tom Eriksson",
		role: "Brand Strategist",
		handle: "tom-eriksson",
		quote:
			"Our team switched from messy shared drives to InspoSnaps. The visual organization is leagues ahead of anything we've tried. It just makes sense.",
	},
];

export function TestimonialsSection() {
	return (
		<section className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				<Reveal className="mx-auto mb-14 max-w-xl text-center">
					<SectionBadge>Testimonials</SectionBadge>
					<h2
						className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
						style={GABARITO}
					>
						Loved by creatives worldwide
					</h2>
				</Reveal>

				<div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
					{TESTIMONIALS.map((t, i) => {
						const g = generateUserGradient(t.handle);
						return (
							<Reveal key={t.name} delay={i * 70}>
								<div className="relative h-full rounded-2xl border border-border/50 bg-card p-6 sm:p-7">
									{/* Decorative quote */}
									<svg
										className="mb-4 size-8 text-primary/10"
										viewBox="0 0 32 32"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
									</svg>

									<p className="mb-6 text-sm leading-relaxed text-muted-foreground">
										&ldquo;{t.quote}&rdquo;
									</p>

									<div className="flex items-center gap-3">
										<div
											className="size-10 rounded-full"
											style={{ background: g.css }}
										/>
										<div>
											<p className="text-sm font-semibold">{t.name}</p>
											<p className="text-xs text-muted-foreground">{t.role}</p>
										</div>
									</div>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
