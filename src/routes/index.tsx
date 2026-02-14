import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		meta: [{ title: "InspoSnaps" }],
	}),
});

function HomePage() {
	return (
		<div className="flex min-h-svh items-center justify-center bg-background text-foreground">
			<p className="text-muted-foreground">Coming soon.</p>
		</div>
	);
}
