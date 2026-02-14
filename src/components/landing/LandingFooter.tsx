import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { GABARITO } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

const navLinks = [
	{ href: "#features", label: "Features" },
	{ href: "#how-it-works", label: "How It Works" },
	{ href: "#pricing", label: "Pricing" },
	{ href: "#faq", label: "FAQ" },
	{ href: "/privacy", label: "Privacy" },
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

export function LandingFooter() {
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
									<a className="hover:text-foreground" href={link.href}>
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
							className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
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
