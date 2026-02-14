import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";
import { GABARITO } from "./shared";

const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

export function LandingNav() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav
			className={cn(
				"fixed top-0 right-0 left-0 z-50 transition-all duration-300",
				scrolled
					? "border-b border-border/70 bg-background/80 shadow-xs backdrop-blur-xl"
					: "bg-transparent",
			)}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
				{/* Logo */}
				<a href="/landing1" className="flex items-center gap-2.5">
					<BrandLogo size={28} />
					<span className="text-lg font-bold tracking-tight" style={GABARITO}>
						InspoSnaps
					</span>
				</a>

				{/* Desktop links */}
				<div className="hidden items-center gap-9 md:flex">
					{NAV_LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{l.label}
						</a>
					))}
				</div>

				{/* Desktop CTAs */}
				<div className="hidden items-center gap-3 md:flex">
					<Button variant="ghost" size="sm">
						<Link to="/login">Log in</Link>
					</Button>
					<Button size="sm">
						<Link to="/signup">Get Started Free</Link>
					</Button>
				</div>

				{/* Mobile toggle */}
				<button
					type="button"
					className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
					onClick={() => setMobileOpen((v) => !v)}
					aria-label="Toggle menu"
				>
					<svg
						className="size-5"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						{mobileOpen ? (
							<path
								d="M18 6L6 18M6 6l12 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						) : (
							<path
								d="M4 7h16M4 12h16M4 17h16"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile menu */}
			<div
				className={cn(
					"overflow-hidden border-b bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
					mobileOpen
						? "max-h-72 border-border/70"
						: "max-h-0 border-transparent",
				)}
			>
				<div className="space-y-1 px-5 pb-5 pt-2">
					{NAV_LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
							onClick={() => setMobileOpen(false)}
						>
							{l.label}
						</a>
					))}
					<div className="flex gap-3 pt-4">
						<Button variant="outline" size="sm" className="flex-1">
							<Link to="/login">Log in</Link>
						</Button>
						<Button size="sm" className="flex-1">
							<Link to="/signup">Get Started</Link>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
