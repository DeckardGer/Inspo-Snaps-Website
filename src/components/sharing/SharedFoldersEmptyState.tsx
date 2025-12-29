import { Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EmptyState, FloatingIcon } from "@/components/ui/empty-state";

function SharedFoldersIllustration() {
	return (
		<div className="relative flex h-32 w-72 items-center justify-center">
			{/* Soft ambient glow */}
			<div className="absolute size-32 rounded-full bg-gradient-to-br from-blue-500/15 to-violet-500/15 blur-2xl" />

			{/* Left folder (sender) */}
			<FloatingIcon
				position={{ left: "12%", top: "50%" }}
				className="-translate-y-1/2"
				delay="0s"
				opacity={0.5}
			>
				<div className="flex size-12 items-center justify-center rounded-lg bg-slate-400 shadow-md dark:bg-slate-600">
					<HugeiconsIcon
						icon={Share08Icon}
						strokeWidth={2}
						className="size-5 text-slate-900 dark:text-slate-300"
					/>
				</div>
			</FloatingIcon>

			{/* Right folder (receiver/you) - more prominent */}
			<FloatingIcon
				position={{ right: "12%", top: "50%" }}
				className="-translate-y-1/2"
				delay="-2s"
			>
				<div className="relative flex size-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
					<HugeiconsIcon
						icon={Share08Icon}
						strokeWidth={2}
						className="size-6 text-primary-foreground"
					/>
					{/* Subtle pulse ring */}
					<div
						className="absolute inset-0 animate-ping rounded-xl bg-primary/20"
						style={{ animationDuration: "2s" }}
					/>
				</div>
			</FloatingIcon>

			{/* Connection line between folders */}
			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 288 128"
				fill="none"
			>
				<title>Connection Line</title>
				<defs>
					<linearGradient
						id="arcGradient"
						x1="83"
						y1="64"
						x2="208"
						y2="64"
						gradientUnits="userSpaceOnUse"
					>
						<stop
							offset="0%"
							style={{
								stopColor: "var(--color-arc-start)",
								stopOpacity: 0.6,
							}}
						/>
						<stop
							offset="100%"
							style={{ stopColor: "var(--color-primary)", stopOpacity: 0.7 }}
						/>
					</linearGradient>
				</defs>
				<path
					d="M83 64 Q144 20 208 64"
					stroke="url(#arcGradient)"
					strokeWidth="2"
					strokeDasharray="6 4"
					strokeLinecap="round"
					className="animate-[dash_2s_linear_infinite]"
				/>
			</svg>

			{/* Floating dots around the arc */}
			<FloatingIcon position={{ left: "32%", top: "46%" }} delay="-0.3s">
				<div className="size-1.5 rounded-full bg-primary/35" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "38%", top: "32%" }} delay="-0.8s">
				<div className="size-2 rounded-full bg-primary/40" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "45%", top: "28%" }} delay="-1.2s">
				<div className="size-1 rounded-full bg-primary/30" />
			</FloatingIcon>
			<FloatingIcon
				position={{ left: "50%", top: "22%" }}
				className="-translate-x-1/2"
				delay="-0.5s"
			>
				<div className="size-2.5 rounded-full bg-primary/45" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "55%", top: "28%" }} delay="-1.8s">
				<div className="size-1 rounded-full bg-primary/30" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "62%", top: "36%" }} delay="-2.2s">
				<div className="size-2 rounded-full bg-primary/40" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "68%", top: "37%" }} delay="-2.8s">
				<div className="size-1.5 rounded-full bg-primary/35" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "42%", top: "38%" }} delay="-1.5s">
				<div className="size-1 rounded-full bg-primary/25" />
			</FloatingIcon>
			<FloatingIcon position={{ left: "58%", top: "36%" }} delay="-2.5s">
				<div className="size-1 rounded-full bg-primary/25" />
			</FloatingIcon>
		</div>
	);
}

export function SharedFoldersEmptyState() {
	return (
		<EmptyState
			illustration={<SharedFoldersIllustration />}
			title="No shared folders yet"
			description="When someone shares a folder with you, or you accept a share link, it will appear here."
		/>
	);
}
