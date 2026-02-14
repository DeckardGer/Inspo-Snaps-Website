import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Constants ──────────────────────────────────────────────────────── */

export const H = { fontFamily: "'Gabarito Variable', sans-serif" } as const;

export const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
] as const;

/* ─── Hooks ──────────────────────────────────────────────────────────── */

export function useReveal(threshold = 0.12) {
	const ref = useRef<HTMLDivElement>(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVis(true);
					obs.unobserve(el);
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, vis };
}

export function useScrolled(offset = 20) {
	const [s, setS] = useState(false);
	useEffect(() => {
		const fn = () => setS(window.scrollY > offset);
		fn();
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, [offset]);
	return s;
}

/* ─── Shared primitives ──────────────────────────────────────────────── */

export function Anim({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const { ref, vis } = useReveal();
	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: vis ? 1 : 0,
				transform: vis ? "translate3d(0,0,0)" : "translate3d(0,32px,0)",
				transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}

export function Tag({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.05] px-3.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
			{children}
		</span>
	);
}

export function ArrowSvg({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
		>
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

export function TickSvg({ className }: { className?: string }) {
	return (
		<svg
			className={cn("size-4 shrink-0 text-primary", className)}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
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
