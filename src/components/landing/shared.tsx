import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export const GABARITO = {
	fontFamily: "'Gabarito Variable', sans-serif",
} as const;

export function FadeIn({
	children,
	className,
	delay = 0,
	direction = "up",
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
	direction?: "up" | "down" | "left" | "right" | "none";
}) {
	const { ref, visible } = useInView();

	const offsets: Record<string, string> = {
		up: "translate3d(0,28px,0)",
		down: "translate3d(0,-28px,0)",
		left: "translate3d(28px,0,0)",
		right: "translate3d(-28px,0,0)",
		none: "translate3d(0,0,0)",
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translate3d(0,0,0)" : offsets[direction],
				transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}

// TODO: Check if used
export function SectionBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-[11px] font-semibold tracking-widest text-primary uppercase">
			{children}
		</span>
	);
}

// TODO: Check if used
export function CheckMark({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4 shrink-0", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M13 4.5L6.5 11 3 7.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

// TODO: Check if used
export function ArrowIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
			<title>Arrow</title>
			<path
				d="M3 8h10m0 0l-4-4m4 4l-4 4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

// TODO: Check if used
export function GrainTexture({ className }: { className?: string }) {
	return (
		<svg
			className={cn(
				"pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]",
				className,
			)}
			aria-hidden="true"
		>
			<filter id="landing-grain">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.75"
					numOctaves="4"
					stitchTiles="stitch"
				/>
			</filter>
			<rect width="100%" height="100%" filter="url(#landing-grain)" />
		</svg>
	);
}
