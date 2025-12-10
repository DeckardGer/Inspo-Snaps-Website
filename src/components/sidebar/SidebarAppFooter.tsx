import {
	Invoice03Icon,
	Logout05Icon,
	SparklesIcon,
	UnfoldMoreIcon,
	UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
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
import type { AuthQueryResult } from "@/lib/auth/queries";
import { authQueryOptions } from "@/lib/auth/queries";
import { cn } from "@/lib/utils";

export function SidebarAppFooter({
	user,
}: {
	user: NonNullable<AuthQueryResult>;
}) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { isMobile, state } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className={cn(state === "collapsed" && "rounded-full")}
						>
							<UserAvatar
								imageUrl={user.image || undefined}
								username={user.username || ""}
								size="sm"
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">@{user.username}</span>
								<span className="truncate text-xs text-text-tertiary">
									{user.email}
								</span>
							</div>
							<HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<UserAvatar
									imageUrl={user.image || undefined}
									username={user.username || ""}
									size="sm"
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">@{user.username}</span>
									<span className="truncate text-xs text-text-tertiary">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<HugeiconsIcon icon={SparklesIcon} />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<HugeiconsIcon icon={UserAccountIcon} />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
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
											// manually set to null to avoid unnecessary refetching
											queryClient.setQueryData(
												authQueryOptions().queryKey,
												null,
											);
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
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
