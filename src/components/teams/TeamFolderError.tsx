import { Cancel01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function TeamFolderError() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Broken team connection illustration */}
			<div className="relative flex h-36 w-72 items-center justify-center">
				{/* Subtle destructive glow */}
				<div className="absolute size-32 rounded-full bg-destructive/8 blur-2xl" />

				{/* Central blocked team icon */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div
						className="animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					>
						<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
							<HugeiconsIcon
								icon={UserGroupIcon}
								className="size-7 text-muted-foreground"
							/>
							{/* Block overlay */}
							<div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive shadow-md">
								<HugeiconsIcon
									icon={Cancel01Icon}
									className="size-3.5 text-destructive-foreground"
									strokeWidth={2.5}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Drifting broken team fragments */}
				<div className="absolute left-[8%] top-[18%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-35"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-9 rotate-[-15deg] items-center justify-center rounded-lg border border-dashed border-destructive/20 bg-muted/40">
							<HugeiconsIcon
								icon={UserGroupIcon}
								className="size-4 text-muted-foreground/40"
							/>
						</div>
					</div>
				</div>

				<div className="absolute right-[10%] top-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-30"
						style={{ animationDelay: "-1.8s" }}
					>
						<div className="flex size-8 rotate-[12deg] items-center justify-center rounded-md border border-dashed border-destructive/15 bg-muted/30">
							<HugeiconsIcon
								icon={UserGroupIcon}
								className="size-3.5 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[12%] left-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-3.2s" }}
					>
						<div className="flex size-7 rotate-[8deg] items-center justify-center rounded-md border border-dashed border-destructive/15 bg-muted/25">
							<HugeiconsIcon
								icon={UserGroupIcon}
								className="size-3 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[18%] right-[12%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-30"
						style={{ animationDelay: "-2.5s" }}
					>
						<div className="flex size-8 rotate-[-8deg] items-center justify-center rounded-lg border border-dashed border-destructive/20 bg-muted/35">
							<HugeiconsIcon
								icon={UserGroupIcon}
								className="size-3.5 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				{/* Floating debris particles */}
				<div className="absolute left-[28%] top-[30%]">
					<div
						className="size-1.5 rounded-full bg-destructive/25 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					/>
				</div>
				<div className="absolute right-[30%] top-[35%]">
					<div
						className="size-1 rounded-full bg-destructive/20 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					/>
				</div>
				<div className="absolute bottom-[28%] left-[38%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/15 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					/>
				</div>
				<div className="absolute bottom-[32%] right-[35%]">
					<div
						className="size-1.5 rounded-full bg-destructive/20 animate-[float_4.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.8s" }}
					/>
				</div>
				<div className="absolute left-[22%] top-[50%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.5s" }}
					/>
				</div>
				<div className="absolute right-[24%] top-[48%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-3.2s" }}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Team Not Found
				</h3>
				<p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
					This team doesn't exist or you don't have permission to access it.
				</p>
			</div>

			{/* CTA */}
			<Button
				variant="outline"
				nativeButton={false}
				size="lg"
				render={<Link to="/team-folders">Back to Team Folders</Link>}
			/>
		</div>
	);
}
