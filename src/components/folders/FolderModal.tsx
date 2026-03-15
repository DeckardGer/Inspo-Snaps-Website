import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	trackFirstFolderCreated,
	trackWriteAccessBlocked,
} from "@/lib/analytics/events";
import type { FolderColor } from "@/lib/folders/constants";
import { createFolder, updateFolder } from "@/lib/folders/functions";
import { BaseFolderModal, type FolderFormValues } from "./BaseFolderModal";

interface FolderModalProps {
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

export function FolderModal({
	folder,
	trigger,
	parentId,
	open,
	onOpenChange,
}: FolderModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const queryClient = useQueryClient();
	const isEditing = !!folder;

	// Use external control if provided, otherwise use internal state
	const dialogOpen = open ?? internalOpen;
	const setDialogOpen = onOpenChange ?? setInternalOpen;

	const createMutation = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			trackFirstFolderCreated();
			queryClient.invalidateQueries({
				queryKey: ["folders", parentId ?? "root"],
				exact: true,
			});
			toast.success("Folder created successfully");
			setDialogOpen(false);
		},
		onError: (error) => {
			if (error.message.includes("trial has expired")) {
				trackWriteAccessBlocked();
			}
			toast.error("Failed to create folder", {
				description: error.message,
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["folders", parentId ?? "root"],
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
				queryKey: ["folderPath"],
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
			formId="folder-form"
			createDescription="Add a new folder to organize your content."
			onSubmit={handleSubmit}
			isPending={createMutation.isPending || updateMutation.isPending}
		/>
	);
}
