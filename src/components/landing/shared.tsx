import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

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

export function SectionBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
			{children}
		</span>
	);
}
