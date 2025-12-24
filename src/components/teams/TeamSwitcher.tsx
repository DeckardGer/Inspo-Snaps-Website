import {
	AddTeamIcon,
	ArrowDown01Icon,
	ArrowRight01Icon,
	Delete02Icon,
	PencilEdit01Icon,
	Tick02Icon,
	UserAdd02Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authClient from "@/lib/auth/auth-client";
import {
	userOrganizationsQueryOptions,
	userOrganizationsWithActiveQueryOptions,
} from "@/lib/organizations/queries";
import { cn } from "@/lib/utils";
import { TeamModal } from "./TeamModal";

type TeamSwitcherProps = {
	currentOrgId: string;
	currentOrgName: string;
};

export function TeamSwitcher({
	currentOrgId,
	currentOrgName,
}: TeamSwitcherProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
	const [teamModalOpen, setTeamModalOpen] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: organizations = [] } = useQuery(
		userOrganizationsQueryOptions(),
	);

	const setActiveMutation = useMutation({
		mutationFn: async (organizationId: string) => {
			await authClient.organization.setActive({ organizationId });
		},
		onSuccess: () => {
			// Invalidate the query to refetch with new active org
			queryClient.invalidateQueries({
				queryKey: userOrganizationsWithActiveQueryOptions().queryKey,
			});
		},
	});

	const handleTeamSelect = async (orgId: string) => {
		// Close the dropdown
		setDropdownOpen(false);

		if (orgId === currentOrgId) return;

		// Set the organization as active
		setActiveMutation.mutate(orgId);

		// Navigate to the new team
		navigate({
			to: "/team-folders/$orgId/{-$folderId}",
			params: { orgId },
		});
	};

	const handleDropdownOpenChange = (open: boolean) => {
		setDropdownOpen(open);
		if (!open) {
			setOpenSubMenuId(null);
		}
	};

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownOpenChange}>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						className="gap-2 text-xl font-semibold h-auto px-2 py-1 -ml-[9px]"
					>
						{currentOrgName}
						<HugeiconsIcon
							icon={ArrowDown01Icon}
							className="size-5 text-tertiary"
						/>
					</Button>
				}
			/>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="start"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-muted-foreground text-xs">
						Teams
					</DropdownMenuLabel>
					{organizations.map((org) => {
						const isActive = org.id === currentOrgId;
						const isSubMenuOpen = openSubMenuId === org.id;
						return (
							<DropdownMenuSub
								key={org.id}
								onOpenChange={(open) => setOpenSubMenuId(open ? org.id : null)}
							>
								<DropdownMenuSubTrigger
									showArrow={false}
									onClick={() => handleTeamSelect(org.id)}
									className={cn(
										"group/team-item gap-2 p-2",
										isActive && "bg-accent",
										isSubMenuOpen && "bg-accent text-accent-foreground",
									)}
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
										{org.logo ? (
											<img
												src={org.logo}
												alt={org.name}
												className="size-full rounded-md object-cover"
											/>
										) : (
											<HugeiconsIcon
												icon={UserGroupIcon}
												className={cn(
													"size-3.5 text-muted-foreground",
													(isActive || isSubMenuOpen) && "text-accent-foreground",
												)}
											/>
										)}
									</div>
									<span className="flex-1 truncate">{org.name}</span>
									{isActive && !isSubMenuOpen && (
										<HugeiconsIcon
											icon={Tick02Icon}
											className="size-4 text-primary group-hover/team-item:hidden"
										/>
									)}
									<HugeiconsIcon
										icon={ArrowRight01Icon}
										strokeWidth={2}
										className={cn(
											"ml-auto hidden group-hover/team-item:block",
											isSubMenuOpen && "block",
										)}
									/>
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="min-w-40">
									<DropdownMenuItem>
										<HugeiconsIcon icon={PencilEdit01Icon} />
										Edit Team
									</DropdownMenuItem>
									<DropdownMenuItem>
										<HugeiconsIcon icon={UserAdd02Icon} />
										Invite Members
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">
										<HugeiconsIcon icon={Delete02Icon} />
										Delete Team
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						);
					})}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => setTeamModalOpen(true)}
						className="gap-2 p-2"
					>
						<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
							<HugeiconsIcon
								icon={AddTeamIcon}
								className="size-3.5 text-muted-foreground"
							/>
						</div>
						<div className="text-muted-foreground font-medium">Add Team</div>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>

			<TeamModal open={teamModalOpen} onOpenChange={setTeamModalOpen} />
		</DropdownMenu>
	);
}
