import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-text-primary placeholder:text-text-placeholder selection:bg-bg-brand-solid selection:text-text-white bg-bg-primary h-9 w-full min-w-0 rounded-md px-3 py-1 text-base text-text-primary shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled_subtle disabled:text-text-disabled disabled:inset-ring-border-disabled md:text-sm",
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

export { Input };
