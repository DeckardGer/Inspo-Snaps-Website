import { GABARITO } from "./shared";

const TRUSTED_BRANDS = [
	"Dribbble",
	"Figma",
	"Notion",
	"Behance",
	"Pinterest",
	"Adobe",
	"Canva",
	"Framer",
];

export function SocialProof() {
	return (
		<section className="border-y border-border/50 bg-muted/20 py-10">
			<div className="mx-auto max-w-7xl px-5 sm:px-8">
				<p className="mb-7 text-center text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/60 uppercase">
					Trusted by creatives at
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
					{TRUSTED_BRANDS.map((brand) => (
						<span
							key={brand}
							className="select-none text-lg font-semibold text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
							style={GABARITO}
						>
							{brand}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
