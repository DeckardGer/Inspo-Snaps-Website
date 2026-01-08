export const FOLDER_NAME_MIN_LENGTH = 1;
export const FOLDER_NAME_MAX_LENGTH = 255;

export const FOLDER_COLORS = [
	"slate",
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"purple",
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
	rose: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400",
};

type FolderColorClasses = {
	background: string;
	foreground: string;
	icon: string;
	glow: string;
};

export const FOLDER_CLASSES: Record<FolderColor, FolderColorClasses> = {
	slate: {
		background:
			"bg-gradient-to-br from-slate-100 to-slate-300/80 dark:from-slate-500 dark:to-slate-700/80 dark:saturate-80",
		foreground: "bg-slate-300/70 dark:bg-slate-800/80",
		icon: "text-slate-500 dark:text-slate-500 opacity-80",
		glow: "hover:shadow-slate-300/50 dark:hover:shadow-slate-400/30 data-[menu-open]:shadow-slate-300/50 dark:data-[menu-open]:shadow-slate-400/30",
	},
	red: {
		background:
			"bg-gradient-to-br from-red-100 to-red-300/80 dark:from-red-500 dark:to-red-700/80 dark:saturate-80",
		foreground: "bg-red-300/70 dark:bg-red-800/80",
		icon: "text-red-500 dark:text-red-500 opacity-80",
		glow: "hover:shadow-red-300/50 dark:hover:shadow-red-400/30 data-[menu-open]:shadow-red-300/50 dark:data-[menu-open]:shadow-red-400/30",
	},
	orange: {
		background:
			"bg-gradient-to-br from-orange-100 to-orange-300/80 dark:from-orange-500 dark:to-orange-700/80 dark:saturate-80",
		foreground: "bg-orange-300/70 dark:bg-orange-800/80",
		icon: "text-orange-500 dark:text-orange-500 opacity-80",
		glow: "hover:shadow-orange-300/50 dark:hover:shadow-orange-400/30 data-[menu-open]:shadow-orange-300/50 dark:data-[menu-open]:shadow-orange-400/30",
	},
	yellow: {
		background:
			"bg-gradient-to-br from-yellow-100 to-yellow-300/80 dark:from-yellow-500 dark:to-yellow-700/80 dark:saturate-80",
		foreground: "bg-yellow-300/70 dark:bg-yellow-800/80",
		icon: "text-yellow-500 dark:text-yellow-500 opacity-80",
		glow: "hover:shadow-yellow-300/50 dark:hover:shadow-yellow-400/30 data-[menu-open]:shadow-yellow-300/50 dark:data-[menu-open]:shadow-yellow-400/30",
	},
	green: {
		background:
			"bg-gradient-to-br from-green-100 to-green-300/80 dark:from-green-500 dark:to-green-700/80 dark:saturate-80",
		foreground: "bg-green-300/70 dark:bg-green-800/80",
		icon: "text-green-500 dark:text-green-500 opacity-80",
		glow: "hover:shadow-green-300/50 dark:hover:shadow-green-400/30 data-[menu-open]:shadow-green-300/50 dark:data-[menu-open]:shadow-green-400/30",
	},
	blue: {
		background:
			"bg-gradient-to-br from-blue-100 to-blue-300/80 dark:from-blue-500 dark:to-blue-700/80 dark:saturate-80",
		foreground: "bg-blue-300/70 dark:bg-blue-800/80",
		icon: "text-blue-500 dark:text-blue-500 opacity-80",
		glow: "hover:shadow-blue-300/50 dark:hover:shadow-blue-400/30 data-[menu-open]:shadow-blue-300/50 dark:data-[menu-open]:shadow-blue-400/30",
	},
	indigo: {
		background:
			"bg-gradient-to-br from-indigo-100 to-indigo-300/80 dark:from-indigo-500 dark:to-indigo-700/80 dark:saturate-80",
		foreground: "bg-indigo-300/70 dark:bg-indigo-800/80",
		icon: "text-indigo-500 dark:text-indigo-500 opacity-80",
		glow: "hover:shadow-indigo-300/50 dark:hover:shadow-indigo-400/30 data-[menu-open]:shadow-indigo-300/50 dark:data-[menu-open]:shadow-indigo-400/30",
	},
	purple: {
		background:
			"bg-gradient-to-br from-purple-100 to-purple-300/80 dark:from-purple-500 dark:to-purple-700/80 dark:saturate-80",
		foreground: "bg-purple-300/70 dark:bg-purple-800/80",
		icon: "text-purple-500 dark:text-purple-500 opacity-80",
		glow: "hover:shadow-purple-300/50 dark:hover:shadow-purple-400/30 data-[menu-open]:shadow-purple-300/50 dark:data-[menu-open]:shadow-purple-400/30",
	},
	rose: {
		background:
			"bg-gradient-to-br from-rose-100 to-rose-300/80 dark:from-rose-500 dark:to-rose-700/80 dark:saturate-80",
		foreground: "bg-rose-300/70 dark:bg-rose-800/80",
		icon: "text-rose-500 dark:text-rose-500 opacity-80",
		glow: "hover:shadow-rose-300/50 dark:hover:shadow-rose-400/30 data-[menu-open]:shadow-rose-300/50 dark:data-[menu-open]:shadow-rose-400/30",
	},
};
