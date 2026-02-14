import { cn } from "@/lib/utils";
import { FadeIn, HEADING_FONT, SectionLabel } from "./shared";

const TESTIMONIALS = [
	{
		quote:
			"InspoSnaps completely changed how our design team collects references. No more 'where did I save that?' moments.",
		name: "Sarah Chen",
		role: "Design Lead",
		accent: "bg-violet-500",
	},
	{
		quote:
			"I've tried Pinterest, Are.na, and Raindrop. InspoSnaps is the first tool that feels built for actual creative workflows.",
		name: "Marcus Rodriguez",
		role: "Art Director",
		accent: "bg-rose-500",
	},
	{
		quote:
			"The folder system with emojis and colors is genius. My team went from chaos to organized in a single day.",
		name: "Aisha Patel",
		role: "Brand Manager",
		accent: "bg-emerald-500",
	},
	{
		quote:
			"Sharing mood boards with clients used to be painful. Now I just send a link. They love the presentation.",
		name: "Tom Blackwell",
		role: "Photographer",
		accent: "bg-amber-500",
	},
	{
		quote:
			"We switched our entire creative team to InspoSnaps. The collaboration features are exactly what we needed.",
		name: "Nina Kowalski",
		role: "Creative Director",
		accent: "bg-sky-500",
	},
	{
		quote:
			"Finally, a place for all my visual research. Nested folders make it so easy to stay organized across projects.",
		name: "James Okafor",
		role: "UX Researcher",
		accent: "bg-fuchsia-500",
	},
];

export function Testimonials2() {
	return (
		<section className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>Testimonials</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Loved by creatives worldwide
						</h2>
					</div>
				</FadeIn>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{TESTIMONIALS.map((t, i) => (
						<FadeIn key={t.name} delay={i * 70}>
							<div className="relative h-full rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md">
								{/* Colored accent */}
								<div
									className={cn(
										"absolute top-0 left-6 h-[3px] w-10 rounded-b-full",
										t.accent,
									)}
								/>

								{/* Stars */}
								<div className="mb-3 text-[13px] tracking-wide text-amber-400">
									{"★★★★★"}
								</div>

								<p className="text-[14px] leading-relaxed text-foreground/80">
									"{t.quote}"
								</p>

								<div className="mt-5 flex items-center gap-3">
									<div
										className={cn(
											"flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white",
											t.accent,
										)}
									>
										{t.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="text-[13px] font-semibold">{t.name}</p>
										<p className="text-[11px] text-muted-foreground">
											{t.role}
										</p>
									</div>
								</div>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
