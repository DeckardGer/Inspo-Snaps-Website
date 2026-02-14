import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import React from "react";
import { GABARITO } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

export function LandingNav() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<a
					className="flex items-center gap-2 rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
					href="/"
				>
					<BrandLogo size={20} />
					<span className="text-base font-bold" style={GABARITO}>
						InspoSnaps
					</span>
				</a>
				<div className="hidden items-center gap-2 md:flex">
					{navLinks.map((link) => (
						<Button
							key={link.label}
							size="sm"
							variant="ghost"
							render={<a href={link.href} />}
							nativeButton={false}
						>
							{link.label}
						</Button>
					))}
					<Button
						size="sm"
						variant="outline"
						render={<Link to="/login" />}
						nativeButton={false}
					>
						Sign In
					</Button>
					<Button size="sm" render={<Link to="/signup" />} nativeButton={false}>
						Get Started
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}

function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<HugeiconsIcon
						icon={Cancel01Icon}
						strokeWidth={2}
						className="size-4.5"
					/>
				) : (
					<HugeiconsIcon
						icon={Menu01Icon}
						strokeWidth={2}
						className="size-4.5"
					/>
				)}
			</Button>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4",
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{navLinks.map((link) => (
								<Button
									className="justify-start"
									key={link.label}
									variant="ghost"
									render={<a href={link.href} />}
									nativeButton={false}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Button>
							))}
						</div>
						<div className="mt-12 flex flex-col gap-2">
							<Button
								className="w-full"
								variant="outline"
								render={<Link to="/login" />}
								nativeButton={false}
							>
								Sign In
							</Button>
							<Button
								className="w-full"
								render={<Link to="/signup" />}
								nativeButton={false}
							>
								Get Started
							</Button>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
