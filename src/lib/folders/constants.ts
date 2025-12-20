export const FOLDER_COLORS = [
	"slate",
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"purple",
	"pink",
	"rose",
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

export const COLOR_CLASSES: Record<FolderColor, string> = {
	slate: "bg-slate-500 hover:bg-slate-600",
	red: "bg-red-500 hover:bg-red-600",
	orange: "bg-orange-500 hover:bg-orange-600",
	yellow: "bg-yellow-500 hover:bg-yellow-600",
	green: "bg-green-500 hover:bg-green-600",
	blue: "bg-blue-500 hover:bg-blue-600",
	indigo: "bg-indigo-500 hover:bg-indigo-600",
	purple: "bg-purple-500 hover:bg-purple-600",
	pink: "bg-pink-500 hover:bg-pink-600",
	rose: "bg-rose-500 hover:bg-rose-600",
};

export const FOLDER_ICON_CLASSES: Record<FolderColor, string> = {
	slate: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
	red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
	orange:
		"bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
	yellow:
		"bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
	green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
	blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
	indigo:
		"bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
	purple:
		"bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
	pink: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
	rose: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400",
};
