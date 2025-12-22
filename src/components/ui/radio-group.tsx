import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			className={cn("grid gap-3", className)}
			{...props}
		/>
	);
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio-group-item"
			className={cn(
				"aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs transition-colors",
				"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground",
				className,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator className="flex items-center justify-center">
				<span className="size-1.5 rounded-full bg-current" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	);
}

export { RadioGroup, RadioGroupItem };
