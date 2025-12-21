import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function FolderNotFound() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Scattered folders illustration */}
			<div className="relative flex h-32 w-64 items-center justify-center">
				{/* Subtle background glow - muted to convey "not found" */}
				<div className="absolute size-24 rounded-full bg-muted/40 blur-2xl" />

				{/* Center folder with question mark overlay */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="animate-[pulse_3s_ease-in-out_infinite] opacity-80">
						<div className="relative flex size-14 items-center justify-center rounded-xl bg-muted shadow-lg">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-7 text-muted-foreground/60"
							/>
							<div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs font-bold text-muted-foreground">
								?
							</div>
						</div>
					</div>
				</div>

				{/* Drifting folder fragments - scattered and fading */}
				<div className="absolute left-[10%] top-[15%]">
					<div
						className="animate-[drift_4s_ease-in-out_infinite] opacity-30"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-8 items-center justify-center rounded-md bg-muted/60">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-4 text-muted-foreground/40"
							/>
						</div>
					</div>
				</div>

				<div className="absolute right-[12%] top-[20%]">
					<div
						className="animate-[drift_4s_ease-in-out_infinite] opacity-25"
						style={{ animationDelay: "-1.5s" }}
					>
						<div className="flex size-7 items-center justify-center rounded-md bg-muted/50 rotate-12">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-3.5 text-muted-foreground/40"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[15%] left-[20%]">
					<div
						className="animate-[drift_4s_ease-in-out_infinite] opacity-20"
						style={{ animationDelay: "-0.8s" }}
					>
						<div className="flex size-6 items-center justify-center rounded-md bg-muted/40 -rotate-6">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-3 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[18%] right-[18%]">
					<div
						className="animate-[drift_4s_ease-in-out_infinite] opacity-20"
						style={{ animationDelay: "-2.2s" }}
					>
						<div className="flex size-6 items-center justify-center rounded-md bg-muted/40 rotate-3">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-3 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Folder not found
				</h3>
				<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
					This folder doesn't exist or you don't have permission to view it.
				</p>
			</div>

			{/* CTA */}
			<Button
				variant="outline"
				nativeButton={false}
				render={
					<Link
						to="/my-folders/{-$folderId}"
						params={{ folderId: undefined }}
						className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
					>
						Back to My Folders
					</Link>
				}
			/>
		</div>
	);
}
