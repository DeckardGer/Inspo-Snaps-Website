import type { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Use the type of any HugeIcon
type HugeIcon = typeof Folder01Icon;

interface ErrorStateProps {
	/** The illustration/icon section */
	illustration: React.ReactNode;
	/** Main heading text */
	title: string;
	/** Description text below the title */
	description: string;
	/** Link destination for the back button */
	backLink: string;
	/** Back button label */
	backLabel: string;
	/** Additional class names for the container */
	className?: string;
}

/**
 * A reusable error state template with illustration, title, description, and back button.
 * Used for not found states, access denied, etc.
 */
export function ErrorState({
	illustration,
	title,
	description,
	backLink,
	backLabel,
	className,
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-8 py-20",
				className,
			)}
		>
			{/* Illustration */}
			{illustration}

			{/* Content */}
			<div className="text-center">
				<h3 className="text-xl font-semibold tracking-tight">{title}</h3>
				<p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
					{description}
				</p>
			</div>

			{/* CTA */}
			<Button
				variant="outline"
				nativeButton={false}
				size="lg"
				render={<Link to={backLink}>{backLabel}</Link>}
			/>
		</div>
	);
}

interface DriftingIconProps {
	/** The icon to render */
	icon: HugeIcon;
	/** Icon size class (e.g., "size-4", "size-3") */
	iconSize?: string;
	/** Container size class (e.g., "size-8", "size-7") */
	containerSize?: string;
	/** Animation delay (e.g., "-1.5s") */
	delay?: string;
	/** Opacity (0-1) */
	opacity?: number;
	/** Rotation class (e.g., "rotate-12", "-rotate-6") */
	rotation?: string;
	/** Position styles */
	position: {
		top?: string;
		right?: string;
		bottom?: string;
		left?: string;
	};
	/** Whether to use dashed border style (for destructive states) */
	dashed?: boolean;
	/** Border color class for dashed style */
	borderColor?: string;
	/** Background color class */
	bgColor?: string;
}

/**
 * A drifting animated icon for use in error state illustrations.
 * Uses a slower drift animation compared to float.
 */
export function DriftingIcon({
	icon,
	iconSize = "size-4",
	containerSize = "size-8",
	delay = "0s",
	opacity = 0.3,
	rotation = "",
	position,
	dashed = false,
	borderColor = "border-destructive/20",
	bgColor = "bg-muted/40",
}: DriftingIconProps) {
	return (
		<div
			className="absolute"
			style={{
				top: position.top,
				right: position.right,
				bottom: position.bottom,
				left: position.left,
			}}
		>
			<div
				className="animate-[drift_5s_ease-in-out_infinite]"
				style={{ animationDelay: delay, opacity }}
			>
				<div
					className={cn(
						"flex items-center justify-center rounded-lg",
						containerSize,
						rotation,
						bgColor,
						dashed && "border border-dashed",
						dashed && borderColor,
					)}
				>
					<HugeiconsIcon
						icon={icon}
						className={cn(iconSize, "text-muted-foreground/40")}
					/>
				</div>
			</div>
		</div>
	);
}

interface FloatingParticleProps {
	/** Size class (e.g., "size-1", "size-1.5") */
	size?: string;
	/** Animation delay */
	delay?: string;
	/** Animation duration (e.g., "3.5s", "4s") */
	duration?: string;
	/** Position styles */
	position: {
		top?: string;
		right?: string;
		bottom?: string;
		left?: string;
	};
	/** Color class (e.g., "bg-destructive/25", "bg-muted-foreground/15") */
	color?: string;
}

/**
 * A floating debris particle for error state illustrations.
 */
export function FloatingParticle({
	size = "size-1",
	delay = "0s",
	duration = "3.5s",
	position,
	color = "bg-destructive/20",
}: FloatingParticleProps) {
	return (
		<div
			className="absolute"
			style={{
				top: position.top,
				right: position.right,
				bottom: position.bottom,
				left: position.left,
			}}
		>
			<div
				className={cn(
					"rounded-full animate-[float_ease-in-out_infinite]",
					size,
					color,
				)}
				style={{ animationDelay: delay, animationDuration: duration }}
			/>
		</div>
	);
}

interface ErrorIllustrationContainerProps {
	/** Content to render inside the container */
	children: React.ReactNode;
	/** Background glow color class */
	glowColor?: string;
	/** Additional class names */
	className?: string;
}

/**
 * Container for error state illustrations with background glow.
 */
export function ErrorIllustrationContainer({
	children,
	glowColor = "bg-destructive/8",
	className,
}: ErrorIllustrationContainerProps) {
	return (
		<div
			className={cn(
				"relative flex h-36 w-72 items-center justify-center",
				className,
			)}
		>
			{/* Background glow */}
			<div
				className={cn("absolute size-32 rounded-full blur-2xl", glowColor)}
			/>
			{children}
		</div>
	);
}

interface CenterErrorIconProps {
	/** The main icon */
	icon: HugeIcon;
	/** The badge icon (overlay) */
	badgeIcon: HugeIcon;
	/** Animation delay */
	delay?: string;
}

/**
 * Center icon with badge overlay for error states.
 */
export function CenterErrorIcon({
	icon,
	badgeIcon,
	delay = "-1s",
}: CenterErrorIconProps) {
	return (
		<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<div
				className="animate-[float_4s_ease-in-out_infinite]"
				style={{ animationDelay: delay }}
			>
				<div className="relative flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-lg ring-1 ring-border/50">
					<HugeiconsIcon icon={icon} className="size-7 text-muted-foreground" />
					{/* Badge overlay */}
					<div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive shadow-md">
						<HugeiconsIcon
							icon={badgeIcon}
							className="size-3.5 text-destructive-foreground"
							strokeWidth={2.5}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
