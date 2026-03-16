import {
	ArrowRight02Icon,
	Cancel01Icon,
	Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React from "react";
import { GABARITO } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { useScroll } from "@/hooks/use-scroll";
import { trackLandingCtaClicked } from "@/lib/analytics/events";
import { authQueryOptions } from "@/lib/auth/queries";
import { cn } from "@/lib/utils";

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

const dashboardRoute = "/my-folders/{-$folderId}" as const;
const dashboardParams = { folderId: undefined } as const;

export function LandingNav() {
	const scrolled = useScroll(10);
	const { data: user } = useQuery(authQueryOptions());

	return (
		<header
			className={cn(
				"fixed top-0 right-0 left-0 z-50 border-transparent border-b transition-all duration-300",
				scrolled
					? "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
					: "bg-transparent",
			)}
		>
			<nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
				<Link
					to="/"
					className="flex items-center gap-2.5 rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				>
					<BrandLogo size={28} />
					<span className="text-lg font-bold tracking-tight" style={GABARITO}>
						InspoSnaps
					</span>
				</Link>
				<div className="hidden items-center gap-9 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.href}
							className="rounded-sm text-[13px] font-medium text-muted-foreground outline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="hidden items-center gap-3 md:flex">
					{user ? (
						<Button
							size="sm"
							render={<Link to={dashboardRoute} params={dashboardParams} />}
							nativeButton={false}
						>
							Dashboard
							<HugeiconsIcon
								icon={ArrowRight02Icon}
								size={15}
								strokeWidth={2}
							/>
						</Button>
					) : (
						<>
							<Link
								to="/login"
								className="rounded-sm text-[13px] font-medium text-muted-foreground outline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
							>
								Log In
							</Link>
							<Button
								size="sm"
								render={<Link to="/signup" />}
								nativeButton={false}
								onClick={() => trackLandingCtaClicked("get_started", "navbar")}
							>
								Get Started
							</Button>
						</>
					)}
				</div>
				<MobileNav isLoggedIn={!!user} />
			</nav>
		</header>
	);
}

function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
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
				<Portal className="top-16" id="mobile-menu">
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
									render={<Link to={link.href} />}
									nativeButton={false}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Button>
							))}
						</div>
						<div className="mt-12 flex flex-col gap-2">
							{isLoggedIn ? (
								<Button
									className="w-full"
									render={<Link to={dashboardRoute} params={dashboardParams} />}
									nativeButton={false}
								>
									Dashboard
									<HugeiconsIcon
										icon={ArrowRight02Icon}
										size={15}
										strokeWidth={2}
									/>
								</Button>
							) : (
								<>
									<Button
										className="w-full"
										variant="outline"
										render={<Link to="/login" />}
										nativeButton={false}
									>
										Log In
									</Button>
									<Button
										className="w-full"
										render={<Link to="/signup" />}
										nativeButton={false}
										onClick={() => trackLandingCtaClicked("get_started", "mobile_nav")}
									>
										Get Started
									</Button>
								</>
							)}
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
