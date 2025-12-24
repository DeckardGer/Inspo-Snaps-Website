import { AddTeamIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { TeamModal } from "./TeamModal";

export function TeamsEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-20">
			{/* Floating teams illustration */}
			<div className="relative flex h-32 w-64 items-center justify-center">
				{/* Background glow */}
				<div className="absolute size-32 rounded-full bg-primary/20 blur-2xl" />

				{/* Center icon */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div
						className="animate-[float_3s_ease-in-out_infinite] flex items-center justify-center size-20 rounded-2xl bg-primary/10 shadow-lg"
						style={{ animationDelay: "0s" }}
					>
						<HugeiconsIcon
							icon={UserGroupIcon}
							className="size-10 text-primary"
							strokeWidth={2}
						/>
					</div>
				</div>

				{/* Floating secondary icons */}
				<div className="absolute left-[11%] top-[20%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-60 flex items-center justify-center size-12 rounded-xl bg-purple-500/10 shadow-md"
						style={{ animationDelay: "-1s" }}
					>
						<HugeiconsIcon
							icon={UserGroupIcon}
							className="size-6 text-purple-500"
							strokeWidth={2}
						/>
					</div>
				</div>

				<div className="absolute right-[11%] top-[26%]">
					<div
						className="animate-[float_3s_ease-in-out_infinite] opacity-60 flex items-center justify-center size-12 rounded-xl bg-amber-500/10 shadow-md"
						style={{ animationDelay: "-1.8s" }}
					>
						<HugeiconsIcon
							icon={UserGroupIcon}
							className="size-6 text-amber-500"
							strokeWidth={2}
						/>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">
					Create your first team
				</h3>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					Teams let you collaborate with others. Create a team to share folders
					and images with your colleagues, friends, or family.
				</p>
			</div>

			{/* CTA */}
			<TeamModal
				trigger={
					<Button size="lg">
						<HugeiconsIcon icon={AddTeamIcon} className="size-5" />
						Create Team
					</Button>
				}
			/>
		</div>
	);
}
