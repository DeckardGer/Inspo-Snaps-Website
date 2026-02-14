import { Anim, H, Tag } from "./shared";

const TESTIMONIALS = [
	{
		quote: "InspoSnaps completely changed how our design team collects references. No more 'where did I save that?' moments.",
		name: "Sarah Chen",
		role: "Design Lead",
		color: "#8b5cf6",
	},
	{
		quote: "I've tried Pinterest, Are.na, and Raindrop. InspoSnaps is the first tool that feels built for actual creative workflows.",
		name: "Marcus Rodriguez",
		role: "Art Director",
		color: "#f43f5e",
	},
	{
		quote: "The folder system with emojis and colors is genius. My team went from chaos to organized in a single afternoon.",
		name: "Aisha Patel",
		role: "Brand Manager",
		color: "#10b981",
	},
	{
		quote: "Sharing mood boards with clients used to be painful. Now I just send a link and they love the presentation.",
		name: "Tom Blackwell",
		role: "Photographer",
		color: "#f59e0b",
	},
	{
		quote: "We switched our entire creative team to InspoSnaps. The collaboration features are exactly what we needed.",
		name: "Nina Kowalski",
		role: "Creative Director",
		color: "#0ea5e9",
	},
	{
		quote: "Finally, a place for all my visual research. Nested folders make it easy to stay organized across projects.",
		name: "James Okafor",
		role: "UX Researcher",
		color: "#ec4899",
	},
] as const;

export function Testimonials3() {
	return (
		<section className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>Testimonials</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Loved by creatives worldwide
						</h2>
					</div>
				</Anim>
			</div>

			<Anim delay={100}>
				<div className="relative mt-14">
					<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
					<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />

					<div className="l3-no-scrollbar flex gap-5 overflow-x-auto px-5 pb-2 sm:px-8">
						{TESTIMONIALS.map((t) => (
							<div
								key={t.name}
								className="w-[300px] shrink-0 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md sm:w-[340px]"
							>
								<div className="mb-3 text-[13px] tracking-wider text-amber-400">
									{"★★★★★"}
								</div>
								<p className="text-[14px] leading-relaxed text-foreground/80">
									&ldquo;{t.quote}&rdquo;
								</p>
								<div className="mt-5 flex items-center gap-3">
									<div
										className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
										style={{
											backgroundColor: t.color,
										}}
									>
										{t.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="text-[13px] font-semibold">
											{t.name}
										</p>
										<p className="text-[11px] text-muted-foreground">
											{t.role}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</Anim>
		</section>
	);
}
