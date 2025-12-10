import {
	Image02Icon,
	Share08Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/overview/StatCard";
import { overviewStatsQueryOptions } from "@/lib/stats/queries";

export function StatsCards() {
	const { data: stats } = useSuspenseQuery(overviewStatsQueryOptions());

	const cards = [
		{
			title: "Your Images",
			value: stats.totalImages.toLocaleString(),
			icon: Image02Icon,
			tooltip: "Total images you've personally saved",
		},
		{
			title: "Shared Images",
			value: stats.sharedImages.toLocaleString(),
			icon: Share08Icon,
			tooltip: "Total images from shared folders",
		},
		{
			title: "Team Images",
			value: stats.teamImages.toLocaleString(),
			icon: UserGroupIcon,
			tooltip: "Total images across your teams",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{cards.map((card) => (
				<StatCard
					key={card.title}
					title={card.title}
					value={card.value}
					icon={card.icon}
					tooltip={card.tooltip}
				/>
			))}
		</div>
	);
}
