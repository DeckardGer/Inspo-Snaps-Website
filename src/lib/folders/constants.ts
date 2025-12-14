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
