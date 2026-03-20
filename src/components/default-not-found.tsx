import { FileSearchIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	DriftingIcon,
	ErrorIllustrationContainer,
	FloatingParticle,
} from "@/components/ui/error-state";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

function NotFoundIllustration() {
	return (
		<ErrorIllustrationContainer glowColor="bg-muted/40">
			{/* Center search/file icon */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<div
					className="animate-[float_4s_ease-in-out_infinite]"
					style={{ animationDelay: "-1s" }}
				>
					<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
						<HugeiconsIcon
							icon={FileSearchIcon}
							className="size-7 text-muted-foreground"
						/>
						{/* Question mark badge */}
						<div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-muted-foreground/20 shadow-md ring-2 ring-background">
							<span className="text-xs font-bold text-muted-foreground">
								?
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Drifting search fragments */}
			<DriftingIcon
				icon={Search01Icon}
				position={{ left: "10%", top: "15%" }}
				delay="0s"
				opacity={0.3}
				containerSize="size-8"
				iconSize="size-4"
				bgColor="bg-muted/60"
			/>

			<DriftingIcon
				icon={Search01Icon}
				position={{ right: "12%", top: "20%" }}
				delay="-1.5s"
				opacity={0.25}
				rotation="rotate-12"
				containerSize="size-7"
				iconSize="size-3.5"
				bgColor="bg-muted/50"
			/>

			<DriftingIcon
				icon={Search01Icon}
				position={{ bottom: "15%", left: "20%" }}
				delay="-0.8s"
				opacity={0.2}
				rotation="-rotate-6"
				containerSize="size-6"
				iconSize="size-3"
				bgColor="bg-muted/40"
			/>

			<DriftingIcon
				icon={Search01Icon}
				position={{ bottom: "18%", right: "18%" }}
				delay="-2.2s"
				opacity={0.2}
				rotation="rotate-3"
				containerSize="size-6"
				iconSize="size-3"
				bgColor="bg-muted/40"
			/>

			{/* Floating particles */}
			<FloatingParticle
				position={{ left: "30%", top: "28%" }}
				delay="-0.5s"
				duration="3.5s"
				color="bg-muted-foreground/15"
			/>
			<FloatingParticle
				position={{ right: "28%", top: "32%" }}
				delay="-2s"
				duration="4s"
				size="size-1"
				color="bg-muted-foreground/10"
			/>
			<FloatingParticle
				position={{ bottom: "30%", left: "35%" }}
				delay="-1s"
				duration="3s"
				size="size-1"
				color="bg-muted-foreground/15"
			/>
			<FloatingParticle
				position={{ bottom: "28%", right: "32%" }}
				delay="-2.8s"
				duration="4.5s"
				color="bg-muted-foreground/10"
			/>
		</ErrorIllustrationContainer>
	);
}

export function DefaultNotFound() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Header */}
			<div className="px-8 py-4">
				<Link
					to="/"
					className="inline-flex items-center gap-2.5 rounded-md border border-transparent outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
				>
					<BrandLogo size={28} />
					<span
						className="text-base font-bold"
						style={{ fontFamily: "'Gabarito Variable', sans-serif" }}
					>
						InspoSnaps
					</span>
				</Link>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col items-center justify-center gap-8">
				<NotFoundIllustration />

				<div className="text-center">
					<h3 className="text-xl font-semibold tracking-tight">
						Page not found
					</h3>
					<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
						The page you're looking for doesn't exist or may have
						been moved.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={() => window.history.back()}
					>
						Go back
					</Button>
					<Button
						variant="outline"
						size="lg"
						nativeButton={false}
						render={<Link to="/">Home</Link>}
					/>
				</div>
			</div>

			{/* Footer */}
			<div className="px-8 py-4 text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} InspoSnaps
			</div>
		</div>
	);
}
