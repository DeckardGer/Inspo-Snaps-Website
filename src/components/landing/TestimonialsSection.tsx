import { FadeIn, GABARITO, SectionBadge } from "./shared";

const ROW_1 = [
	{
		quote:
			"InspoSnaps completely changed how our design team collects references. No more 'where did I save that?' moments.",
		name: "Sarah Chen",
		role: "Design Lead",
		color: "#8b5cf6",
	},
	{
		quote:
			"I've tried Pinterest, Are.na, and Raindrop. InspoSnaps is the first tool that feels built for actual creative workflows.",
		name: "Marcus Rodriguez",
		role: "Art Director",
		color: "#f43f5e",
	},
	{
		quote:
			"The folder system with emojis and colors is genius. My team went from chaos to organized in a single afternoon.",
		name: "Aisha Patel",
		role: "Brand Manager",
		color: "#10b981",
	},
	{
		quote:
			"I shoot thousands of photos per project. InspoSnaps lets me curate the best ones into folders my clients can actually browse through.",
		name: "Tom Blackwell",
		role: "Photographer",
		color: "#f59e0b",
	},
	{
		quote:
			"Finally, a place for all my visual research. Nested folders keep everything organized across projects.",
		name: "James Okafor",
		role: "UX Researcher",
		color: "#ec4899",
	},
] as const;

const ROW_2 = [
	{
		quote:
			"Our whole creative team uses InspoSnaps now. Everyone has their own workspace and sharing folders between us is seamless.",
		name: "Nina Kowalski",
		role: "Creative Director",
		color: "#0ea5e9",
	},
	{
		quote:
			"As a freelancer, having all my inspiration in one place — organized by client — is an absolute game-changer.",
		name: "Liam Foster",
		role: "Freelance Designer",
		color: "#a855f7",
	},
	{
		quote:
			"The UI is beautiful and fast. It actually makes me want to keep my references organized instead of dreading it.",
		name: "Priya Sharma",
		role: "Product Designer",
		color: "#14b8a6",
	},
	{
		quote:
			"I used to screenshot everything and lose it in my camera roll. InspoSnaps solved that problem overnight.",
		name: "David Kim",
		role: "Illustrator",
		color: "#e11d48",
	},
	{
		quote:
			"The nested folder structure mirrors how I actually think about projects. Nothing else comes close.",
		name: "Elena Vasquez",
		role: "Interior Designer",
		color: "#f97316",
	},
] as const;

type Testimonial = (typeof ROW_1)[number] | (typeof ROW_2)[number];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
	return (
		<div className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:w-[340px]">
			<p className="text-[14px] leading-relaxed text-foreground/80">
				&ldquo;{testimonial.quote}&rdquo;
			</p>
			<div className="mt-auto flex items-center gap-3 pt-5">
				<div
					className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
					style={{ backgroundColor: testimonial.color }}
				>
					{testimonial.name
						.split(" ")
						.map((n) => n[0])
						.join("")}
				</div>
				<div>
					<p className="text-[13px] font-semibold">{testimonial.name}</p>
					<p className="text-[11px] text-muted-foreground">
						{testimonial.role}
					</p>
				</div>
			</div>
		</div>
	);
}

function MarqueeRow({
	testimonials,
	reverse = false,
	duration = 40,
}: {
	testimonials: readonly Testimonial[];
	reverse?: boolean;
	duration?: number;
}) {
	return (
		<div
			className="flex w-max gap-5"
			style={{
				animation: `testimonial-scroll ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
			}}
		>
			{[0, 1, 2].map((set) => (
				<div key={set} className="flex shrink-0 gap-5">
					{testimonials.map((t) => (
						<TestimonialCard key={t.name} testimonial={t} />
					))}
				</div>
			))}
		</div>
	);
}

export function TestimonialsSection() {
	return (
		<section className="py-20 sm:py-28">
			<style>
				{`@keyframes testimonial-scroll{from{transform:translateX(0)}to{transform:translateX(calc(-100%/3))}}`}
			</style>

			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionBadge>Testimonials</SectionBadge>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={GABARITO}
						>
							Loved by creatives worldwide
						</h2>
					</div>
				</FadeIn>
			</div>

			<FadeIn delay={100}>
				<div className="mx-auto mt-14 max-w-5xl space-y-5">
					{[
						{ testimonials: ROW_1, duration: 45, reverse: false },
						{ testimonials: ROW_2, duration: 50, reverse: true },
					].map((row) => (
						<div key={row.duration} className="relative overflow-hidden">
							<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
							<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />
							<MarqueeRow
								testimonials={row.testimonials}
								duration={row.duration}
								reverse={row.reverse}
							/>
						</div>
					))}
				</div>
			</FadeIn>
		</section>
	);
}
