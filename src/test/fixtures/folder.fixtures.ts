/**
 * Folder test fixtures
 * Provides factory functions for creating folder and related test data
 */

import type { FolderColor } from "@/lib/folders/constants";

export type TestFolder = {
	id: string;
	name: string;
	color: FolderColor;
	emoji: string | null;
	userId: string;
	organizationId: string | null;
	parentId: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type TestFolderWithRelations = TestFolder & {
	images?: { imageId: string }[];
	shareLinks?: { id: string }[];
	userShares?: { folderId: string }[];
	favourites?: { userId: string }[];
	children?: TestFolder[];
	parent?: TestFolder | null;
	owner?: {
		id: string;
		name: string;
		image: string | null;
	};
};

export type TestImage = {
	id: string;
	filename: string;
	storageKey: string;
	mimeType: string;
	sizeBytes: number;
	width: number | null;
	height: number | null;
	originUrl: string | null;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TestFolderImage = {
	folderId: string;
	imageId: string;
	addedAt: Date;
	image?: TestImage;
};

export type TestShareLink = {
	id: string;
	folderId: string;
	createdBy: string;
	expiresAt: Date | null;
	createdAt: Date;
	folder?: TestFolder;
};

export type TestUserShare = {
	folderId: string;
	sharedWithUserId: string;
	sharedByUserId: string;
	status: "pending" | "accepted" | "cancelled";
	createdAt: Date;
	folder?: TestFolder;
	sharedWith?: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	sharedBy?: {
		id: string;
		name: string | null;
		image: string | null;
	};
};

export type TestFavouriteFolder = {
	userId: string;
	folderId: string;
	createdAt: Date;
	folder?: TestFolder;
};

let folderCounter = 0;
let imageCounter = 0;
let shareLinkCounter = 0;

// Generate a valid UUID v4 format from a simple counter for predictable test data
// UUID v4 format: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
// The pattern accepts: [0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}
function generateTestUUID(prefix: string, counter: number): string {
	const hex = counter.toString(16).padStart(8, "0");
	// Format: 8 chars - 4 chars - 4xxx - 8xxx - 12 chars
	return `${hex}-${prefix}-4000-8000-000000000000`;
}

/**
 * Create a test folder with default values
 */
export function createTestFolder(
	userId: string,
	overrides: Partial<TestFolder> = {},
): TestFolder {
	folderCounter++;
	const id = overrides.id || generateTestUUID("f0f0", folderCounter);

	return {
		id,
		name: `Test Folder ${folderCounter}`,
		color: "indigo" as FolderColor,
		emoji: null,
		userId,
		organizationId: null,
		parentId: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create a test folder with relations for query mocks
 */
export function createTestFolderWithRelations(
	userId: string,
	overrides: Partial<TestFolderWithRelations> = {},
): TestFolderWithRelations {
	const folder = createTestFolder(userId, overrides);

	return {
		...folder,
		images: [],
		shareLinks: [],
		userShares: [],
		favourites: [],
		children: [],
		parent: null,
		...overrides,
	};
}

/**
 * Create a nested folder
 */
export function createNestedFolder(
	userId: string,
	parentId: string,
	overrides: Partial<TestFolder> = {},
): TestFolder {
	return createTestFolder(userId, {
		parentId,
		...overrides,
	});
}

/**
 * Create a team folder
 */
export function createTeamFolder(
	userId: string,
	organizationId: string,
	overrides: Partial<TestFolder> = {},
): TestFolder {
	return createTestFolder(userId, {
		organizationId,
		...overrides,
	});
}

/**
 * Create a test image
 */
export function createTestImage(
	userId: string,
	overrides: Partial<TestImage> = {},
): TestImage {
	imageCounter++;
	const id = overrides.id || generateTestUUID("1000", imageCounter);

	return {
		id,
		filename: `test-image-${imageCounter}.jpg`,
		storageKey: `${userId}/${id}.jpg`,
		mimeType: "image/jpeg",
		sizeBytes: 1024 * 100, // 100KB
		width: 800,
		height: 600,
		originUrl: null,
		userId,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create a test folder-image relationship
 */
export function createTestFolderImage(
	folderId: string,
	imageId: string,
	image?: TestImage,
	overrides: Partial<TestFolderImage> = {},
): TestFolderImage {
	return {
		folderId,
		imageId,
		addedAt: new Date("2024-01-01"),
		image,
		...overrides,
	};
}

/**
 * Create a test share link
 */
export function createTestShareLink(
	folderId: string,
	createdBy: string,
	overrides: Partial<TestShareLink> = {},
): TestShareLink {
	shareLinkCounter++;
	const id = overrides.id || generateTestUUID("5000", shareLinkCounter);

	return {
		id,
		folderId,
		createdBy,
		expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		createdAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create an expired share link
 */
export function createExpiredShareLink(
	folderId: string,
	createdBy: string,
	overrides: Partial<TestShareLink> = {},
): TestShareLink {
	return createTestShareLink(folderId, createdBy, {
		expiresAt: new Date("2020-01-01"), // Past date
		...overrides,
	});
}

/**
 * Create a never-expiring share link
 */
export function createPermanentShareLink(
	folderId: string,
	createdBy: string,
	overrides: Partial<TestShareLink> = {},
): TestShareLink {
	return createTestShareLink(folderId, createdBy, {
		expiresAt: null,
		...overrides,
	});
}

/**
 * Create a test user share
 */
export function createTestUserShare(
	folderId: string,
	sharedWithUserId: string,
	sharedByUserId: string,
	status: "pending" | "accepted" | "cancelled" = "pending",
	overrides: Partial<TestUserShare> = {},
): TestUserShare {
	return {
		folderId,
		sharedWithUserId,
		sharedByUserId,
		status,
		createdAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create a test favourite folder
 */
export function createTestFavouriteFolder(
	userId: string,
	folderId: string,
	overrides: Partial<TestFavouriteFolder> = {},
): TestFavouriteFolder {
	return {
		userId,
		folderId,
		createdAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create a folder hierarchy for testing
 * Returns an array of folders: [root, child1, child2, grandchild1]
 */
export function createFolderHierarchy(userId: string): TestFolder[] {
	const root = createTestFolder(userId, {
		id: "aaaa0001-0000-4000-8000-000000000000",
		name: "Root",
	});
	const child1 = createNestedFolder(userId, root.id, {
		id: "aaaa0002-0000-4000-8000-000000000000",
		name: "Child 1",
	});
	const child2 = createNestedFolder(userId, root.id, {
		id: "aaaa0003-0000-4000-8000-000000000000",
		name: "Child 2",
	});
	const grandchild1 = createNestedFolder(userId, child1.id, {
		id: "aaaa0004-0000-4000-8000-000000000000",
		name: "Grandchild 1",
	});

	return [root, child1, child2, grandchild1];
}

/**
 * Reset counters (useful between tests)
 */
export function resetFolderCounters(): void {
	folderCounter = 0;
	imageCounter = 0;
	shareLinkCounter = 0;
}
