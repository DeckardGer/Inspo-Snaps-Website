import { Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SharedFoldersEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Illustration: Two folder icons with a sharing connection */}
			<div className="relative flex h-32 w-72 items-center justify-center">
				{/* Soft ambient glow */}
				<div className="absolute size-32 rounded-full bg-gradient-to-br from-blue-500/15 to-violet-500/15 blur-2xl" />

				{/* Left folder (sender) */}
				<div className="absolute left-[12%] top-1/2 -translate-y-1/2">
					<div
						className="animate-[float_4s_ease-in-out_infinite] opacity-50"
						style={{ animationDelay: "0s" }}
					>
						<div className="flex size-12 items-center justify-center rounded-lg bg-slate-400 shadow-md dark:bg-slate-600">
							<HugeiconsIcon
								icon={Share08Icon}
								strokeWidth={2}
								className="size-5 text-slate-900 dark:text-slate-300"
							/>
						</div>
					</div>
				</div>

				{/* Right folder (receiver/you) - more prominent */}
				<div className="absolute right-[12%] top-1/2 -translate-y-1/2">
					<div
						className="animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2s" }}
					>
						<div className="relative flex size-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
							<HugeiconsIcon
								icon={Share08Icon}
								strokeWidth={2}
								className="size-6 text-primary-foreground"
							/>
							{/* Subtle pulse ring */}
							<div
								className="absolute inset-0 animate-ping rounded-xl bg-primary/20"
								style={{ animationDuration: "2s" }}
							/>
						</div>
					</div>
				</div>

				{/* Connection line between folders */}
				<svg
					className="absolute inset-0 h-full w-full"
					viewBox="0 0 288 128"
					fill="none"
				>
					<title>Connection Line</title>
					<defs>
						<linearGradient
							id="arcGradient"
							x1="83"
							y1="64"
							x2="208"
							y2="64"
							gradientUnits="userSpaceOnUse"
						>
							<stop
								offset="0%"
								style={{
									stopColor: "var(--color-arc-start)",
									stopOpacity: 0.6,
								}}
							/>
							<stop
								offset="100%"
								style={{ stopColor: "var(--color-primary)", stopOpacity: 0.7 }}
							/>
						</linearGradient>
					</defs>
					<path
						d="M83 64 Q144 20 208 64"
						stroke="url(#arcGradient)"
						strokeWidth="2"
						strokeDasharray="6 4"
						strokeLinecap="round"
						className="animate-[dash_2s_linear_infinite]"
					/>
				</svg>

				{/* Floating dots around the arc */}
				<div className="absolute left-[32%] top-[46%]">
					<div
						className="size-1.5 rounded-full bg-primary/35 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.3s" }}
					/>
				</div>
				<div className="absolute left-[38%] top-[32%]">
					<div
						className="size-2 rounded-full bg-primary/40 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.8s" }}
					/>
				</div>
				<div className="absolute left-[45%] top-[28%]">
					<div
						className="size-1 rounded-full bg-primary/30 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.2s" }}
					/>
				</div>
				<div className="absolute left-1/2 top-[22%] -translate-x-1/2">
					<div
						className="size-2.5 rounded-full bg-primary/45 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-0.5s" }}
					/>
				</div>
				<div className="absolute left-[55%] top-[28%]">
					<div
						className="size-1 rounded-full bg-primary/30 animate-[float_3.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.8s" }}
					/>
				</div>
				<div className="absolute left-[62%] top-[36%]">
					<div
						className="size-2 rounded-full bg-primary/40 animate-[float_3s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.2s" }}
					/>
				</div>
				<div className="absolute left-[68%] top-[37%]">
					<div
						className="size-1.5 rounded-full bg-primary/35 animate-[float_4s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.8s" }}
					/>
				</div>
				<div className="absolute left-[42%] top-[38%]">
					<div
						className="size-1 rounded-full bg-primary/25 animate-[float_4.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-1.5s" }}
					/>
				</div>
				<div className="absolute left-[58%] top-[36%]">
					<div
						className="size-1 rounded-full bg-primary/25 animate-[float_4.5s_ease-in-out_infinite]"
						style={{ animationDelay: "-2.5s" }}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					No shared folders yet
				</h3>
				<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
					When someone shares a folder with you, or you accept a share link, it
					will appear here.
				</p>
			</div>
		</div>
	);
}
