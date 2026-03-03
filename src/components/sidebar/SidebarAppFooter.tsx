import {
	Invoice03Icon,
	Logout05Icon,
	SparklesIcon,
	UnfoldMoreIcon,
	UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PricingDialog } from "@/components/subscriptions/PricingDialog";
import { UserAvatar } from "@/components/UserAvatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import authClient from "@/lib/auth/auth-client";
import { notifyInspoSnapsExtension } from "@/lib/auth/extension";
import { authQueryOptions } from "@/lib/auth/queries";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";
import { cn } from "@/lib/utils";

export function SidebarAppFooter({
	onOpenSettings,
}: {
	onOpenSettings: () => void;
}) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { isMobile, state } = useSidebar();
	const [pricingOpen, setPricingOpen] = useState(false);

	// Use query directly for reactive updates when user data changes
	const { data: user } = useSuspenseQuery(authQueryOptions());
	const { data: planState } = useQuery(planStateQueryOptions());
	const isPaidPlan =
		planState?.status === "active" || planState?.status === "canceled";
	if (!user) throw new Error("User not found");

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								tooltip="Account"
								className={cn(state === "collapsed" && "rounded-full")}
							>
								<UserAvatar
									imageUrl={user.image || undefined}
									username={user.username || ""}
									size="sm"
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">@{user.username}</span>
									<span className="truncate text-xs text-muted-foreground">
										{user.email}
									</span>
								</div>
								<HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" />
							</SidebarMenuButton>
						}
					/>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<UserAvatar
										imageUrl={user.image || undefined}
										username={user.username || ""}
										size="sm"
									/>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium text-foreground">
											@{user.username}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						{!isPaidPlan && (
							<>
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={() => setPricingOpen(true)}>
										<HugeiconsIcon icon={SparklesIcon} />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={onOpenSettings}>
								<HugeiconsIcon icon={UserAccountIcon} />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => authClient.customer.portal()}>
								<HugeiconsIcon icon={Invoice03Icon} />
								Billing
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={async () => {
								await authClient.signOut({
									fetchOptions: {
										onResponse: async () => {
											// Notify Chrome extension about logout
											notifyInspoSnapsExtension(null);
											// Clear all cached data to prevent stale user-specific
											// data from persisting if another user logs in
											queryClient.clear();
											await router.invalidate();
										},
									},
								});
							}}
						>
							<HugeiconsIcon icon={Logout05Icon} />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
