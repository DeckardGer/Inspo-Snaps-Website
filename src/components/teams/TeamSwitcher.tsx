import {
	AddTeamIcon,
	ArrowDown01Icon,
	ArrowRight01Icon,
	Delete02Icon,
	Loading03Icon,
	Logout01Icon,
	PencilEdit01Icon,
	Tick02Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { leaveOrganization } from "@/lib/organizations/functions";
import {
	userOrganizationsQueryOptions,
	userOrganizationsWithActiveQueryOptions,
} from "@/lib/organizations/queries";
import { planStateQueryOptions } from "@/lib/subscriptions/queries";
import { cn } from "@/lib/utils";
import { TeamMembersModal } from "./TeamMembersModal";
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
	const [membersModalOrg, setMembersModalOrg] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [leaveDialogOrg, setLeaveDialogOrg] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [editModalOrg, setEditModalOrg] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: organizations = [] } = useQuery(
		userOrganizationsQueryOptions(),
	);
	const { data: planState } = useQuery(planStateQueryOptions());
	const canCreateTeam =
		planState?.plan === "team" || planState?.plan === "trial";

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

	const leaveMutation = useMutation({
		mutationFn: (organizationId: string) =>
			leaveOrganization({ data: { organizationId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["organizations"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favouriteFolders"],
			});
			toast.success("Left team", {
				description: `You are no longer a member of "${leaveDialogOrg?.name}".`,
			});
			setLeaveDialogOrg(null);

			// Navigate to team-folders root if we left the current org
			if (leaveDialogOrg?.id === currentOrgId) {
				navigate({ to: "/team-folders" });
			}
		},
		onError: (error) => {
			toast.error("Failed to leave team", {
				description: error.message,
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
						const isOwner = org.role === "owner";
						const isAdmin = org.role === "admin";
						return (
							<DropdownMenuSub
								key={org.id}
								onOpenChange={(open) => setOpenSubMenuId(open ? org.id : null)}
							>
								<DropdownMenuSubTrigger
									showArrow={false}
									delay={250}
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
													(isActive || isSubMenuOpen) &&
														"text-accent-foreground",
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
									{isOwner && (
										<DropdownMenuItem
											onClick={() => {
												setDropdownOpen(false);
												setEditModalOrg({ id: org.id, name: org.name });
											}}
										>
											<HugeiconsIcon icon={PencilEdit01Icon} />
											Edit Team
										</DropdownMenuItem>
									)}
									{(isOwner || isAdmin) && (
										<DropdownMenuItem
											onClick={() => {
												setDropdownOpen(false);
												setMembersModalOrg({ id: org.id, name: org.name });
											}}
										>
											<HugeiconsIcon icon={UserGroupIcon} />
											Manage Team
										</DropdownMenuItem>
									)}
									{isOwner && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem variant="destructive">
												<HugeiconsIcon icon={Delete02Icon} />
												Delete Team
											</DropdownMenuItem>
										</>
									)}
									{!isOwner && (
										<>
											{isAdmin && <DropdownMenuSeparator />}
											<DropdownMenuItem
												variant="destructive"
												onClick={() => {
													setDropdownOpen(false);
													setLeaveDialogOrg({ id: org.id, name: org.name });
												}}
											>
												<HugeiconsIcon icon={Logout01Icon} />
												Leave Team
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						);
					})}
				</DropdownMenuGroup>
				{canCreateTeam && (
				<>
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
				</>
			)}
			</DropdownMenuContent>

			<TeamModal open={teamModalOpen} onOpenChange={setTeamModalOpen} />

			<TeamModal
				team={editModalOrg ?? undefined}
				open={!!editModalOrg}
				onOpenChange={(open) => {
					if (!open) setEditModalOrg(null);
				}}
			/>

			{membersModalOrg && (
				<TeamMembersModal
					organizationId={membersModalOrg.id}
					organizationName={membersModalOrg.name}
					open={!!membersModalOrg}
					onOpenChange={(open) => {
						if (!open) setMembersModalOrg(null);
					}}
				/>
			)}

			{/* Leave Team confirmation dialog */}
			<AlertDialog
				open={!!leaveDialogOrg}
				onOpenChange={(open) => {
					if (!open) setLeaveDialogOrg(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave team?</AlertDialogTitle>
						<AlertDialogDescription>
							You will lose access to all folders and content in "
							{leaveDialogOrg?.name}". You'll need a new invitation to rejoin.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={leaveMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => {
								if (leaveDialogOrg) {
									leaveMutation.mutate(leaveDialogOrg.id);
								}
							}}
							disabled={leaveMutation.isPending}
						>
							{leaveMutation.isPending ? (
								<>
									<HugeiconsIcon
										icon={Loading03Icon}
										className="animate-spin"
									/>
									Leaving...
								</>
							) : (
								"Leave Team"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DropdownMenu>
	);
}
