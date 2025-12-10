import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar/NavBar";

export const Route = createFileRoute("/(authenticated)/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<NavBar
				breadrumbs={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
				]}
			/>
			<div className="flex flex-1 flex-col gap-4 p-4">Hello</div>
		</>
	);
}
