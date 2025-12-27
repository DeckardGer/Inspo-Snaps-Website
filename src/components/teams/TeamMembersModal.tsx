import {
	Cancel01Icon,
	InformationCircleIcon,
	Mail01Icon,
	MoreVerticalIcon,
	SentIcon,
	UserGroupIcon,
	UserRemove02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type TeamMembersModalProps = {
	organizationId: string;
	organizationName: string;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

type Role = "owner" | "member" | "viewer";
type Tier = "free" | "pro" | "team";

type Member = {
	id: string;
	username: string;
	email: string;
	image: string | null;
	role: Role;
	tier: Tier;
};

type Invitation = {
	id: string;
	email: string;
	role: Role;
	sentAt: Date;
};

// Mock data for demonstration
// Free/Pro tier users can only be Viewer
// Team tier users can be either Member or Viewer
const MOCK_MEMBERS: Member[] = [
	{
		id: "1",
		username: "johndoe",
		email: "john@example.com",
		image: null,
		role: "owner",
		tier: "team",
	},
	{
		id: "2",
		username: "janesmith",
		email: "jane@example.com",
		image: null,
		role: "viewer",
		tier: "pro",
	},
	{
		id: "3",
		username: "bobwilson",
		email: "bob@example.com",
		image: null,
		role: "viewer",
		tier: "free",
	},
	{
		id: "4",
		username: "alicejones",
		email: "alice@example.com",
		image: null,
		role: "member",
		tier: "team",
	},
	{
		id: "5",
		username: "charliekim",
		email: "charlie@example.com",
		image: null,
		role: "viewer",
		tier: "free",
	},
	{
		id: "6",
		username: "dianalee",
		email: "diana@example.com",
		image: null,
		role: "viewer",
		tier: "pro",
	},
];

const MOCK_INVITATIONS: Invitation[] = [
	{
		id: "1",
		email: "alice@example.com",
		role: "member",
		sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
	},
];

const ROLE_LABELS: Record<Role, string> = {
	owner: "Owner",
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
	organizationId: _organizationId,
	organizationName,
	trigger,
	open,
	onOpenChange,
}: TeamMembersModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	const [members] = useState<Member[]>(MOCK_MEMBERS);
	const [invitations, setInvitations] =
		useState<Invitation[]>(MOCK_INVITATIONS);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<Role>("member");

	const handleInvite = () => {
		if (!inviteEmail.trim()) return;

		const newInvitation: Invitation = {
			id: crypto.randomUUID(),
			email: inviteEmail.trim(),
			role: inviteRole,
			sentAt: new Date(),
		};

		setInvitations((prev) => [...prev, newInvitation]);
		setInviteEmail("");
		setInviteRole("member");
	};

	const handleCancelInvitation = (invitationId: string) => {
		setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
	};

	const handleResendInvitation = (invitationId: string) => {
		setInvitations((prev) =>
			prev.map((inv) =>
				inv.id === invitationId ? { ...inv, sentAt: new Date() } : inv,
			),
		);
	};

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
						<MembersList members={members} />
					</TabsContent>

					<TabsContent value="invitations" className="mt-4">
						<InvitationsTab
							invitations={invitations}
							inviteEmail={inviteEmail}
							inviteRole={inviteRole}
							onInviteEmailChange={setInviteEmail}
							onInviteRoleChange={setInviteRole}
							onInvite={handleInvite}
							onCancelInvitation={handleCancelInvitation}
							onResendInvitation={handleResendInvitation}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

function MembersList({ members }: { members: Member[] }) {
	return (
		<div>
			<h4 className="text-sm font-medium text-muted-foreground mb-2">
				Members ({members.length})
			</h4>
			<div className="space-y-1 max-h-82 overflow-y-auto -mr-2 pr-2">
				{members.map((member) => (
					<MemberRow key={member.id} member={member} />
				))}
			</div>
		</div>
	);
}

function MemberRow({ member }: { member: Member }) {
	const isOwner = member.role === "owner";

	return (
		<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
			<UserAvatar
				username={member.username}
				imageUrl={member.image}
				size="sm"
			/>

			<div className="flex-1 min-w-0">
				<span className="font-medium truncate block">@{member.username}</span>
				<span className="text-sm text-muted-foreground truncate block">
					{member.email}
				</span>
			</div>

			<Badge variant="outline" className="text-xs shrink-0">
				{ROLE_LABELS[member.role]}
			</Badge>

			{isOwner ? (
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
							<DropdownMenuRadioGroup>
								{member.tier === "team" ? (
									<DropdownMenuRadioItem value="member">
										Member
									</DropdownMenuRadioItem>
								) : (
									<DropdownMenuRadioItem value="member" disabled>
										Member
										<Tooltip>
											<TooltipTrigger
												render={
													<span className="absolute right-2 flex items-center justify-center text-muted-foreground pointer-events-auto">
														<HugeiconsIcon
															icon={InformationCircleIcon}
															className="size-4"
														/>
													</span>
												}
											/>
											<TooltipContent
												side="left"
												className="max-w-56 text-left"
											>
												<p className="font-medium">
													Team subscription required
												</p>
												<p className="mt-1 text-background/70">
													@{member.username} needs a Team subscription to be
													assigned the Member role and edit content.
												</p>
											</TooltipContent>
										</Tooltip>
									</DropdownMenuRadioItem>
								)}
								<DropdownMenuRadioItem value="viewer">
									Viewer
								</DropdownMenuRadioItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive">
									<HugeiconsIcon icon={UserRemove02Icon} />
									Remove member
								</DropdownMenuItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}

function InvitationsTab({
	invitations,
	inviteEmail,
	inviteRole,
	onInviteEmailChange,
	onInviteRoleChange,
	onInvite,
	onCancelInvitation,
	onResendInvitation,
}: {
	invitations: Invitation[];
	inviteEmail: string;
	inviteRole: Role;
	onInviteEmailChange: (email: string) => void;
	onInviteRoleChange: (role: Role) => void;
	onInvite: () => void;
	onCancelInvitation: (id: string) => void;
	onResendInvitation: (id: string) => void;
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
							value={inviteEmail}
							onChange={(e) => onInviteEmailChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									onInvite();
								}
							}}
							className="flex-1"
						/>
						<Select
							value={inviteRole}
							onValueChange={(value) => {
								if (value) onInviteRoleChange(value);
							}}
						>
							<SelectTrigger className="w-28">
								<SelectValue>{ROLE_LABELS[inviteRole]}</SelectValue>
							</SelectTrigger>
							<SelectContent className="min-w-0">
								<SelectItem value="member">Member</SelectItem>
								<SelectItem value="viewer">Viewer</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={onInvite} disabled={!inviteEmail.trim()}>
							<HugeiconsIcon icon={SentIcon} data-icon="inline-start" />
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
}: {
	invitation: Invitation;
	onCancel: () => void;
	onResend: () => void;
}) {
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
					Invited {formatRelativeTime(invitation.sentAt)} as{" "}
					{ROLE_LABELS[invitation.role]}
				</span>
			</div>

			<div className="flex items-center gap-1 shrink-0">
				<Button variant="ghost" size="sm" onClick={onResend}>
					Resend
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={onCancel}>
					<HugeiconsIcon icon={Cancel01Icon} />
					<span className="sr-only">Cancel invitation</span>
				</Button>
			</div>
		</div>
	);
}
