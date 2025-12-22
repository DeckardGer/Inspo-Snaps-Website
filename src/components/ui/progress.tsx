import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends ProgressPrimitive.Root.Props {
	indicatorClassName?: string;
}

function Progress({
	className,
	value,
	indicatorClassName,
	...props
}: ProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			value={value}
			className={cn(
				"bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					"bg-primary h-full flex-1 rounded-full transition-all duration-300 ease-out",
					indicatorClassName,
				)}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
