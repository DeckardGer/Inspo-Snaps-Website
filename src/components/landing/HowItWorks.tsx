import { CloudUploadIcon, Folder01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GABARITO, GrainTexture, Reveal, SectionBadge } from "./shared";

const STEPS = [
	{
		num: "01",
		icon: Folder01Icon,
		title: "Create Your Folders",
		desc: "Set up your organization structure with nested folders, colors, and emojis. Make it yours.",
	},
	{
		num: "02",
		icon: CloudUploadIcon,
		title: "Upload & Organize",
		desc: "Drag and drop images into your collections. One image can live in multiple folders.",
	},
	{
		num: "03",
		icon: Share08Icon,
		title: "Share & Collaborate",
		desc: "Share collections via link or invite collaborators directly. Simple, no fuss.",
	},
];

export function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-24 sm:py-32"
		>
			<GrainTexture />

			<div className="relative mx-auto max-w-7xl px-5 sm:px-8">
				<Reveal className="mx-auto mb-14 max-w-xl text-center">
					<SectionBadge>How It Works</SectionBadge>
					<h2
						className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
						style={GABARITO}
					>
						Up and running in minutes
					</h2>
					<p className="mt-4 text-base text-muted-foreground sm:text-lg">
						Three simple steps to transform how you collect and organize visual
						inspiration.
					</p>
				</Reveal>

				<div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
					{STEPS.map((step, i) => (
						<Reveal key={step.num} delay={i * 100}>
							<div className="relative h-full rounded-2xl border border-border/50 bg-card p-6 sm:p-7">
								{/* Large step number */}
								<span
									className="mb-5 block text-[3.5rem] font-bold leading-none text-primary/[0.08]"
									style={GABARITO}
								>
									{step.num}
								</span>
								<div className="mb-4 inline-flex rounded-xl bg-primary/[0.08] p-3">
									<HugeiconsIcon
										icon={step.icon}
										size={22}
										strokeWidth={1.8}
										className="text-primary"
									/>
								</div>
								<h3 className="mb-2 text-[15px] font-semibold">{step.title}</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{step.desc}
								</p>

								{/* Connector chevron */}
								{i < 2 && (
									<div className="absolute -right-[14px] top-1/2 z-10 hidden -translate-y-1/2 sm:block">
										<svg
											className="size-7 text-border"
											viewBox="0 0 24 24"
											fill="none"
											aria-hidden="true"
										>
											<path
												d="M9 5l7 7-7 7"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								)}
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
