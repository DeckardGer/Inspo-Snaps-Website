import { Folder01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
import { FOLDER_CLASSES } from "@/lib/folders/constants";
import { pendingInvitationsQueryOptions } from "@/lib/sharing/queries";
import { cn } from "@/lib/utils";

export function InvitationsDropdown() {
	const { data: invitations } = useQuery(pendingInvitationsQueryOptions());

	const count = invitations?.length ?? 0;

	if (count === 0) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" className="relative">
						<HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
						<span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
							{count > 9 ? "9+" : count}
						</span>
						<span className="sr-only">
							{count} pending {count === 1 ? "invitation" : "invitations"}
						</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-72">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Pending Invitations ({count})</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<div className="max-h-64 overflow-y-auto">
						{invitations?.map((invitation) => {
							const colors = FOLDER_CLASSES[invitation.folder.color];
							return (
								<DropdownMenuItem
									key={invitation.folder.id}
									className="p-0"
									preserveColors
									render={
										<Link
											to="/invite/$folderId"
											params={{ folderId: invitation.folder.id }}
											className="flex items-center gap-3 w-full px-2 py-2"
										/>
									}
								>
									{/* Folder icon */}
									<div
										className={cn(
											"flex shrink-0 items-center justify-center size-9 rounded-lg",
											colors.background,
										)}
									>
										<div
											className={cn(
												"flex items-center justify-center size-6 rounded-full",
												colors.foreground,
											)}
										>
											{invitation.folder.emoji ? (
												<span className="text-sm leading-none">
													{invitation.folder.emoji}
												</span>
											) : (
												<HugeiconsIcon
													icon={Folder01Icon}
													className={cn("size-3", colors.icon)}
													fill="currentColor"
												/>
											)}
										</div>
									</div>

									{/* Folder info */}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{invitation.folder.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											From {invitation.sharedBy.name ?? "Unknown"}
										</p>
									</div>
								</DropdownMenuItem>
							);
						})}
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="justify-center text-muted-foreground"
						render={
							<Link to="/shared-folders" className="w-full text-center" />
						}
					>
						View all shared folders
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
