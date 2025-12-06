import {
	Alert02Icon,
	AlertDiamondIcon,
	CheckmarkCircle02Icon,
	InformationCircleIcon,
	Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/lib/ThemeProvider";

const Toaster = ({ ...props }: ToasterProps) => {
	const { appTheme } = useTheme();

	return (
		<Sonner
			theme={appTheme}
			className="toaster group"
			icons={{
				success: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />,
				info: <HugeiconsIcon icon={InformationCircleIcon} size={16} />,
				warning: <HugeiconsIcon icon={Alert02Icon} size={16} />,
				error: <HugeiconsIcon icon={AlertDiamondIcon} size={16} />,
				loading: (
					<HugeiconsIcon
						icon={Loading03Icon}
						size={16}
						className="animate-spin"
					/>
				),
			}}
			style={
				{
					"--normal-bg": "var(--bg-secondary)",
					"--normal-text": "var(--text-primary)",
					"--normal-border": "var(--border-secondary)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
