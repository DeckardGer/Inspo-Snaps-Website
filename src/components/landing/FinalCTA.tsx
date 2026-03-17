import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { trackLandingCtaClicked } from "@/lib/analytics/capture";
import { FadeIn, GABARITO } from "./shared";

export function FinalCTA() {
	return (
		<section className="px-5 pb-20 sm:px-8 sm:pb-28">
			<FadeIn>
				<div
					className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20"
					style={{
						background:
							"linear-gradient(135deg, #c044a0 0%, #7c5ecf 20%, #5055f0 45%, #4a4ff5 68%, #5b7bf8 82%, #9a7cbb 100%)",
					}}
				>
					{/* Grain overlay */}
					<svg
						className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
						aria-hidden="true"
					>
						<title>Grain texture</title>
						<filter id="cta-grain">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.8"
								numOctaves="4"
								stitchTiles="stitch"
							/>
						</filter>
						<rect width="100%" height="100%" filter="url(#cta-grain)" />
					</svg>

					<div className="relative">
						<h2
							className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
							style={GABARITO}
						>
							Ready to organize your
							<br className="hidden sm:block" /> inspiration?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-base text-white/70">
							Join 10,000+ creatives who trust InspoSnaps to keep their visual
							inspiration organized and accessible.
						</p>
						<div className="mt-8">
							<Button
								size="lg"
								className="bg-white text-gray-900 shadow-md hover:bg-white/90 hover:shadow-lg focus-visible:border-white/50 focus-visible:ring-white/30"
								render={<Link to="/signup" />}
								nativeButton={false}
								onClick={() => trackLandingCtaClicked("start_free_trial", "final_cta")}
							>
								Start Free Trial
								<HugeiconsIcon
									icon={ArrowRight02Icon}
									size={16}
									strokeWidth={2}
								/>
							</Button>
						</div>
						<p className="mt-4 text-[12px] text-white/70">
							No credit card required &middot; 14-day free trial
						</p>
					</div>
				</div>
			</FadeIn>
		</section>
	);
}
