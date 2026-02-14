import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { cn } from "@/lib/utils";
import { HEADING_FONT, NAV_LINKS, useScrolled } from "./shared";

export function Navbar2() {
	const scrolled = useScrolled();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav
			className={cn(
				"fixed top-0 right-0 left-0 z-50 transition-all duration-300",
				scrolled
					? "border-b border-border/50 bg-background/80 shadow-xs backdrop-blur-xl"
					: "bg-transparent",
			)}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
				<a href="/landing2" className="flex items-center gap-2.5">
					<BrandLogo size={26} />
					<span
						className="text-[17px] font-bold tracking-tight"
						style={HEADING_FONT}
					>
						InspoSnaps
					</span>
				</a>

				<div className="hidden items-center gap-8 md:flex">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</div>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						to="/login"
						className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						Log in
					</Link>
					<Link
						to="/signup"
						className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90"
					>
						Get Started
					</Link>
				</div>

				{/* Mobile hamburger */}
				<button
					type="button"
					className="flex size-9 items-center justify-center rounded-md md:hidden"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="Toggle menu"
				>
					<div className="relative h-4 w-5">
						<span
							className={cn(
								"absolute left-0 h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "top-[7px] rotate-45" : "top-0",
							)}
						/>
						<span
							className={cn(
								"absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "-rotate-45" : "",
							)}
						/>
						<span
							className={cn(
								"absolute bottom-0 left-0 h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
								menuOpen ? "opacity-0" : "opacity-100",
							)}
						/>
					</div>
				</button>
			</div>

			{/* Mobile menu */}
			<div
				className={cn(
					"overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
					menuOpen ? "max-h-80" : "max-h-0 border-t-0",
				)}
			>
				<div className="px-5 pb-5 pt-2">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="block py-2.5 text-[15px] font-medium text-muted-foreground"
							onClick={() => setMenuOpen(false)}
						>
							{link.label}
						</a>
					))}
					<div className="mt-4 flex flex-col gap-2">
						<Link
							to="/login"
							className="py-2 text-center text-[15px] font-medium text-muted-foreground"
						>
							Log in
						</Link>
						<Link
							to="/signup"
							className="rounded-lg bg-foreground py-2.5 text-center text-[15px] font-semibold text-background"
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
