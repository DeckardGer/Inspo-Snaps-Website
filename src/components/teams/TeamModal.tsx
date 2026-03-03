import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createTeam, updateTeam } from "@/lib/organizations/functions";
import { userOrganizationsQueryOptions } from "@/lib/organizations/queries";

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Team name is required")
		.max(100, "Team name must be at most 100 characters"),
});

interface TeamModalProps {
	trigger?: React.ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	team?: { id: string; name: string };
}

export function TeamModal({
	trigger,
	open,
	onOpenChange,
	team,
}: TeamModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isEditMode = !!team;

	// Use external control if provided, otherwise use internal state
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: team?.name ?? "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);

			try {
				if (isEditMode) {
					await updateTeam({
						data: {
							organizationId: team.id,
							name: value.name.trim(),
						},
					});

					await Promise.all([
						queryClient.invalidateQueries({
							queryKey: ["organizations"],
						}),
						queryClient.invalidateQueries({
							queryKey: ["organization", team.id],
						}),
					]);

					toast.success("Team updated successfully!");
					setDialogOpen(false);
				} else {
					// Generate slug from name
					const slug = value.name
						.toLowerCase()
						.replace(/\s+/g, "-")
						.replace(/[^a-z0-9-]/g, "")
						.replace(/-+/g, "-")
						.replace(/^-|-$/g, "");

					const result = await createTeam({
						data: {
							name: value.name.trim(),
							slug: `team-${slug}-${Date.now()}`,
						},
					});

					// Invalidate organizations query to refresh the list
					await queryClient.invalidateQueries({
						queryKey: userOrganizationsQueryOptions().queryKey,
					});

					toast.success("Team created successfully!");
					setDialogOpen(false);
					form.reset();

					navigate({
						to: "/team-folders/$orgId/{-$folderId}",
						params: { orgId: result.id },
					});
				}
			} catch (error) {
				const fallback = isEditMode
					? "Failed to update team"
					: "Failed to create team";
				const serverMessage = error instanceof Error ? error.message : null;
				toast.error(fallback, {
					description: serverMessage ?? undefined,
				});
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	// Reset form when team prop changes (e.g. opening edit modal for a different team)
	useEffect(() => {
		form.reset({ name: team?.name ?? "" });
	}, [team?.name, form]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Edit Team" : "Create New Team"}
					</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Change the name of your team."
							: "Create a team to collaborate with others on shared folders."}
					</DialogDescription>
				</DialogHeader>

				<form
					id="team-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} required>
											Team Name
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter team name"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				<DialogFooter>
					<Button type="submit" form="team-form" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<HugeiconsIcon
									icon={Loading03Icon}
									strokeWidth={2}
									className="animate-spin"
								/>
								{isEditMode ? "Saving..." : "Creating..."}
							</>
						) : isEditMode ? (
							"Save Changes"
						) : (
							"Create Team"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
