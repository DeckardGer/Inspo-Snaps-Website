import {
	Cancel01Icon,
	CheckmarkCircle02Icon,
	Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { UploadProgress as UploadProgressType } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
	uploads: UploadProgressType[];
	onClearCompleted: () => void;
	isUploading: boolean;
}

export function UploadProgress({
	uploads,
	onClearCompleted,
	isUploading,
}: UploadProgressProps) {
	const completedCount = uploads.filter(
		(u) => u.status === "success" || u.status === "error",
	).length;
	const hasCompleted = completedCount > 0;

	return (
		<div className="rounded-lg border bg-card p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="text-sm font-medium">
					{isUploading ? "Uploading..." : "Upload Complete"}
				</h3>
				{hasCompleted && !isUploading && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearCompleted}
						className="h-7 text-xs"
					>
						Clear
					</Button>
				)}
			</div>

			<div className="space-y-3">
				{uploads.map((upload) => (
					<UploadItem key={upload.id} upload={upload} />
				))}
			</div>
		</div>
	);
}

function UploadItem({ upload }: { upload: UploadProgressType }) {
	return (
		<div className="flex items-center gap-3">
			{/* Status Icon */}
			<div className="flex-shrink-0">
				{upload.status === "success" ? (
					<HugeiconsIcon
						icon={CheckmarkCircle02Icon}
						className="size-5 text-emerald-500"
					/>
				) : upload.status === "error" ? (
					<HugeiconsIcon
						icon={Cancel01Icon}
						className="size-5 text-destructive"
					/>
				) : (
					<HugeiconsIcon
						icon={Loading03Icon}
						className="size-5 animate-spin text-primary"
					/>
				)}
			</div>

			{/* File Info */}
			<div className="min-w-0 flex-1">
				<p
					className={cn(
						"truncate text-sm",
						upload.status === "error" && "text-destructive",
					)}
				>
					{upload.filename}
				</p>
				{upload.status === "error" && upload.error && (
					<p className="truncate text-xs text-destructive">{upload.error}</p>
				)}
				{(upload.status === "pending" || upload.status === "uploading") && (
					<Progress value={upload.progress} className="mt-1 h-1.5" />
				)}
			</div>

			{/* Progress Percentage */}
			{(upload.status === "pending" || upload.status === "uploading") && (
				<span className="flex-shrink-0 text-xs text-muted-foreground">
					{Math.round(upload.progress)}%
				</span>
			)}
		</div>
	);
}
