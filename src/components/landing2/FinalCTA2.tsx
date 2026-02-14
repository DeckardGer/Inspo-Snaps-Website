import { Link } from "@tanstack/react-router";
import { ArrowIcon, FadeIn, HEADING_FONT } from "./shared";

export function FinalCTA2() {
	return (
		<section className="px-5 pb-20 sm:px-8 sm:pb-28">
			<FadeIn>
				<div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center text-background sm:px-16 sm:py-20">
					{/* Decorative blobs */}
					<div
						className="pointer-events-none absolute inset-0"
						aria-hidden
					>
						<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-[80px]" />
						<div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#f43f5e]/15 blur-[80px]" />
						<div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]/10 blur-[60px]" />
					</div>

					<div className="relative">
						<h2
							className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={HEADING_FONT}
						>
							Ready to organize your
							<br className="hidden sm:block" /> inspiration?
						</h2>
						<p className="mx-auto mt-4 max-w-md text-base text-background/50">
							Join 10,000+ creatives who trust InspoSnaps to keep their visual
							inspiration organized and accessible.
						</p>
						<div className="mt-8">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2.5 rounded-xl bg-background px-8 py-3.5 text-[15px] font-semibold text-foreground shadow-lg transition-all hover:shadow-xl hover:opacity-90"
							>
								Get Started Free
								<ArrowIcon />
							</Link>
						</div>
						<p className="mt-4 text-[12px] text-background/35">
							No credit card required. Free plan available forever.
						</p>
					</div>
				</div>
			</FadeIn>
		</section>
	);
}
