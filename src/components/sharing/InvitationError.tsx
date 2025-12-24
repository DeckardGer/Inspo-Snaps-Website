import { FolderShared02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function InvitationError() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-8 py-20">
			{/* Missing invitation illustration */}
			<div className="relative flex h-36 w-72 items-center justify-center">
				{/* Subtle muted glow */}
				<div className="absolute size-32 rounded-full bg-muted/40 blur-2xl" />

				{/* Central folder icon with question mark */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div
						className="animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					>
						<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
							<HugeiconsIcon
								icon={FolderShared02Icon}
								className="size-7 text-muted-foreground"
							/>
							{/* Question mark overlay */}
							<div className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full bg-muted-foreground/20 shadow-md ring-2 ring-background text-xs font-bold text-muted-foreground">
								?
							</div>
						</div>
					</div>
				</div>

				{/* Scattered invitation fragments */}
				<div className="absolute left-[12%] top-[18%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-30"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-8 rotate-[-15deg] items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/40">
							<HugeiconsIcon
								icon={SentIcon}
								className="size-3.5 text-muted-foreground/40"
							/>
						</div>
					</div>
				</div>

				<div className="absolute right-[10%] top-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-1.8s" }}
					>
						<div className="flex size-7 rotate-[12deg] items-center justify-center rounded-md border border-dashed border-muted-foreground/15 bg-muted/30">
							<HugeiconsIcon
								icon={SentIcon}
								className="size-3 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[15%] left-[18%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-20"
						style={{ animationDelay: "-3.2s" }}
					>
						<div className="flex size-6 rotate-[8deg] items-center justify-center rounded-md border border-dashed border-muted-foreground/15 bg-muted/25">
							<HugeiconsIcon
								icon={SentIcon}
								className="size-2.5 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[18%] right-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-2.5s" }}
					>
						<div className="flex size-7 rotate-[-8deg] items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/35">
							<HugeiconsIcon
								icon={SentIcon}
								className="size-3 text-muted-foreground/35"
							/>
						</div>
					</div>
				</div>

				{/* Floating particles */}
				<div className="absolute left-[30%] top-[30%]">
					<div
						className="size-1.5 rounded-full bg-muted-foreground/20 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					/>
				</div>
				<div className="absolute right-[28%] top-[35%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/15 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					/>
				</div>
				<div className="absolute bottom-[30%] left-[38%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					/>
				</div>
				<div className="absolute bottom-[28%] right-[35%]">
					<div
						className="size-1.5 rounded-full bg-muted-foreground/15 animate-[float_4.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.8s" }}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Invitation Not Found
				</h3>
				<p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
					This invitation doesn't exist, has already been accepted, or was
					cancelled.
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
