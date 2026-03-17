import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PendingReviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onContinue: () => void;
}

export function PendingReviewDialog({
	open,
	onOpenChange,
	onContinue,
}: PendingReviewDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-amber-100 text-amber-600">
						<HugeiconsIcon icon={Alert02Icon} size={32} strokeWidth={2} />
					</AlertDialogMedia>
					<AlertDialogTitle>Extension Pending Review</AlertDialogTitle>
					<AlertDialogDescription>
						The InspoSnaps browser extension is currently pending review on the
						Chrome Web Store. Functionality will be limited until the extension
						has been published. Your free trial period will begin immediately
						upon signing up.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
