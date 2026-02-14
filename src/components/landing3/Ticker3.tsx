import { H } from "./shared";

const BRAND_NAMES = [
	"Google", "Spotify", "Figma", "Notion",
	"Vercel", "Linear", "Stripe", "Shopify",
] as const;

export function Ticker3() {
	const items = [...BRAND_NAMES, ...BRAND_NAMES, ...BRAND_NAMES];

	return (
		<section className="border-y border-border/40 py-9">
			<p className="mb-5 text-center text-[11px] font-medium tracking-[0.18em] text-muted-foreground/45 uppercase">
				Trusted by creative teams worldwide
			</p>
			<div className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
				<div
					className="flex w-max gap-14"
					style={{ animation: "l3-ticker 30s linear infinite" }}
				>
					{items.map((name, i) => (
						<span
							key={`${name}-${i}`}
							className="shrink-0 text-[17px] font-bold tracking-tight text-muted-foreground/20 dark:text-muted-foreground/12 select-none"
							style={H}
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
