import { HEADING_FONT } from "./shared";

const BRAND_NAMES = [
	"Google",
	"Spotify",
	"Figma",
	"Notion",
	"Vercel",
	"Linear",
	"Stripe",
	"Shopify",
];

const TICKER_ITEMS = [
	...BRAND_NAMES.map((name) => ({ key: `a-${name}`, name })),
	...BRAND_NAMES.map((name) => ({ key: `b-${name}`, name })),
	...BRAND_NAMES.map((name) => ({ key: `c-${name}`, name })),
];

export function LogoTicker() {
	return (
		<section className="border-y border-border/40 py-10">
			<p className="mb-6 text-center text-[11px] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
				Trusted by creative teams at
			</p>
			<div className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

				<div
					className="flex w-max gap-14"
					style={{
						animation: "landing2-ticker 28s linear infinite",
					}}
				>
					{TICKER_ITEMS.map((item) => (
						<span
							key={item.key}
							className="shrink-0 text-[17px] font-bold tracking-tight text-muted-foreground/25 dark:text-muted-foreground/15 select-none"
							style={HEADING_FONT}
						>
							{item.name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
