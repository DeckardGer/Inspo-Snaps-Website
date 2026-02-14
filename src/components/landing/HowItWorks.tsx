import {
	ChromeIcon,
	CursorAddSelection01Icon,
	DashboardBrowsingIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInView } from "@/hooks/use-in-view";
import { FadeIn, GABARITO, SectionBadge } from "./shared";

const STEPS = [
	{
		num: "01",
		title: "Install the extension",
		desc: "Add the Chrome extension to your browser. It takes seconds and works on any website.",
		icon: ChromeIcon,
	},
	{
		num: "02",
		title: "Select images you love",
		desc: "Activate the toolbar on any site and click the images that inspire you. Save them straight to a folder.",
		icon: CursorAddSelection01Icon,
	},
	{
		num: "03",
		title: "Browse your collections",
		desc: "View and organize your saved inspiration — beautifully laid out and always accessible on InspoSnaps.",
		icon: DashboardBrowsingIcon,
	},
] as const;

function IconPop({
	children,
	delay = 0,
}: {
	children: React.ReactNode;
	delay?: number;
}) {
	const { ref, visible } = useInView();
	return (
		<div
			ref={ref}
			style={{
				transform: visible ? "scale(1)" : "scale(0)",
				transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}

export function HowItWorks() {
	const { ref: lineRef, visible: lineVisible } = useInView();

	return (
		<section id="how-it-works" className="py-20 sm:py-28">
			<div className="mx-auto max-w-5xl px-5 sm:px-8">
				<FadeIn>
					<div className="mx-auto max-w-2xl text-center">
						<SectionBadge>How it works</SectionBadge>
						<h2
							className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]"
							style={GABARITO}
						>
							Get started in three simple steps
						</h2>
					</div>
				</FadeIn>

				<div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					{/* Connector line — draws left-to-right */}
					<div
						ref={lineRef}
						className="pointer-events-none absolute top-8 hidden w-full md:block"
						aria-hidden
					>
						<div className="relative mx-auto w-2/3">
							{/* Dashed line */}
							<div
								className="h-px origin-left border-t-2 border-dashed border-border/50"
								style={{
									transform: lineVisible ? "scaleX(1)" : "scaleX(0)",
									transition:
										"transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
								}}
							/>
							{/* Traveling glow pulse */}
							{lineVisible && (
								<>
									<style>{`
										@keyframes hiw-pulse-travel {
											0% { left: 0%; opacity: 0; }
											5% { left: 0%; opacity: 1; }
											30% { left: 50%; opacity: 1; }
											48% { left: 50%; opacity: 1; }
											70% { left: 100%; opacity: 1; }
											75% { left: 100%; opacity: 0; }
											100% { left: 100%; opacity: 0; }
										}
									`}</style>
									<div
										className="absolute top-0 -translate-x-1/2 -translate-y-1/2 h-0.5 w-10 rounded-full shadow-[0_0_4px_1px_color-mix(in_oklch,var(--primary)_25%,transparent),0_0_8px_3px_color-mix(in_oklch,var(--primary)_10%,transparent)] dark:shadow-[0_0_8px_2px_color-mix(in_oklch,var(--primary)_50%,transparent),0_0_16px_6px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
										style={{
											opacity: 0,
											animation:
												"hiw-pulse-travel 4.5s ease-in-out 2s infinite",
											background:
												"linear-gradient(90deg, transparent, var(--primary) 30%, var(--primary) 70%, transparent)",
										}}
									/>
								</>
							)}
						</div>
					</div>

					{STEPS.map((s, i) => (
						<FadeIn key={s.num} delay={i * 120}>
							<div className="text-center">
								<IconPop delay={i * 120 + 300}>
									<div className="relative z-10 mx-auto flex size-16 items-center justify-center rounded-2xl bg-background bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10">
										<HugeiconsIcon
											icon={s.icon as IconSvgElement}
											className="size-7 text-primary"
										/>
									</div>
								</IconPop>
								<span className="mt-3 block text-[11px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
									Step {s.num}
								</span>
								<h3 className="mt-1.5 text-xl font-bold" style={GABARITO}>
									{s.title}
								</h3>
								<p className="mx-auto mt-2.5 max-w-[260px] text-[14px] leading-relaxed text-muted-foreground">
									{s.desc}
								</p>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
