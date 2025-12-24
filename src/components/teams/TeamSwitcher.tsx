import {
	AddTeamIcon,
	ArrowDown01Icon,
	Tick02Icon,
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
		if (orgId === currentOrgId) return;

		// Set the organization as active
		setActiveMutation.mutate(orgId);

		// Navigate to the new team
		navigate({
			to: "/team-folders/$orgId/{-$folderId}",
			params: { orgId },
		});
	};

	return (
		<DropdownMenu>
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
						return (
							<DropdownMenuItem
								key={org.id}
								onClick={() => handleTeamSelect(org.id)}
								className={cn("gap-2 p-2", isActive && "bg-accent")}
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
												isActive && "text-accent-foreground",
											)}
										/>
									)}
								</div>
								<span className="flex-1 truncate">{org.name}</span>
								{isActive && (
									<HugeiconsIcon
										icon={Tick02Icon}
										className="size-4 text-primary"
									/>
								)}
							</DropdownMenuItem>
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
