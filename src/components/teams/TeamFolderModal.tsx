import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	BaseFolderModal,
	type FolderFormValues,
} from "@/components/folders/BaseFolderModal";
import type { FolderColor } from "@/lib/folders/constants";
import { createTeamFolder, updateTeamFolder } from "@/lib/folders/functions";

interface TeamFolderModalProps {
	organizationId: string;
	folder?: {
		id: string;
		name: string;
		emoji?: string | null;
		color: FolderColor;
		isFavourited?: boolean;
	};
	trigger?: React.ReactElement;
	parentId?: string | null;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function TeamFolderModal({
	organizationId,
	folder,
	trigger,
	parentId,
	open,
	onOpenChange,
}: TeamFolderModalProps) {
	const queryClient = useQueryClient();
	const [internalOpen, setInternalOpen] = useState(false);
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;
	const isEditing = !!folder;

	const createMutation = useMutation({
		mutationFn: createTeamFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["teamFolders", organizationId, parentId ?? "root"],
				exact: true,
			});
			toast.success("Folder created successfully");
			setDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to create folder", {
				description: error.message,
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateTeamFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["teamFolders", organizationId, parentId ?? "root"],
				exact: true,
			});
			if (folder?.isFavourited) {
				queryClient.invalidateQueries({
					queryKey: ["favouriteFolders"],
					exact: true,
				});
			}
			// Invalidate folder path queries to update breadcrumbs and toolbar title
			queryClient.invalidateQueries({
				queryKey: ["teamFolderPath"],
			});
			toast.success("Folder updated successfully");
			setDialogOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to update folder", {
				description: error.message,
			});
		},
	});

	const handleSubmit = (values: FolderFormValues) => {
		if (isEditing && folder) {
			updateMutation.mutate({
				data: {
					id: folder.id,
					organizationId,
					name: values.name,
					emoji: values.emoji,
					color: values.color,
				},
			});
		} else {
			createMutation.mutate({
				data: {
					name: values.name,
					emoji: values.emoji,
					color: values.color,
					parentId: parentId ?? null,
					organizationId,
				},
			});
		}
	};

	return (
		<BaseFolderModal
			folder={folder}
			trigger={trigger}
			open={dialogOpen}
			onOpenChange={setDialogOpen}
			formId="team-folder-form"
			createDescription="Add a new folder to this team."
			onSubmit={handleSubmit}
			isPending={createMutation.isPending || updateMutation.isPending}
		/>
	);
}
