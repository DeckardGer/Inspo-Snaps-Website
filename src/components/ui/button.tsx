import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:bg-bg-disabled disabled:border-border-disabled_subtle disabled:text-fg-disabled [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none ring-offset-2 focus-visible:ring-focus-ring focus-visible:ring-2 aria-invalid:ring-focus-ring-error aria-invalid:border-border-error",
	{
		variants: {
			variant: {
				default:
					"bg-bg-brand-solid text-text-white hover:bg-bg-brand-solid_hover",
				destructive:
					"bg-bg-error-solid text-text-white hover:bg-bg-error-solid_hover focus-visible:ring-focus-ring-error",
				outline:
					"border border-border-primary bg-bg-primary text-text-secondary shadow-xs hover:bg-bg-secondary_hover hover:text-text-secondary_hover",
				secondary:
					"bg-bg-tertiary text-text-tertiary hover:bg-bg-tertiary_hover",
				ghost:
					"text-text-tertiary hover:bg-bg-primary_hover hover:text-text-tertiary_hover",
				link: "text-text-tertiary underline-offset-4 hover:underline hover:text-text-tertiary_hover",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
