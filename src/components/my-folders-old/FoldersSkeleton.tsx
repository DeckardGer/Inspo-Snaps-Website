/** biome-ignore-all lint/suspicious/noArrayIndexKey: No unique key */
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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

export function FoldersTableSkeleton() {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Folder</TableHead>
						<TableHead>Date Created</TableHead>
						<TableHead>Last Updated</TableHead>
						<TableHead>Images</TableHead>
						<TableHead>Visibility</TableHead>
						<TableHead className="w-[50px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 8 }).map((_, i) => (
						<TableRow key={`table-skeleton-${i}`}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Skeleton className="size-10 rounded-md" />
									<Skeleton className="h-4 w-32" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-12 rounded-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-16 rounded-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="size-8" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
