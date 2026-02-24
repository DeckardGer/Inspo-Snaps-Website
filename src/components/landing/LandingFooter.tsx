import {
	ComputerIcon,
	GithubIcon,
	Moon02Icon,
	NewTwitterIcon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { GABARITO } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { type UserTheme, useTheme } from "@/lib/ThemeProvider";

const navLinks = [
	{ href: "#features", label: "Features" },
	{ href: "#how-it-works", label: "How It Works" },
	{ href: "#pricing", label: "Pricing" },
	{ href: "#faq", label: "FAQ" },
	{ href: "/privacy", label: "Privacy" },
	{ href: "/terms", label: "Terms" },
];

const socialLinks = [
	{
		href: "https://x.com/deckard_the_dev",
		label: "X",
		icon: <HugeiconsIcon icon={NewTwitterIcon} strokeWidth={2} />,
	},
	{
		href: "https://github.com/deckardger",
		label: "Github",
		icon: <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />,
	},
];

const themeCycle: Record<
	UserTheme,
	{ next: UserTheme; icon: typeof Sun03Icon; label: string }
> = {
	light: { next: "dark", icon: Sun03Icon, label: "Switch to dark mode" },
	dark: { next: "system", icon: Moon02Icon, label: "Switch to system theme" },
	system: { next: "light", icon: ComputerIcon, label: "Switch to light mode" },
};

export function LandingFooter() {
	const { userTheme, setTheme } = useTheme();
	const current = themeCycle[userTheme];

	return (
		<footer className="border-t border-border/40">
			<div className="mx-auto max-w-5xl *:px-4 *:md:px-6">
				<div className="flex flex-col gap-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<BrandLogo size={24} />
							<span className="text-lg font-bold" style={GABARITO}>
								InspoSnaps
							</span>
						</div>
						<div className="flex items-center">
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											size="icon-sm"
											variant="ghost"
											onClick={() => setTheme(current.next)}
											aria-label={current.label}
										>
											<HugeiconsIcon icon={current.icon} strokeWidth={2} />
										</Button>
									}
								/>
								<TooltipContent>Toggle theme</TooltipContent>
							</Tooltip>
							<div className="mx-1.5 h-4 w-px bg-border/50" />
							{socialLinks.map(({ href, label, icon }) => (
								<Button
									key={label}
									size="icon-sm"
									variant="ghost"
									render={<Link to={href}>{icon}</Link>}
									nativeButton={false}
								/>
							))}
						</div>
					</div>

					<nav>
						<ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
							{navLinks.map((link) => (
								<li key={link.label}>
									<a
										className="rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
										href={link.href}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-border/40 py-4 text-muted-foreground text-sm">
					<p>
						&copy; {new Date().getFullYear()} InspoSnaps. All rights reserved.
					</p>

					<p className="inline-flex items-center gap-1">
						<span>Built by</span>
						<a
							aria-label="x/twitter"
							className="inline-flex items-center gap-1 rounded-md text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
							href={"https://x.com/deckard_the_dev"}
							rel="noreferrer"
							target="_blank"
						>
							<img
								alt="Deckard"
								className="size-4 rounded-full"
								src="/images/about/deckard.png"
							/>
							Deckard
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
