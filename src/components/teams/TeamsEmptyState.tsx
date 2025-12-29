import { AddTeamIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
	EmptyState,
	FloatingIcon,
	IllustrationContainer,
} from "@/components/ui/empty-state";
import { TeamModal } from "./TeamModal";

function TeamsIllustration() {
	return (
		<IllustrationContainer>
			{/* Center icon */}
			<FloatingIcon
				position={{ left: "50%", top: "50%" }}
				className="-translate-x-1/2 -translate-y-1/2"
			>
				<div className="flex items-center justify-center size-20 rounded-2xl bg-primary/10 shadow-lg">
					<HugeiconsIcon
						icon={UserGroupIcon}
						className="size-10 text-primary"
						strokeWidth={2}
					/>
				</div>
			</FloatingIcon>

			{/* Floating secondary icons */}
			<FloatingIcon
				position={{ left: "11%", top: "20%" }}
				delay="-1s"
				opacity={0.6}
			>
				<div className="flex items-center justify-center size-12 rounded-xl bg-purple-500/10 shadow-md">
					<HugeiconsIcon
						icon={UserGroupIcon}
						className="size-6 text-purple-500"
						strokeWidth={2}
					/>
				</div>
			</FloatingIcon>

			<FloatingIcon
				position={{ right: "11%", top: "26%" }}
				delay="-1.8s"
				opacity={0.6}
			>
				<div className="flex items-center justify-center size-12 rounded-xl bg-amber-500/10 shadow-md">
					<HugeiconsIcon
						icon={UserGroupIcon}
						className="size-6 text-amber-500"
						strokeWidth={2}
					/>
				</div>
			</FloatingIcon>
		</IllustrationContainer>
	);
}

export function TeamsEmptyState() {
	return (
		<EmptyState
			illustration={<TeamsIllustration />}
			title="Create your first team"
			description="Teams let you collaborate with others. Create a team to share folders and images with your colleagues, friends, or family."
			actions={
				<TeamModal
					trigger={
						<Button size="lg">
							<HugeiconsIcon icon={AddTeamIcon} className="size-5" />
							Create Team
						</Button>
					}
				/>
			}
		/>
	);
}
