import { Folder01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SharedFolderEmptyState() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-8 py-20">
			{/* Illustration: Open folder with ghost placeholders */}
			<div className="relative flex h-36 w-72 items-center justify-center">
				{/* Ambient glow */}
				<div className="absolute size-32 rounded-full bg-muted-foreground/15 blur-2xl" />

				{/* Central folder icon */}
				<div className="relative z-10">
					<div
						className="animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					>
						<div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
							<HugeiconsIcon
								icon={Folder01Icon}
								className="size-8 text-muted-foreground"
								fill="currentColor"
							/>
						</div>
					</div>
				</div>

				{/* Ghost image placeholders floating around */}
				<div className="absolute left-[8%] top-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-10 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30">
							<HugeiconsIcon
								icon={Image01Icon}
								className="size-4 text-muted-foreground/30"
							/>
						</div>
					</div>
				</div>

				<div className="absolute right-[10%] top-[20%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.5s" }}
					>
						<div className="flex size-8 items-center justify-center rounded-md border border-dashed border-muted-foreground/15 bg-muted/20">
							<HugeiconsIcon
								icon={Image01Icon}
								className="size-3 text-muted-foreground/25"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[15%] left-[15%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "-3s" }}
					>
						<div className="flex size-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/15 bg-muted/20">
							<HugeiconsIcon
								icon={Image01Icon}
								className="size-3 text-muted-foreground/20"
							/>
						</div>
					</div>
				</div>

				<div className="absolute bottom-[20%] right-[12%]">
					<div
						className="animate-[drift_5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					>
						<div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/25">
							<HugeiconsIcon
								icon={Image01Icon}
								className="size-4 text-muted-foreground/25"
							/>
						</div>
					</div>
				</div>

				{/* Subtle floating dots */}
				<div className="absolute left-[30%] top-[35%]">
					<div
						className="size-1.5 rounded-full bg-muted-foreground/15 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					/>
				</div>
				<div className="absolute right-[28%] top-[40%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					/>
				</div>
				<div className="absolute bottom-[30%] left-[40%]">
					<div
						className="size-1 rounded-full bg-muted-foreground/10 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-1s" }}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					This folder is empty
				</h3>
				<p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
					The owner hasn't added any folders or images here yet.
				</p>
			</div>
		</div>
	);
}
