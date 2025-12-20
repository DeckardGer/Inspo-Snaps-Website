import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type FolderIconProps = {
	color?: string | null;
	emoji?: string | null;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const colorClasses = {
	slate: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
	red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
	orange:
		"bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
	amber: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
	yellow:
		"bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
	lime: "bg-lime-100 text-lime-600 dark:bg-lime-900 dark:text-lime-400",
	green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
	emerald:
		"bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400",
	teal: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
	cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400",
	sky: "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400",
	blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
	indigo:
		"bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
	violet:
		"bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400",
	purple:
		"bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
	fuchsia:
		"bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900 dark:text-fuchsia-400",
	pink: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
	rose: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400",
};

const sizeClasses = {
	sm: {
		container: "size-8",
		icon: "size-4",
		emoji: "text-base",
	},
	md: {
		container: "size-10",
		icon: "size-5",
		emoji: "text-lg",
	},
	lg: {
		container: "size-12",
		icon: "size-6",
		emoji: "text-xl",
	},
};

export function FolderIcon({
	color = "slate",
	emoji,
	size = "md",
	className,
}: FolderIconProps) {
	const folderColor = color || "slate";
	const colorClass =
		colorClasses[folderColor as keyof typeof colorClasses] ||
		colorClasses.slate;
	const sizeClass = sizeClasses[size];

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md",
				sizeClass.container,
				colorClass,
				className,
			)}
		>
			{emoji ? (
				<span className={sizeClass.emoji}>{emoji}</span>
			) : (
				<HugeiconsIcon icon={Folder01Icon} className={sizeClass.icon} />
			)}
		</div>
	);
}
