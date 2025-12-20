/** biome-ignore-all lint/suspicious/noArrayIndexKey: No unique key */
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FoldersGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{Array.from({ length: 10 }).map((_, i) => (
				<Card key={`grid-skeleton-${i}`} className="relative">
					<CardContent className="flex flex-col items-center gap-2 p-6">
						<Skeleton className="size-10 rounded-md" />
						<Skeleton className="h-4 w-24" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
