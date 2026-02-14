import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
	head: () => ({
		meta: [{ title: "Privacy Policy — InspoSnaps" }],
	}),
});

function PrivacyPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
			<h1 className="font-bold text-3xl">Privacy Policy</h1>
			<p className="mt-4 text-muted-foreground">Coming soon.</p>
		</div>
	);
}
