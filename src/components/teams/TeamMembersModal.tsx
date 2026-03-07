import {
	Cancel01Icon,
	Loading03Icon,
	Mail01Icon,
	MoreVerticalIcon,
	SentIcon,
	UserGroupIcon,
	UserRemove02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/UserAvatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authQueryOptions } from "@/lib/auth/queries";
import type { AssignableRole, Role } from "@/lib/auth/permissions";
import type {
	OrganizationDetails,
	OrganizationMember,
} from "@/lib/organizations/functions";
import {
	cancelInvitation,
	createInvitation,
	removeMember,
	resendInvitation,
	updateMemberRole,
} from "@/lib/organizations/functions";
import { organizationDetailsQueryOptions } from "@/lib/organizations/queries";

type TeamMembersModalProps = {
	organizationId: string;
	organizationName: string;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

const ROLE_LABELS: Record<Role, string> = {
	owner: "Owner",
	admin: "Admin",
	member: "Member",
	viewer: "Viewer",
};

const ASSIGNABLE_ROLE_LABELS: Record<AssignableRole, string> = {
	admin: "Admin",
	member: "Member",
	viewer: "Viewer",
};

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	return `${Math.floor(diffDays / 30)} months ago`;
}

export function TeamMembersModal({
	organizationId,
	organizationName,
	trigger,
	open,
	onOpenChange,
}: TeamMembersModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	const queryClient = useQueryClient();
	const { data: currentUser } = useQuery(authQueryOptions());

	// Fetch organization details (members + invitations)
	const { data: orgDetails, isLoading } = useQuery({
		...organizationDetailsQueryOptions(organizationId),
		enabled: dialogOpen && !!organizationId,
	});

	const [inviteInput, setInviteInput] = useState("");
	const [inviteRole, setAssignableRole] = useState<AssignableRole>("viewer");

	// Mutations
	const createInviteMutation = useMutation({
		mutationFn: (data: { emailOrUsername: string; role: AssignableRole }) =>
			createInvitation({
				data: {
					organizationId,
					emailOrUsername: data.emailOrUsername,
					role: data.role,
				},
			}),
		onSuccess: () => {
			toast.success("Invitation sent");
			setInviteInput("");
			setAssignableRole("viewer");
			queryClient.invalidateQueries({
				queryKey: ["organizationDetails", organizationId],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const cancelInviteMutation = useMutation({
		mutationFn: (invitationId: string) =>
			cancelInvitation({
				data: { organizationId, invitationId },
			}),
		onSuccess: () => {
			toast.success("Invitation cancelled");
			queryClient.invalidateQueries({
				queryKey: ["organizationDetails", organizationId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const resendInviteMutation = useMutation({
		mutationFn: (invitationId: string) =>
			resendInvitation({
				data: { organizationId, invitationId },
			}),
		onSuccess: () => {
			toast.success("Invitation resent");
			queryClient.invalidateQueries({
				queryKey: ["organizationDetails", organizationId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const handleInvite = () => {
		if (!inviteInput.trim()) return;
		createInviteMutation.mutate({
			emailOrUsername: inviteInput.trim(),
			role: inviteRole,
		});
	};

	const members = orgDetails?.members ?? [];
	const invitations = orgDetails?.pendingInvitations ?? [];

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger}
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Manage Team</DialogTitle>
					<DialogDescription>
						Manage members and invitations for {organizationName}
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="members" className="mt-2">
					<TabsList className="w-full">
						<TabsTrigger value="members" className="flex-1">
							<HugeiconsIcon icon={UserGroupIcon} />
							Members
						</TabsTrigger>
						<TabsTrigger value="invitations" className="flex-1">
							<HugeiconsIcon icon={Mail01Icon} />
							Invitations
						</TabsTrigger>
					</TabsList>

					<TabsContent value="members" className="mt-4">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<HugeiconsIcon
									icon={Loading03Icon}
									className="size-6 animate-spin text-muted-foreground"
								/>
							</div>
						) : (
							<MembersList
								members={members}
								organizationId={organizationId}
								currentUserRole={orgDetails?.currentUserRole ?? "member"}
								currentUserId={currentUser?.id}
							/>
						)}
					</TabsContent>

					<TabsContent value="invitations" className="mt-4">
						<InvitationsTab
							invitations={invitations}
							inviteInput={inviteInput}
							inviteRole={inviteRole}
							onInviteInputChange={setInviteInput}
							onAssignableRoleChange={setAssignableRole}
							onInvite={handleInvite}
							onCancelInvitation={(id) => cancelInviteMutation.mutate(id)}
							onResendInvitation={(id) => resendInviteMutation.mutate(id)}
							isInviting={createInviteMutation.isPending}
							isCancelling={cancelInviteMutation.isPending}
							isResending={resendInviteMutation.isPending}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

function MembersList({
	members,
	organizationId,
	currentUserRole,
	currentUserId,
}: {
	members: OrganizationMember[];
	organizationId: string;
	currentUserRole: string;
	currentUserId?: string;
}) {
	return (
		<div>
			<h4 className="text-sm font-medium text-muted-foreground mb-2">
				Members ({members.length})
			</h4>
			<div className="space-y-1 max-h-82 overflow-y-auto -mr-2 pr-2">
				{members.map((member) => (
					<MemberRow
						key={member.id}
						member={member}
						organizationId={organizationId}
						currentUserRole={currentUserRole}
						currentUserId={currentUserId}
					/>
				))}
			</div>
		</div>
	);
}

function MemberRow({
	member,
	organizationId,
	currentUserRole,
	currentUserId,
}: {
	member: OrganizationMember;
	organizationId: string;
	currentUserRole: string;
	currentUserId?: string;
}) {
	const queryClient = useQueryClient();
	const isOwner = member.role === "owner";
	const isSelf = member.user.id === currentUserId;
	const canManageMembers =
		(currentUserRole === "owner" || currentUserRole === "admin") && !isSelf;

	const removeMemberMutation = useMutation({
		mutationFn: () =>
			removeMember({
				data: { organizationId, memberId: member.id },
			}),
		onSuccess: () => {
			toast.success("Member removed");
			queryClient.invalidateQueries({
				queryKey: ["organizationDetails", organizationId],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const updateRoleMutation = useMutation({
		mutationFn: (newRole: "admin" | "member" | "viewer") =>
			updateMemberRole({
				data: { organizationId, memberId: member.id, newRole },
			}),
		onSuccess: () => {
			toast.success("Role updated");
			queryClient.invalidateQueries({
				queryKey: ["organizationDetails", organizationId],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const username = member.user.username ?? member.user.name;
	const displayRole = ROLE_LABELS[member.role as Role] ?? member.role;

	return (
		<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
			<UserAvatar username={username} imageUrl={member.user.image} size="sm" />

			<div className="flex-1 min-w-0">
				<span className="font-medium truncate block">
					{member.user.username ? `@${member.user.username}` : member.user.name}
				</span>
				<span className="text-sm text-muted-foreground truncate block">
					{member.user.email}
				</span>
			</div>

			<Badge variant="outline" className="text-xs shrink-0">
				{displayRole}
			</Badge>

			{isOwner || !canManageMembers ? (
				<div className="size-8 shrink-0" />
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant="ghost" size="icon-sm" className="shrink-0">
								<HugeiconsIcon icon={MoreVerticalIcon} />
								<span className="sr-only">Member options</span>
							</Button>
						}
					/>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Change Role</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup
								value={member.role}
								onValueChange={(value) => {
									if (
										value === "admin" ||
										value === "member" ||
										value === "viewer"
									) {
										updateRoleMutation.mutate(value);
									}
								}}
							>
								<DropdownMenuRadioItem value="admin">
									Admin
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="member">
									Member
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="viewer">
									Viewer
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => removeMemberMutation.mutate()}
								disabled={removeMemberMutation.isPending}
							>
								<HugeiconsIcon icon={UserRemove02Icon} />
								Remove member
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}

type PendingInvitation = OrganizationDetails["pendingInvitations"][number];

function InvitationsTab({
	invitations,
	inviteInput,
	inviteRole,
	onInviteInputChange,
	onAssignableRoleChange,
	onInvite,
	onCancelInvitation,
	onResendInvitation,
	isInviting,
	isCancelling,
	isResending,
}: {
	invitations: PendingInvitation[];
	inviteInput: string;
	inviteRole: AssignableRole;
	onInviteInputChange: (value: string) => void;
	onAssignableRoleChange: (role: AssignableRole) => void;
	onInvite: () => void;
	onCancelInvitation: (id: string) => void;
	onResendInvitation: (id: string) => void;
	isInviting: boolean;
	isCancelling: boolean;
	isResending: boolean;
}) {
	return (
		<div className="space-y-4">
			{/* Invite Form */}
			<FieldGroup>
				<Field>
					<FieldLabel>Invite members</FieldLabel>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Email or username"
							value={inviteInput}
							onChange={(e) => onInviteInputChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									onInvite();
								}
							}}
							className="flex-1"
							disabled={isInviting}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
						/>
						<Select
							value={inviteRole}
							onValueChange={(value) => {
								if (
									value === "admin" ||
									value === "member" ||
									value === "viewer"
								) {
									onAssignableRoleChange(value);
								}
							}}
							disabled={isInviting}
						>
							<SelectTrigger className="w-28">
								<SelectValue>{ASSIGNABLE_ROLE_LABELS[inviteRole]}</SelectValue>
							</SelectTrigger>
							<SelectContent className="min-w-0">
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="member">Member</SelectItem>
								<SelectItem value="viewer">Viewer</SelectItem>
							</SelectContent>
						</Select>
						<Button
							onClick={onInvite}
							disabled={!inviteInput.trim() || isInviting}
						>
							{isInviting ? (
								<HugeiconsIcon
									icon={Loading03Icon}
									className="animate-spin"
									data-icon="inline-start"
								/>
							) : (
								<HugeiconsIcon icon={SentIcon} data-icon="inline-start" />
							)}
							Invite
						</Button>
					</div>
				</Field>
			</FieldGroup>

			{invitations.length > 0 && (
				<>
					<Separator />
					<div>
						<h4 className="text-sm font-medium text-muted-foreground mb-2">
							Pending Invitations ({invitations.length})
						</h4>
						<div className="space-y-1">
							{invitations.map((invitation) => (
								<InvitationRow
									key={invitation.id}
									invitation={invitation}
									onCancel={() => onCancelInvitation(invitation.id)}
									onResend={() => onResendInvitation(invitation.id)}
									isCancelling={isCancelling}
									isResending={isResending}
								/>
							))}
						</div>
					</div>
				</>
			)}

			{invitations.length === 0 && (
				<div className="text-center py-6 text-muted-foreground">
					<HugeiconsIcon
						icon={Mail01Icon}
						className="size-8 mx-auto mb-2 opacity-50"
					/>
					<p className="text-sm">No pending invitations</p>
				</div>
			)}
		</div>
	);
}

function InvitationRow({
	invitation,
	onCancel,
	onResend,
	isCancelling,
	isResending,
}: {
	invitation: PendingInvitation;
	onCancel: () => void;
	onResend: () => void;
	isCancelling: boolean;
	isResending: boolean;
}) {
	const displayRole =
		ROLE_LABELS[(invitation.role ?? "viewer") as Role] ?? invitation.role;

	return (
		<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
			<Avatar>
				<AvatarFallback className="bg-muted">
					<HugeiconsIcon
						icon={Mail01Icon}
						className="size-4 text-muted-foreground"
					/>
				</AvatarFallback>
			</Avatar>

			<div className="flex-1 min-w-0">
				<span className="font-medium truncate block">{invitation.email}</span>
				<span className="text-sm text-muted-foreground">
					Invited {formatRelativeTime(new Date(invitation.createdAt))} as{" "}
					{displayRole}
				</span>
			</div>

			<div className="flex items-center gap-1 shrink-0">
				<Button
					variant="ghost"
					size="sm"
					onClick={onResend}
					disabled={isResending}
				>
					Resend
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={onCancel}
					disabled={isCancelling}
				>
					<HugeiconsIcon icon={Cancel01Icon} />
					<span className="sr-only">Cancel invitation</span>
				</Button>
			</div>
		</div>
	);
}
