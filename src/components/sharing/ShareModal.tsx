import {
	ArrowDown01Icon,
	Copy01Icon,
	Delete02Icon,
	Link04Icon,
	Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/UserAvatar";
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
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { clientEnv } from "@/config/env/client";
import { trackFirstShare, trackShareModalOpened } from "@/lib/analytics/events";
import {
	createShareLink,
	deleteShareLink,
	revokeUserShare,
	shareWithUser,
} from "@/lib/sharing/functions";
import {
	sharedUsersQueryOptions,
	shareLinksQueryOptions,
} from "@/lib/sharing/queries";
import { cn } from "@/lib/utils";

interface ShareModalProps {
	folder: { id: string; name: string };
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type ExpirationOption = "7" | "30" | "90" | "never";

const EXPIRATION_OPTIONS: { value: ExpirationOption; label: string }[] = [
	{ value: "7", label: "7 days" },
	{ value: "30", label: "30 days" },
	{ value: "90", label: "90 days" },
	{ value: "never", label: "Never expires" },
];

export function ShareModal({ folder, open, onOpenChange }: ShareModalProps) {
	const [userIdentifier, setUserIdentifier] = useState("");
	const [isCreatingLink, setIsCreatingLink] = useState(false);
	const queryClient = useQueryClient();

	// Queries
	const { data: shareLinks, isLoading: linksLoading } = useQuery({
		...shareLinksQueryOptions(folder.id),
		enabled: open,
	});

	const { data: sharedUsers, isLoading: usersLoading } = useQuery({
		...sharedUsersQueryOptions(folder.id),
		enabled: open,
	});

	// Mutations
	const createLinkMutation = useMutation({
		mutationFn: createShareLink,
		onSuccess: async (data) => {
			trackFirstShare("link");
			queryClient.invalidateQueries({
				queryKey: ["shareLinks", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
			});
			// Try to copy the newly created link to clipboard
			const url = `${clientEnv.VITE_BASE_URL}/share/${data.id}`;
			try {
				await navigator.clipboard.writeText(url);
				toast.success("Link created and copied to clipboard");
			} catch {
				// Clipboard access denied - user can manually copy
				toast.success("Link created", {
					description: "Click the copy button to copy the link",
				});
			}
			setIsCreatingLink(false);
		},
		onError: (error) => {
			toast.error("Failed to create share link", {
				description: error.message,
			});
			setIsCreatingLink(false);
		},
	});

	const deleteLinkMutation = useMutation({
		mutationFn: deleteShareLink,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["shareLinks", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
			});
			toast.success("Share link deleted");
		},
		onError: (error) => {
			toast.error("Failed to delete share link", {
				description: error.message,
			});
		},
	});

	const shareWithUserMutation = useMutation({
		mutationFn: shareWithUser,
		onSuccess: (data) => {
			trackFirstShare("user");
			queryClient.invalidateQueries({
				queryKey: ["sharedUsers", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
			setUserIdentifier("");
			toast.success(`Shared with ${data.sharedWithName}`);
		},
		onError: (error) => {
			toast.error("Failed to share", {
				description: error.message,
			});
		},
	});

	const revokeShareMutation = useMutation({
		mutationFn: revokeUserShare,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sharedUsers", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
			});
			queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
			toast.success("Access revoked");
		},
		onError: (error) => {
			toast.error("Failed to revoke access", {
				description: error.message,
			});
		},
	});

	const handleCreateLinkWithExpiration = (expiration: ExpirationOption) => {
		setIsCreatingLink(true);
		const expiresAt =
			expiration === "never"
				? null
				: new Date(Date.now() + Number(expiration) * 24 * 60 * 60 * 1000);

		createLinkMutation.mutate({
			data: { folderId: folder.id, expiresAt },
		});
	};

	const handleCopyLink = async (linkId: string) => {
		const url = `${clientEnv.VITE_BASE_URL}/share/${linkId}`;
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard");
		} catch {
			toast.error("Failed to copy link", {
				description: "Please copy the link manually",
			});
		}
	};

	const handleShareWithUser = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userIdentifier.trim()) return;

		shareWithUserMutation.mutate({
			data: { folderId: folder.id, identifier: userIdentifier.trim() },
		});
	};

	const formatExpiry = (date: Date | null) => {
		if (!date) return "Never expires";
		const now = new Date();
		const diff = date.getTime() - now.getTime();
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
		if (days <= 0) return "Expired";
		if (days === 1) return "Expires in 1 day";
		return `Expires in ${days} days`;
	};

	const hasActiveLinks = shareLinks && shareLinks.length > 0;
	const hasSharedUsers = sharedUsers && sharedUsers.length > 0;

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (isOpen) trackShareModalOpened();
				onOpenChange(isOpen);
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share "{folder.name}"</DialogTitle>
					<DialogDescription>
						Create a link or share with specific users.
					</DialogDescription>
				</DialogHeader>

				{/* Generate Link Section */}
				<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl overflow-hidden">
					<div className="flex justify-center items-center size-10 bg-background border rounded-lg shrink-0">
						<HugeiconsIcon icon={Link04Icon} className="size-5" />
					</div>
					<div className="flex-1 min-w-0 overflow-hidden">
						<p className="text-sm font-medium truncate">Shareable link</p>
						<p className="text-xs text-muted-foreground truncate">
							Generate a read-only link to share
						</p>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger
							className="shrink-0"
							render={
								<Button size="sm" disabled={isCreatingLink}>
									Generate
									<HugeiconsIcon
										icon={ArrowDown01Icon}
										className="size-4 ml-1"
									/>
								</Button>
							}
						/>
						<DropdownMenuContent align="end">
							{EXPIRATION_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onClick={() => handleCreateLinkWithExpiration(option.value)}
								>
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Existing Links */}
				{linksLoading ? (
					<div className="flex items-center justify-center py-4">
						<HugeiconsIcon
							icon={Loading03Icon}
							className="size-5 animate-spin text-muted-foreground"
						/>
					</div>
				) : hasActiveLinks ? (
					<div>
						<p className="text-xs text-muted-foreground mb-2">
							{shareLinks.length} active{" "}
							{shareLinks.length === 1 ? "link" : "links"}
						</p>
						<div className="space-y-2 max-h-38 overflow-y-auto">
							{shareLinks.map((link) => (
								<div
									key={link.id}
									className="group flex items-center gap-2 rounded-lg border p-2.5"
								>
									<div className="flex-1 min-w-0">
										<p className="text-xs font-mono text-accent-foreground truncate">
											{clientEnv.VITE_BASE_URL}/share/{link.id.slice(0, 8)}...
										</p>
										<p className="text-xs text-muted-foreground">
											{formatExpiry(link.expiresAt)}
										</p>
									</div>
									<Button
										size="icon-xs"
										variant="ghost"
										onClick={() => handleCopyLink(link.id)}
										className="opacity-60 hover:opacity-100"
									>
										<HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
									</Button>
									<Button
										size="icon-xs"
										variant="ghost"
										onClick={() =>
											deleteLinkMutation.mutate({ data: { id: link.id } })
										}
										disabled={deleteLinkMutation.isPending}
										className="opacity-60 hover:opacity-100 text-muted-foreground hover:text-destructive"
									>
										<HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
									</Button>
								</div>
							))}
						</div>
					</div>
				) : null}

				<Separator />

				{/* Invite Users Section */}
				<div>
					<p className="text-sm font-medium mb-2">Invite people</p>
					<form onSubmit={handleShareWithUser} className="flex gap-2">
						<Input
							placeholder="Email or username"
							value={userIdentifier}
							onChange={(e) => setUserIdentifier(e.target.value)}
							className="flex-1"
						/>
						<Button
							type="submit"
							disabled={
								shareWithUserMutation.isPending || !userIdentifier.trim()
							}
						>
							Invite
						</Button>
					</form>
				</div>

				{/* Shared Users List */}
				{usersLoading ? (
					<div className="flex items-center justify-center py-4">
						<HugeiconsIcon
							icon={Loading03Icon}
							className="size-5 animate-spin text-muted-foreground"
						/>
					</div>
				) : hasSharedUsers ? (
					<div>
						<p className="text-xs text-muted-foreground mb-2">
							{sharedUsers.length}{" "}
							{sharedUsers.length === 1 ? "person has" : "people have"} access
						</p>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{sharedUsers.map((share) => (
								<div
									key={share.sharedWith.id}
									className="flex items-center gap-3 rounded-lg border p-2.5"
								>
									<UserAvatar
										username={share.sharedWith.name ?? share.sharedWith.email}
										imageUrl={share.sharedWith.image}
										size="sm"
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate leading-tight">
											{share.sharedWith.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{share.sharedWith.email}
										</p>
									</div>
									<Badge
										variant="outline"
										className={cn(
											"bg-accent",
											share.status === "accepted" && "text-green-400",
										)}
									>
										{share.status === "accepted" ? "Accepted" : "Pending"}
									</Badge>
									<Button
										size="icon-xs"
										variant="ghost"
										onClick={() =>
											revokeShareMutation.mutate({
												data: {
													folderId: folder.id,
													userId: share.sharedWith.id,
												},
											})
										}
										disabled={revokeShareMutation.isPending}
										className="text-muted-foreground hover:text-destructive"
									>
										<HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
									</Button>
								</div>
							))}
						</div>
					</div>
				) : (
					<p className="text-xs text-muted-foreground text-center py-4">
						No one has been invited yet
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
