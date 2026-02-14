import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Constants ──────────────────────────────────────────────────────────── */

export const HEADING_FONT = {
	fontFamily: "'Gabarito Variable', sans-serif",
} as const;

export const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

export function useScrollReveal(threshold = 0.12) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
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

export function useScrolled(offset = 20) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > offset);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	return scrolled;
}

export function useCountUp(target: number, decimals = 0) {
	const [value, setValue] = useState(0);
	const { ref, visible } = useScrollReveal(0.3);
	const animated = useRef(false);

	useEffect(() => {
		if (!visible || animated.current) return;
		animated.current = true;
		const duration = 2000;
		const start = performance.now();

		const tick = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - t) ** 3;
			setValue(Number.parseFloat((eased * target).toFixed(decimals)));
			if (t < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, [visible, target, decimals]);

	return { ref, value };
}

/* ─── Shared Components ──────────────────────────────────────────────────── */

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
	const { ref, visible } = useScrollReveal();

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

export function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<p className="text-[12px] font-semibold tracking-[0.15em] text-primary uppercase">
			{children}
		</p>
	);
}

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

export function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4 shrink-0 text-primary", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
			<title>Check</title>
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
