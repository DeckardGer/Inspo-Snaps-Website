import type { Folder } from "./functions";

export function filterFolders(
	folders: Folder[],
	filter: "all" | "private" | "shared",
	search?: string,
): Folder[] {
	return folders.filter((folder) => {
		if (search && !folder.name.toLowerCase().includes(search.toLowerCase())) {
			return false;
		}

		if (filter === "private" && folder.isShared) return false;
		if (filter === "shared" && !folder.isShared) return false;

		return true;
	});
}

export function sortFolders(
	folders: Folder[],
	sort: "name" | "created" | "updated" | "images",
	sortDir: "asc" | "desc",
): Folder[] {
	const sorted = [...folders];

	sorted.sort((a, b) => {
		let comparison = 0;

		switch (sort) {
			case "name":
				comparison = a.name.localeCompare(b.name);
				break;
			case "created":
				comparison = a.createdAt.getTime() - b.createdAt.getTime();
				break;
			case "updated":
				comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
				break;
			case "images":
				comparison = a.imageCount - b.imageCount;
				break;
		}

		return sortDir === "desc" ? -comparison : comparison;
	});

	return sorted;
}
