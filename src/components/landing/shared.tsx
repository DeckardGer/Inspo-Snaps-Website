import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const GABARITO = {
	fontFamily: "'Gabarito Variable', sans-serif",
} as const;

export function useInView(threshold = 0.12) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.unobserve(el);
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, visible };
}

export function Reveal({
	children,
	className,
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	const { ref, visible } = useInView();
	return (
		<div
			ref={ref}
			className={cn(
				"transition-all duration-700 ease-out",
				visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
				className,
			)}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}

export function SectionBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-[11px] font-semibold tracking-widest text-primary uppercase">
			{children}
		</span>
	);
}

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
