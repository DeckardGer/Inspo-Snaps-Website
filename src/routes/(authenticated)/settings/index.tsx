import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar/NavBar";

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
			<div className="flex flex-1 flex-col gap-4 p-4">Hello</div>
		</>
	);
}
