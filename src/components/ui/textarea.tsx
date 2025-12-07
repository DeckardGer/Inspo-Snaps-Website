import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"placeholder:text-text-placeholder bg-bg-primary flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:bg-bg-disabled_subtle disabled:text-text-disabled disabled:inset-ring-border-disabled md:text-sm",
				"inset-ring-1 inset-ring-border-primary",
				"focus-visible:inset-ring-focus-ring focus-visible:inset-ring-2",
				"aria-invalid:inset-ring-border-error_subtle",
				"aria-invalid:focus-visible:inset-ring-border-error",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
