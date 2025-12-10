import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{[...Array(3)].map((_, i) => (
				<Card
					// biome-ignore lint/suspicious/noArrayIndexKey: No unique ID
					key={i}
					className="flex-1 gap-1 overflow-hidden bg-gradient-to-tr from-bg-primary to-bg-tertiary/30 py-4"
				>
					<CardHeader className="gap-0 px-4">
						<Skeleton className="h-5 w-24" />
					</CardHeader>
					<CardContent className="px-4">
						<div className="flex items-end justify-between gap-2">
							<div className="flex gap-2 truncate">
								<Skeleton className="h-8 w-24" />
							</div>

							<Skeleton className="h-[42px] w-[42px]" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
