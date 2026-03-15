import { Mail01Icon, MailSend01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { sendVerificationEmail } from "@/lib/auth/functions";
import { authQueryOptions } from "@/lib/auth/queries";

const COOLDOWN_SECONDS = 60;

interface EmailVerificationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	checkoutSlug: string | null;
}

export function EmailVerificationModal({
	open,
	onOpenChange,
	checkoutSlug,
}: EmailVerificationModalProps) {
	const { data: user } = useQuery(authQueryOptions());
	const [cooldown, setCooldown] = useState(0);
	const [sent, setSent] = useState(false);
	const hasSentRef = useRef(false);

	const callbackURL = checkoutSlug
		? `/my-folders?checkout-slug=${checkoutSlug}`
		: "/my-folders";

	const send = useCallback(async () => {
		if (cooldown > 0) return;
		try {
			await sendVerificationEmail({ data: { callbackURL } });
			setSent(true);
			setCooldown(COOLDOWN_SECONDS);
		} catch {
			toast.error("Failed to send verification email", {
				description: "Please try again in a moment.",
			});
		}
	}, [cooldown, callbackURL]);

	// Auto-send on first open
	useEffect(() => {
		if (open && !hasSentRef.current) {
			hasSentRef.current = true;
			send();
		}
		if (!open) {
			hasSentRef.current = false;
			setSent(false);
			setCooldown(0);
		}
	}, [open, send]);

	// Countdown timer
	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setInterval(() => {
			setCooldown((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [cooldown]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<HugeiconsIcon
							icon={sent ? MailSend01Icon : Mail01Icon}
							size={24}
							className="text-primary"
							strokeWidth={1.5}
						/>
					</div>
					<DialogTitle className="text-center">
						Verify your email to continue
					</DialogTitle>
					<DialogDescription className="text-center">
						You need to verify your email before purchasing a plan.
						{sent && user?.email && (
							<>
								{" "}
								We've sent a verification link to{" "}
								<span className="font-medium text-foreground">
									{user.email}
								</span>
								.
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="sm:justify-center">
					<Button
						variant="outline"
						onClick={send}
						disabled={cooldown > 0}
						className="w-full sm:w-auto"
					>
						{cooldown > 0
							? `Resend in ${cooldown}s`
							: sent
								? "Resend email"
								: "Send verification email"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
