import {
	ArrowDown01Icon,
	ArrowUp01Icon,
	GridViewIcon,
	Search01Icon,
	TableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type FoldersToolbarProps = {
	search?: string;
	sort: "name" | "created" | "updated" | "images";
	sortDir: "asc" | "desc";
	filter: "all" | "private" | "shared";
	view: "grid" | "table";
	onSearchChange: (search: string) => void;
	onSortChange: (sort: "name" | "created" | "updated" | "images") => void;
	onSortDirChange: (sortDir: "asc" | "desc") => void;
	onFilterChange: (filter: "all" | "private" | "shared") => void;
	onViewChange: (view: "grid" | "table") => void;
};

const sortLabels = {
	name: "Name",
	created: "Date Created",
	updated: "Last Updated",
	images: "Total Images",
};

const filterLabels = {
	all: "All Folders",
	private: "Private",
	shared: "Shared",
};

export function FoldersToolbar({
	search,
	sort,
	sortDir,
	filter,
	view,
	onSearchChange,
	onSortChange,
	onSortDirChange,
	onFilterChange,
	onViewChange,
}: FoldersToolbarProps) {
	const [searchValue, setSearchValue] = useState(search || "");

	useEffect(() => {
		const timeout = setTimeout(() => {
			onSearchChange(searchValue);
		}, 300);

		return () => clearTimeout(timeout);
	}, [searchValue, onSearchChange]);

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="relative flex-1 sm:max-w-sm">
				<HugeiconsIcon
					icon={Search01Icon}
					className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-quaternary"
				/>
				<Input
					placeholder="Search folders..."
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className="pl-9"
				/>
			</div>

			<div className="flex items-center gap-2">
				{/* Sort dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{sortLabels[sort]}
							{sortDir === "asc" ? (
								<HugeiconsIcon icon={ArrowUp01Icon} className="ml-2 size-4" />
							) : (
								<HugeiconsIcon icon={ArrowDown01Icon} className="ml-2 size-4" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onSortChange("name")}>
							Name
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onSortChange("created")}>
							Date Created
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onSortChange("updated")}>
							Last Updated
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onSortChange("images")}>
							Total Images
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Sort direction toggle */}
				<Button
					variant="outline"
					size="icon"
					onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
				>
					{sortDir === "asc" ? (
						<HugeiconsIcon icon={ArrowUp01Icon} />
					) : (
						<HugeiconsIcon icon={ArrowDown01Icon} />
					)}
				</Button>

				{/* Filter dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">{filterLabels[filter]}</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onFilterChange("all")}>
							All Folders
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onFilterChange("private")}>
							Private
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onFilterChange("shared")}>
							Shared
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* View toggle */}
				<div className="flex rounded-md border">
					<Button
						variant={view === "grid" ? "secondary" : "ghost"}
						size="icon"
						onClick={() => onViewChange("grid")}
						className="rounded-r-none"
					>
						<HugeiconsIcon icon={GridViewIcon} />
					</Button>
					<Button
						variant={view === "table" ? "secondary" : "ghost"}
						size="icon"
						onClick={() => onViewChange("table")}
						className="rounded-l-none"
					>
						<HugeiconsIcon icon={TableIcon} />
					</Button>
				</div>
			</div>
		</div>
	);
}
