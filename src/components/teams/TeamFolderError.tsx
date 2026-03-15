import { Cancel01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
	CenterErrorIcon,
	DriftingIcon,
	ErrorIllustrationContainer,
	ErrorState,
	FloatingParticle,
} from "@/components/ui/error-state";

function TeamFolderErrorIllustration() {
	return (
		<ErrorIllustrationContainer>
			{/* Central blocked team icon */}
			<CenterErrorIcon icon={UserGroupIcon} badgeIcon={Cancel01Icon} />

			{/* Drifting broken team fragments */}
			<DriftingIcon
				icon={UserGroupIcon}
				position={{ left: "8%", top: "18%" }}
				delay="0s"
				opacity={0.35}
				rotation="rotate-[-15deg]"
				containerSize="size-9"
				iconSize="size-4"
				dashed
				borderColor="border-destructive/20"
				bgColor="bg-muted/40"
			/>

			<DriftingIcon
				icon={UserGroupIcon}
				position={{ right: "10%", top: "15%" }}
				delay="-1.8s"
				opacity={0.3}
				rotation="rotate-[12deg]"
				containerSize="size-8"
				iconSize="size-3.5"
				dashed
				borderColor="border-destructive/15"
				bgColor="bg-muted/30"
			/>

			<DriftingIcon
				icon={UserGroupIcon}
				position={{ bottom: "12%", left: "15%" }}
				delay="-3.2s"
				opacity={0.25}
				rotation="rotate-[8deg]"
				containerSize="size-7"
				iconSize="size-3"
				dashed
				borderColor="border-destructive/15"
				bgColor="bg-muted/25"
			/>

			<DriftingIcon
				icon={UserGroupIcon}
				position={{ bottom: "18%", right: "12%" }}
				delay="-2.5s"
				opacity={0.3}
				rotation="rotate-[-8deg]"
				containerSize="size-8"
				iconSize="size-3.5"
				dashed
				borderColor="border-destructive/20"
				bgColor="bg-muted/35"
			/>

			{/* Floating debris particles */}
			<FloatingParticle
				position={{ left: "28%", top: "30%" }}
				delay="-0.5s"
				duration="3.5s"
				size="size-1.5"
				color="bg-destructive/25"
			/>
			<FloatingParticle
				position={{ right: "30%", top: "35%" }}
				delay="-2s"
				duration="4s"
				size="size-1"
				color="bg-destructive/20"
			/>
			<FloatingParticle
				position={{ bottom: "28%", left: "38%" }}
				delay="-1s"
				duration="3s"
				size="size-1"
				color="bg-muted-foreground/15"
			/>
			<FloatingParticle
				position={{ bottom: "32%", right: "35%" }}
				delay="-2.8s"
				duration="4.5s"
				size="size-1.5"
				color="bg-destructive/20"
			/>
			<FloatingParticle
				position={{ left: "22%", top: "50%" }}
				delay="-1.5s"
				duration="3.5s"
				size="size-1"
				color="bg-muted-foreground/10"
			/>
			<FloatingParticle
				position={{ right: "24%", top: "48%" }}
				delay="-3.2s"
				duration="4s"
				size="size-1"
				color="bg-muted-foreground/10"
			/>
		</ErrorIllustrationContainer>
	);
}

export function TeamFolderError() {
	return (
		<ErrorState
			illustration={<TeamFolderErrorIllustration />}
			title="Team Not Found"
			description="This team doesn't exist or you don't have permission to access it."
			backLink="/team-folders"
			backLabel="Back to Team Folders"
			errorType="team_not_found"
		/>
	);
}
