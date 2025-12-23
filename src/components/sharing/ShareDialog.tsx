import {
	Copy01Icon,
	Delete02Icon,
	Link01Icon,
	Loading03Icon,
	UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clientEnv } from "@/config/env/client";
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

interface ShareDialogProps {
	folder: { id: string; name: string };
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type ExpirationOption = "7" | "30" | "90" | "never";

export function ShareDialog({ folder, open, onOpenChange }: ShareDialogProps) {
	const [expiration, setExpiration] = useState<ExpirationOption>("30");
	const [userIdentifier, setUserIdentifier] = useState("");
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
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["shareLinks", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
			});
			toast.success("Share link created");
		},
		onError: (error) => {
			toast.error("Failed to create share link", {
				description: error.message,
			});
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
			queryClient.invalidateQueries({
				queryKey: ["sharedUsers", folder.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["folders"],
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
			toast.success("Access revoked");
		},
		onError: (error) => {
			toast.error("Failed to revoke access", {
				description: error.message,
			});
		},
	});

	const handleCreateLink = () => {
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
		await navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard");
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

	const getInitials = (name: string | null) => {
		if (!name) return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share "{folder.name}"</DialogTitle>
					<DialogDescription>
						Create a link or share with specific users.
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="link" className="mt-2">
					<TabsList className="w-full">
						<TabsTrigger value="link" className="flex-1">
							<HugeiconsIcon icon={Link01Icon} className="size-4" />
							Link
						</TabsTrigger>
						<TabsTrigger value="users" className="flex-1">
							<HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
							Users
						</TabsTrigger>
					</TabsList>

					<TabsContent value="link" className="space-y-4 pt-4">
						{/* Create new link */}
						<div className="flex gap-2">
							<Select
								value={expiration}
								onValueChange={(v) => setExpiration(v as ExpirationOption)}
							>
								<SelectTrigger className="w-[140px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7">7 days</SelectItem>
									<SelectItem value="30">30 days</SelectItem>
									<SelectItem value="90">90 days</SelectItem>
									<SelectItem value="never">Never expires</SelectItem>
								</SelectContent>
							</Select>
							<Button
								onClick={handleCreateLink}
								disabled={createLinkMutation.isPending}
								className="flex-1"
							>
								{createLinkMutation.isPending ? (
									<HugeiconsIcon
										icon={Loading03Icon}
										className="size-4 animate-spin"
									/>
								) : (
									<HugeiconsIcon icon={Link01Icon} className="size-4" />
								)}
								Create Link
							</Button>
						</div>

						{/* Existing links */}
						<div className="space-y-2">
							{linksLoading ? (
								<div className="flex items-center justify-center py-4">
									<HugeiconsIcon
										icon={Loading03Icon}
										className="size-5 animate-spin text-muted-foreground"
									/>
								</div>
							) : shareLinks && shareLinks.length > 0 ? (
								shareLinks.map((link) => (
									<div
										key={link.id}
										className="flex items-center gap-2 rounded-lg border p-2"
									>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-mono text-muted-foreground truncate">
												{clientEnv.VITE_BASE_URL}/share/{link.id.slice(0, 8)}...
											</p>
											<p className="text-xs text-muted-foreground">
												{formatExpiry(link.expiresAt)}
											</p>
										</div>
										<Button
											size="icon-sm"
											variant="ghost"
											onClick={() => handleCopyLink(link.id)}
										>
											<HugeiconsIcon icon={Copy01Icon} className="size-4" />
										</Button>
										<Button
											size="icon-sm"
											variant="ghost"
											onClick={() =>
												deleteLinkMutation.mutate({ data: { id: link.id } })
											}
											disabled={deleteLinkMutation.isPending}
										>
											<HugeiconsIcon icon={Delete02Icon} className="size-4" />
										</Button>
									</div>
								))
							) : (
								<p className="text-sm text-center text-muted-foreground py-4">
									No share links yet
								</p>
							)}
						</div>
					</TabsContent>

					<TabsContent value="users" className="space-y-4 pt-4">
						{/* Add user form */}
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
								{shareWithUserMutation.isPending ? (
									<HugeiconsIcon
										icon={Loading03Icon}
										className="size-4 animate-spin"
									/>
								) : (
									"Share"
								)}
							</Button>
						</form>

						{/* Shared users list */}
						<div className="space-y-2">
							{usersLoading ? (
								<div className="flex items-center justify-center py-4">
									<HugeiconsIcon
										icon={Loading03Icon}
										className="size-5 animate-spin text-muted-foreground"
									/>
								</div>
							) : sharedUsers && sharedUsers.length > 0 ? (
								sharedUsers.map((share) => (
									<div
										key={share.sharedWith.id}
										className="flex items-center gap-3 rounded-lg border p-2"
									>
										<Avatar className="size-8">
											<AvatarImage
												src={share.sharedWith.image ?? undefined}
												alt={share.sharedWith.name ?? "User"}
											/>
											<AvatarFallback className="text-xs">
												{getInitials(share.sharedWith.name)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{share.sharedWith.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{share.sharedWith.email}
											</p>
										</div>
										<Button
											size="icon-sm"
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
										>
											<HugeiconsIcon icon={Delete02Icon} className="size-4" />
										</Button>
									</div>
								))
							) : (
								<p className="text-sm text-center text-muted-foreground py-4">
									Not shared with anyone yet
								</p>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
