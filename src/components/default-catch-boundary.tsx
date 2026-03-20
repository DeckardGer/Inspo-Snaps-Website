import { Alert02Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	type ErrorComponentProps,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	DriftingIcon,
	ErrorIllustrationContainer,
	FloatingParticle,
} from "@/components/ui/error-state";
import { BrandLogo } from "@/components/ui/svgs/BrandLogo";

function CatchBoundaryIllustration() {
	return (
		<ErrorIllustrationContainer glowColor="bg-destructive/8">
			{/* Center alert icon */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<div
					className="animate-[float_4s_ease-in-out_infinite]"
					style={{ animationDelay: "-1s" }}
				>
					<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
						<HugeiconsIcon
							icon={Alert02Icon}
							className="size-7 text-muted-foreground"
						/>
						{/* Destructive badge */}
						<div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive shadow-md ring-2 ring-background">
							<span className="text-xs font-bold text-destructive-foreground">
								!
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Drifting alert fragments */}
			<DriftingIcon
				icon={Alert02Icon}
				position={{ left: "8%", top: "15%" }}
				delay="0s"
				opacity={0.3}
				containerSize="size-8"
				iconSize="size-4"
				dashed
				borderColor="border-destructive/20"
				bgColor="bg-muted/40"
			/>

			<DriftingIcon
				icon={Alert02Icon}
				position={{ right: "10%", top: "12%" }}
				delay="-1.8s"
				opacity={0.25}
				rotation="rotate-12"
				containerSize="size-7"
				iconSize="size-3.5"
				dashed
				borderColor="border-destructive/15"
				bgColor="bg-muted/30"
			/>

			<DriftingIcon
				icon={Alert02Icon}
				position={{ bottom: "12%", left: "18%" }}
				delay="-0.8s"
				opacity={0.2}
				rotation="-rotate-6"
				containerSize="size-6"
				iconSize="size-3"
				dashed
				borderColor="border-destructive/15"
				bgColor="bg-muted/25"
			/>

			<DriftingIcon
				icon={Alert02Icon}
				position={{ bottom: "15%", right: "14%" }}
				delay="-2.5s"
				opacity={0.2}
				rotation="rotate-3"
				containerSize="size-6"
				iconSize="size-3"
				dashed
				borderColor="border-destructive/20"
				bgColor="bg-muted/35"
			/>

			{/* Floating debris particles */}
			<FloatingParticle
				position={{ left: "30%", top: "28%" }}
				delay="-0.5s"
				duration="3.5s"
				color="bg-destructive/25"
			/>
			<FloatingParticle
				position={{ right: "28%", top: "32%" }}
				delay="-2s"
				duration="4s"
				size="size-1"
				color="bg-destructive/20"
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
				color="bg-destructive/20"
			/>
			<FloatingParticle
				position={{ left: "42%", top: "18%" }}
				delay="-1.5s"
				duration="3.5s"
				size="size-1"
				color="bg-muted-foreground/10"
			/>
		</ErrorIllustrationContainer>
	);
}

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.error(error);

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
				<CatchBoundaryIllustration />

				<div className="text-center">
					<h3 className="text-xl font-semibold tracking-tight">
						Something went wrong
					</h3>
					<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
						An unexpected error occurred. Please try again or go back to the
						previous page.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant="outline"
						size="lg"
						type="button"
						onClick={() => router.invalidate()}
					>
						<HugeiconsIcon icon={RefreshIcon} className="size-4" />
						Try Again
					</Button>
					{isRoot ? (
						<Button
							variant="outline"
							size="lg"
							nativeButton={false}
							render={<Link to="/">Home</Link>}
						/>
					) : (
						<Button
							variant="outline"
							size="lg"
							type="button"
							onClick={() => window.history.back()}
						>
							Go Back
						</Button>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className="px-8 py-4 text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} InspoSnaps
			</div>
		</div>
	);
}
