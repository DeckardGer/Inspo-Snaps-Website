import { Anim, H, Tag } from "./shared";

const STEPS = [
	{
		num: "01",
		title: "Upload",
		desc: "Drag and drop images, screenshots, or visual references. All major formats supported.",
	},
	{
		num: "02",
		title: "Organize",
		desc: "Create color-coded folders with emojis. Nest them however you like — it's your system.",
	},
	{
		num: "03",
		title: "Share",
		desc: "Send a link to anyone, or invite teammates for real-time collaboration on collections.",
	},
] as const;

export function Steps3() {
	return (
		<section id="how-it-works" className="py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<Anim>
					<div className="mx-auto max-w-2xl text-center">
						<Tag>How it works</Tag>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={H}
						>
							Get started in three simple steps
						</h2>
					</div>
				</Anim>

				<div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((s, i) => (
						<Anim key={s.num} delay={i * 120}>
							<div className="relative text-center md:text-left">
								{i < STEPS.length - 1 && (
									<div
										className="pointer-events-none absolute top-8 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] md:block"
										aria-hidden
									>
										<div className="h-full w-full border-t-2 border-dashed border-border/50" />
									</div>
								)}

								<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fec6a1]/20 to-primary/10 ring-1 ring-primary/10 md:mx-0">
									<span
										className="text-xl font-bold text-primary"
										style={H}
									>
										{s.num}
									</span>
								</div>
								<h3 className="mt-5 text-xl font-bold" style={H}>
									{s.title}
								</h3>
								<p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">
									{s.desc}
								</p>
							</div>
						</Anim>
					))}
				</div>
			</div>
		</section>
	);
}
