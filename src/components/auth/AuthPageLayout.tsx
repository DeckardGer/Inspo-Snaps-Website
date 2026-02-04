import type { ReactNode } from "react";

interface AuthPageLayoutProps {
	children: ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
	return (
		<div className="flex h-screen p-2">
			<div className="w-full lg:w-2/5 lg:max-w-200 flex flex-col">
				<div className="flex justify-between text-muted-foreground py-4 px-8">
					<div>InspoSnaps Icon</div>
				</div>
				<div className="flex-1 overflow-y-auto px-8">
					<div className="flex items-center justify-center min-h-full">
						{children}
					</div>
				</div>
				<div className="text-sm text-muted-foreground py-4 px-8">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="hidden lg:flex lg:w-3/5 flex-1 justify-center items-center bg-secondary rounded-2xl">
				{/* Future: Add marketing content, illustrations, or testimonials here */}
			</div>
		</div>
	);
}
