import { Home07Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemPath {
	name: string;
	link: string;
}

interface HeaderBreadcrumbsProps {
	items: BreadcrumbItemPath[];
}

export function HeaderBreadcrumbs({ items }: HeaderBreadcrumbsProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Home icon - always first */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/dashboard">
							<HugeiconsIcon
								icon={Home07Icon}
								strokeWidth={2}
								className="h-4 w-4"
							/>
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{/* Render breadcrumb items */}
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<Fragment key={item.link}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{item.name}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={item.link}>{item.name}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
