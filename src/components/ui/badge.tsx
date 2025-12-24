import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-brand focus-visible:ring-brand/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error transition-colors overflow-hidden group/badge",
	{
		variants: {
			variant: {
				default:
					"bg-brand-solid text-primary_on-brand [a]:hover:bg-brand-solid_hover",
				secondary: "bg-secondary text-secondary [a]:hover:bg-secondary_hover",
				destructive:
					"bg-error-secondary [a]:hover:bg-error-secondary/80 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 text-error-primary",
				outline:
					"border-secondary text-primary [a]:hover:bg-secondary [a]:hover:text-tertiary",
				ghost:
					"hover:bg-secondary hover:text-tertiary dark:hover:bg-secondary/50",
				link: "text-brand-primary underline-offset-4 hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ className, variant })),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
		},
	});
}

export { Badge, badgeVariants };
