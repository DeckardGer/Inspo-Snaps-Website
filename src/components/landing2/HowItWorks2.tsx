import { FadeIn, HEADING_FONT, SectionLabel } from "./shared";

const STEPS = [
	{
		number: "01",
		title: "Upload",
		description:
			"Drag and drop your images, screenshots, and visual references. All major formats supported.",
	},
	{
		number: "02",
		title: "Organize",
		description:
			"Create folders with custom colors and emojis. Nest them however you like — your system, your rules.",
	},
	{
		number: "03",
		title: "Share",
		description:
			"Generate a link and share with anyone, or invite teammates for real-time collaboration.",
	},
];

export function HowItWorks2() {
	return (
		<section id="how-it-works" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionLabel>How it works</SectionLabel>
						<h2
							className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Get started in 3 simple steps
						</h2>
					</div>
				</FadeIn>

				<div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((step, i) => (
						<FadeIn key={step.number} delay={i * 120}>
							<div className="relative text-center md:text-left">
								{/* Dashed connector (desktop) */}
								{i < STEPS.length - 1 && (
									<div
										className="pointer-events-none absolute top-8 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] md:block"
										aria-hidden
									>
										<div className="h-full w-full border-t-2 border-dashed border-border/50" />
									</div>
								)}

								<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/15 md:mx-0">
									<span
										className="text-xl font-bold text-primary"
										style={HEADING_FONT}
									>
										{step.number}
									</span>
								</div>
								<h3
									className="mt-5 text-xl font-bold"
									style={HEADING_FONT}
								>
									{step.title}
								</h3>
								<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
									{step.description}
								</p>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
