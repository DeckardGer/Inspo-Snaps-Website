import { Link } from "@tanstack/react-router";
import { Anim, ArrowSvg, H } from "./shared";

export function CTA3() {
	return (
		<section className="px-5 pb-20 sm:px-8 sm:pb-28">
			<Anim>
				<div
					className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
					style={{
						background:
							"linear-gradient(135deg, #fec6a1 0%, #fda4af 30%, #c4b5fd 60%, #818cf8 100%)",
					}}
				>
					{/* Grain overlay */}
					<svg
						className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
						aria-hidden
					>
						<filter id="l3-grain">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.8"
								numOctaves="4"
								stitchTiles="stitch"
							/>
						</filter>
						<rect
							width="100%"
							height="100%"
							filter="url(#l3-grain)"
						/>
					</svg>

					<div className="relative">
						<h2
							className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
							style={H}
						>
							Ready to organize your
							<br className="hidden sm:block" /> inspiration?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-base text-white/70">
							Join 10,000+ creatives who trust InspoSnaps to keep
							their visual inspiration organized and accessible.
						</p>
						<div className="mt-8">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-gray-900 shadow-lg transition-all hover:bg-white/95 hover:shadow-xl"
							>
								Get Started Free <ArrowSvg />
							</Link>
						</div>
						<p className="mt-4 text-[12px] text-white/50">
							No credit card required &middot; Free plan forever
						</p>
					</div>
				</div>
			</Anim>
		</section>
	);
}
