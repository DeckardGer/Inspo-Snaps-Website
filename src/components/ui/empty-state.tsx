import { cn } from "@/lib/utils";

interface EmptyStateProps {
	/** The illustration/icon section */
	illustration: React.ReactNode;
	/** Main heading text */
	title: string;
	/** Description text below the title */
	description: string;
	/** CTA buttons/actions */
	actions?: React.ReactNode;
	/** Additional class names for the container */
	className?: string;
}

/**
 * A reusable empty state template with illustration, title, description, and actions.
 * Used for empty folder states, empty lists, etc.
 */
export function EmptyState({
	illustration,
	title,
	description,
	actions,
	className,
}: EmptyStateProps) {
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
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					{description}
				</p>
			</div>

			{/* Actions */}
			{actions && (
				<div className="flex flex-col items-center gap-4 w-full max-w-xs">
					{actions}
				</div>
			)}
		</div>
	);
}

interface FloatingIconProps {
	/** The icon element to render */
	children: React.ReactNode;
	/** Animation delay (e.g., "-1s", "0s") */
	delay?: string;
	/** Opacity (0-1) */
	opacity?: number;
	/** Position styles */
	position?: {
		top?: string;
		right?: string;
		bottom?: string;
		left?: string;
	};
	/** Additional class names */
	className?: string;
}

/**
 * A floating animated icon for use in empty state illustrations.
 * Applies the standard float animation with configurable delay and opacity.
 */
export function FloatingIcon({
	children,
	delay = "0s",
	opacity = 1,
	position,
	className,
}: FloatingIconProps) {
	return (
		<div
			className={cn("absolute", className)}
			style={{
				top: position?.top,
				right: position?.right,
				bottom: position?.bottom,
				left: position?.left,
			}}
		>
			<div
				className="animate-[float_3s_ease-in-out_infinite]"
				style={{ animationDelay: delay, opacity }}
			>
				{children}
			</div>
		</div>
	);
}

interface IllustrationContainerProps {
	/** Content to render inside the container */
	children: React.ReactNode;
	/** Background glow color class (e.g., "bg-primary/20") */
	glowColor?: string;
	/** Additional class names */
	className?: string;
}

/**
 * Container for empty state illustrations with optional background glow.
 */
export function IllustrationContainer({
	children,
	glowColor = "bg-primary/20",
	className,
}: IllustrationContainerProps) {
	return (
		<div
			className={cn(
				"relative flex h-32 w-64 items-center justify-center",
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
