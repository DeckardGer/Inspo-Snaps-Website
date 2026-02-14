import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";
import { GABARITO, GrainTexture, Reveal } from "./shared";

export function FinalCTA() {
	return (
		<section className="relative overflow-hidden py-24 sm:py-32">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#444ce7] via-[#5a63f0] to-[#8098f9]" />
			<GrainTexture className="opacity-[0.07]" />

			{/* Floating circles */}
			<div
				className="pointer-events-none absolute top-10 left-[15%] size-32 rounded-full bg-white/[0.06]"
				style={{ animation: "float 7s ease-in-out infinite" }}
			/>
			<div
				className="pointer-events-none absolute right-[10%] bottom-10 size-24 rounded-full bg-white/[0.04]"
				style={{ animation: "float 9s ease-in-out infinite 2s" }}
			/>

			<div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
				<Reveal>
					<BrandLogo
						size={44}
						className="mx-auto mb-6 brightness-200 drop-shadow-lg"
					/>
					<h2
						className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
						style={GABARITO}
					>
						Ready to organize
						<br />
						your inspiration?
					</h2>
					<p className="mx-auto mt-4 max-w-md text-base text-white/60 sm:text-lg">
						Join thousands of creatives who've found a better way to save,
						organize, and share their visual world.
					</p>
					<div className="mt-8">
						<Button
							size="lg"
							className="h-12 gap-2 border border-white/20 bg-white px-8 text-[15px] font-semibold text-[#444ce7] shadow-lg hover:bg-white/90"
						>
							<Link to="/signup">Get Started Free</Link>
							<svg
								className="size-4"
								viewBox="0 0 16 16"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M3 8h10m0 0l-4-4m4 4l-4 4"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
