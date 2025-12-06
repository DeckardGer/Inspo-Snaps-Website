import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/component-testing")({
	component: RouteComponent,
});

function RouteComponent() {
	const handleClick = () => {
		toast.success(`This is a success`);
	};

	return (
		<div className="flex flex-col gap-4 max-w-md mx-auto p-8">
			<Button onClick={handleClick}>Primary</Button>
			<Button disabled>Primary</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
			<Input />
			<Input disabled value="Hello" />
			<Input aria-invalid />
		</div>
	);
}
