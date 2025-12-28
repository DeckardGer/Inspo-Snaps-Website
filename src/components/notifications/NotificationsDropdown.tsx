import { Notification02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { markAllAsRead } from "@/lib/notifications/functions";
import {
	notificationsQueryOptions,
	unreadCountQueryOptions,
} from "@/lib/notifications/queries";
import { NotificationItem } from "./NotificationItem";

export function NotificationsDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();

	const { data: countData } = useQuery(unreadCountQueryOptions());
	const { data: notifications } = useQuery({
		...notificationsQueryOptions(),
		enabled: isOpen, // Only fetch when dropdown is open
	});

	const markAllReadMutation = useMutation({
		mutationFn: () => markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	const count = countData?.count ?? 0;
	const hasUnread = count > 0;

	// Split notifications into unread and read
	const unreadNotifications = notifications?.filter((n) => !n.read) ?? [];
	const readNotifications = notifications?.filter((n) => n.read) ?? [];

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" className="relative">
						<HugeiconsIcon icon={Notification02Icon} strokeWidth={2} />
						{hasUnread && (
							<span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
								{count > 9 ? "9+" : count}
							</span>
						)}
						<span className="sr-only">
							{count} unread {count === 1 ? "notification" : "notifications"}
						</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuGroup>
					<div className="flex items-center justify-between px-2 py-1.5">
						<DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
						{hasUnread && (
							<button
								type="button"
								onClick={() => markAllReadMutation.mutate()}
								className="text-xs text-muted-foreground hover:text-foreground transition-colors"
								disabled={markAllReadMutation.isPending}
							>
								Mark all as read
							</button>
						)}
					</div>
					<DropdownMenuSeparator />

					<div className="max-h-96 overflow-y-auto">
						{!notifications?.length ? (
							<div className="py-8 text-center text-muted-foreground text-sm">
								No notifications yet
							</div>
						) : (
							<>
								{/* Unread notifications */}
								{unreadNotifications.length > 0 && (
									<>
										<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
											New
										</DropdownMenuLabel>
										{unreadNotifications.map((notification) => (
											<NotificationItem
												key={notification.id}
												notification={notification}
												onClose={handleClose}
											/>
										))}
									</>
								)}

								{/* Read notifications */}
								{readNotifications.length > 0 && (
									<>
										{unreadNotifications.length > 0 && (
											<DropdownMenuSeparator className="my-2" />
										)}
										<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
											Earlier
										</DropdownMenuLabel>
										{readNotifications.map((notification) => (
											<NotificationItem
												key={notification.id}
												notification={notification}
												onClose={handleClose}
											/>
										))}
									</>
								)}
							</>
						)}
					</div>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
