import { createFileRoute } from "@tanstack/react-router";
import { FolderModal } from "@/components/folders/FolderModal";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(authenticated)/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Settings",
						link: "/settings",
					},
				]}
			/>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<FolderModal trigger={<Button variant="outline">Add Folder</Button>} />
			</div>
		</>
	);
}
