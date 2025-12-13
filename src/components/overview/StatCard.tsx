import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoCardProps {
	title: string;
	value: string;
	icon: IconSvgElement;
	tooltip: string;
}

export function StatCard({ title, value, icon, tooltip }: InfoCardProps) {
	return (
		<Card className="flex-1 gap-1 overflow-hidden bg-gradient-to-tr from-background to-background/30 py-4">
			<CardHeader className="gap-0 px-4">
				<CardTitle className="text-sm font-medium text-secondary-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4">
				<div className="flex items-end justify-between gap-2">
					<div className="flex gap-2 truncate">
						<CardDescription className="truncate text-2xl font-semibold text-secondary-foreground">
							{value}
						</CardDescription>
					</div>
					<Tooltip>
						<TooltipTrigger>
							<div className="rounded-md border bg-card p-2">
								<HugeiconsIcon icon={icon} />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{tooltip}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</CardContent>
		</Card>
	);
}
