import { Home07Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BreadcrumbItemPath {
	name: string;
	link: string;
}

interface HeaderBreadcrumbsProps {
	items: BreadcrumbItemPath[];
}

const MAX_VISIBLE_ITEMS = 3;

export function HeaderBreadcrumbs({ items }: HeaderBreadcrumbsProps) {
	const shouldCollapse = items.length > MAX_VISIBLE_ITEMS;

	// When collapsing: show first item, ellipsis dropdown, last 2 items
	const firstItem = shouldCollapse ? items[0] : null;
	const collapsedItems = shouldCollapse ? items.slice(1, -2) : [];
	const visibleItems = shouldCollapse ? items.slice(-2) : items;

	return (
		<Breadcrumb className="min-w-0">
			<BreadcrumbList className="flex-nowrap overflow-hidden">
				{/* Home icon - always first */}
				<BreadcrumbItem className="shrink-0">
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						nativeButton={false}
						render={
							<Link to="/overview">
								<HugeiconsIcon
									icon={Home07Icon}
									strokeWidth={2}
									className="h-4 w-4"
								/>
							</Link>
						}
					/>
				</BreadcrumbItem>

				{/* First item when collapsed */}
				{firstItem && (
					<Fragment>
						<BreadcrumbSeparator className="shrink-0" />
						<BreadcrumbItem className="min-w-0">
							<BreadcrumbLink
								className="max-w-32 truncate"
								render={<Link to={firstItem.link}>{firstItem.name}</Link>}
							/>
						</BreadcrumbItem>
					</Fragment>
				)}

				{/* Ellipsis dropdown for collapsed items */}
				{collapsedItems.length > 0 && (
					<Fragment>
						<BreadcrumbSeparator className="shrink-0" />
						<BreadcrumbItem className="shrink-0">
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer rounded-sm border border-transparent outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
									<BreadcrumbEllipsis />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-auto max-w-120">
									{collapsedItems.map((item) => (
										<DropdownMenuItem
											key={item.link}
											className="min-w-0 overflow-hidden"
											render={
												<Link
													to={item.link}
													className="min-w-0 overflow-hidden"
												>
													<span className="truncate">{item.name}</span>
												</Link>
											}
										/>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
					</Fragment>
				)}

				{/* Visible items (all items when not collapsed, or last 2 when collapsed) */}
				{visibleItems.map((item, index) => {
					const isLast = index === visibleItems.length - 1;

					return (
						<Fragment key={item.link}>
							<BreadcrumbSeparator className="shrink-0" />
							<BreadcrumbItem className="min-w-0">
								{isLast ? (
									<BreadcrumbPage className="max-w-48 truncate">
										{item.name}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="max-w-32 truncate"
										render={<Link to={item.link}>{item.name}</Link>}
									/>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
