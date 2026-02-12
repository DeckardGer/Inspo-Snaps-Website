import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { GABARITO } from "./shared";

const FOOTER_COLS = [
	{
		title: "Product",
		links: [
			{ label: "Features", href: "#features" },
			{ label: "Pricing", href: "#pricing" },
			{ label: "Changelog", href: "#" },
			{ label: "Roadmap", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "#" },
			{ label: "Blog", href: "#" },
			{ label: "Careers", href: "#" },
			{ label: "Contact", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Privacy Policy", href: "#" },
			{ label: "Terms of Service", href: "#" },
			{ label: "Cookie Policy", href: "#" },
		],
	},
];

export function LandingFooter() {
	return (
		<footer className="border-t border-border/50 bg-card py-14">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2.5">
							<BrandLogo size={24} />
							<span className="text-base font-bold" style={GABARITO}>
								InspoSnaps
							</span>
						</div>
						<p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
							The beautiful way to collect, organize, and share visual
							inspiration.
						</p>
					</div>

					{/* Link columns */}
					{FOOTER_COLS.map((col) => (
						<div key={col.title}>
							<h4 className="mb-4 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
								{col.title}
							</h4>
							<ul className="space-y-2.5">
								{col.links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} InspoSnaps. All rights reserved.
					</p>
					<div className="flex items-center gap-5">
						{[
							{
								label: "Twitter",
								d: "M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c0-.249 1.51-2.772 1.818-4.013z",
							},
							{
								label: "GitHub",
								d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
							},
						].map((icon) => (
							<a
								key={icon.label}
								href={`https://${icon.label.toLowerCase()}.com`}
								className="text-muted-foreground transition-colors hover:text-foreground"
								aria-label={icon.label}
								target="_blank"
								rel="noopener noreferrer"
							>
								<span className="sr-only">{icon.label}</span>
								<svg
									className="size-[18px]"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.75"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d={icon.d} />
								</svg>
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
