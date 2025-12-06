import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Google } from "@/components/ui/svgs/google";

export const Route = createFileRoute("/(auth-pages)/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen p-2">
			<div className="w-2/5 py-4 px-8 flex flex-col justify-between">
				<div className="flex justify-between">
					<div>Icon</div>
					<div>Right</div>
				</div>
				<div className="flex items-center justify-center">
					<div className="flex flex-col items-center max-w-100 w-full">
						<div className="flex justify-center items-center p-4 rounded-full bg-linear-to-t from-bg-primary to-bg-tertiary">
							<div className="flex items-center justify-center bg-bg-primary rounded-full p-4 border border-border-primary">
								<HugeiconsIcon
									icon={UserIcon}
									size={36}
									className="text-fg-secondary"
								/>
							</div>
						</div>
						<div className="flex flex-col items-center gap-1 mt-2">
							<h1 className="text-2xl font-medium">Login to your account</h1>
							<span className="text-text-tertiary">
								Enter your details to login.
							</span>
						</div>
						<div className="flex gap-3 w-full mt-8">
							<Button variant="outline" className="flex-1">
								<Google />
								Login with Google
							</Button>
						</div>
					</div>
				</div>
				<div className="text-sm text-text-tertiary">
					&copy; 2025 InspoSnaps.com
				</div>
			</div>
			<div className="flex justify-center items-center w-3/5 bg-bg-tertiary rounded-2xl">
				<div className="flex justify-center items-center w-200 h-160 bg-bg-quaternary">
					Social Proof
				</div>
			</div>
		</div>
	);
}
