import { Skeleton } from "@/components/ui/skeleton";

export function FoldersGridSkeleton() {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
			{Array.from({ length: 15 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no unique key
					key={i}
					className="bg-card rounded-xl shadow-md"
				>
					<Skeleton className="flex justify-center items-center h-32 w-full rounded-xl">
						<Skeleton className="w-20 h-20 rounded-full bg-muted-foreground/10" />
					</Skeleton>
					<div className="flex justify-between items-center m-2">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-4 w-6" />
					</div>
				</div>
			))}
		</div>
	);
}
