import { Link04Icon, Time04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackErrorPageShown } from "@/lib/analytics/events";

export function ShareLinkError() {
	useEffect(() => {
		trackErrorPageShown("share_link_invalid");
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Broken chain illustration */}
			<div className="relative flex h-36 w-72 items-center justify-center">
				{/* Subtle destructive glow */}
				<div className="absolute size-32 rounded-full bg-destructive/6 blur-2xl" />

				{/* Left broken chain link - drifting away */}
				<div className="absolute left-[15%] top-1/2 -translate-y-1/2">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					>
						<div className="flex size-11 -rotate-12 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/60 shadow-md ring-1 ring-border/40">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-5 text-muted-foreground/70"
							/>
						</div>
					</div>
				</div>

				{/* Right broken chain link - drifting away */}
				<div className="absolute right-[15%] top-1/2 -translate-y-1/2">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.5s" }}
					>
						<div className="flex size-11 rotate-12 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/60 shadow-md ring-1 ring-border/40">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-5 text-muted-foreground/70"
							/>
						</div>
					</div>
				</div>

				{/* Central expired link icon */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div
						className="animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					>
						<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-7 text-muted-foreground"
							/>
							{/* Expiration/error overlay */}
							<div className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full bg-destructive shadow-md ring-2 ring-background">
								<HugeiconsIcon
									icon={Time04Icon}
									className="size-3.5 text-destructive-foreground"
									strokeWidth={2.5}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Scattered link fragments - top left */}
				<div className="absolute left-[8%] top-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-30"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-7 rotate-[-20deg] items-center justify-center rounded-md border border-dashed border-destructive/20 bg-muted/40">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-3 text-muted-foreground/40"
							/>
						</div>
					</div>
				</div>

				{/* Scattered link fragments - top right */}
				<div className="absolute right-[10%] top-[12%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-1.8s" }}
					>
						<div className="flex size-6 rotate-[15deg] items-center justify-center rounded-md border border-dashed border-destructive/15 bg-muted/30">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-2.5 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				{/* Scattered link fragments - bottom left */}
				<div className="absolute bottom-[10%] left-[12%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-20"
						style={{ animationDelay: "-3.2s" }}
					>
						<div className="flex size-6 rotate-[25deg] items-center justify-center rounded-md border border-dashed border-destructive/15 bg-muted/25">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-2.5 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>

				{/* Scattered link fragments - bottom right */}
				<div className="absolute bottom-[15%] right-[8%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-2.5s" }}
					>
						<div className="flex size-7 rotate-[-10deg] items-center justify-center rounded-md border border-dashed border-destructive/20 bg-muted/35">
							<HugeiconsIcon
								icon={Link04Icon}
								className="size-3 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				{/* Floating debris particles */}
				<div className="absolute left-[30%] top-[28%]">
					<div
						className="size-1.5 rounded-full bg-destructive/25 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					/>
				</div>
				<div className="absolute right-[28%] top-[32%]">
					<div
						className="size-1 rounded-full bg-destructive/20 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					/>
				</div>
				<div className="absolute bottom-[30%] left-[35%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/15 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					/>
				</div>
				<div className="absolute bottom-[28%] right-[32%]">
					<div
						className="size-1.5 rounded-full bg-destructive/20 animate-[float_4.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.8s" }}
					/>
				</div>
				<div className="absolute left-[42%] top-[18%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.5s" }}
					/>
				</div>
				<div className="absolute right-[40%] bottom-[20%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-3.2s" }}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Link Expired or Invalid
				</h3>
				<p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
					This share link has expired, been revoked, or doesn't exist.
				</p>
			</div>

			{/* CTA */}
			<Button
				variant="outline"
				nativeButton={false}
				size="lg"
				render={<Link to="/shared-folders">Back to Shared Folders</Link>}
			/>
		</div>
	);
}
