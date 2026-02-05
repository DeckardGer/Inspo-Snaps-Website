/**
 * Database mock utilities for testing
 * Provides helper functions to configure mock database responses
 */

import type { Mock } from "vitest";
import { vi } from "vitest";

// Type for the mocked db object
export type MockDb = {
	query: {
		folder: {
			findFirst: Mock;
			findMany: Mock;
		};
		user: {
			findFirst: Mock;
			findMany: Mock;
		};
		account: {
			findFirst: Mock;
			findMany: Mock;
		};
		image: {
			findFirst: Mock;
			findMany: Mock;
		};
		folderImage: {
			findFirst: Mock;
			findMany: Mock;
		};
		userShare: {
			findFirst: Mock;
			findMany: Mock;
		};
		shareLink: {
			findFirst: Mock;
			findMany: Mock;
		};
		favouriteFolder: {
			findFirst: Mock;
			findMany: Mock;
		};
		member: {
			findFirst: Mock;
			findMany: Mock;
		};
		notification: {
			findFirst: Mock;
			findMany: Mock;
		};
	};
	insert: Mock;
	update: Mock;
	delete: Mock;
	select: Mock;
};

/**
 * Get the mocked database instance from the module
 */
export async function getMockDb(): Promise<MockDb> {
	const { db } = await import("@/lib/db");
	return db as unknown as MockDb;
}

/**
 * Configure a mock insert operation
 */
export function mockInsert(db: MockDb, returnValue: unknown[]): void {
	db.insert.mockReturnValue({
		values: vi.fn(() => ({
			returning: vi.fn(() => Promise.resolve(returnValue)),
			onConflictDoNothing: vi.fn(() => Promise.resolve()),
		})),
	});
}

/**
 * Configure a mock update operation
 */
export function mockUpdate(db: MockDb, returnValue: unknown[]): void {
	db.update.mockReturnValue({
		set: vi.fn(() => ({
			where: vi.fn(() => ({
				returning: vi.fn(() => Promise.resolve(returnValue)),
			})),
		})),
	});
}

/**
 * Configure a mock delete operation
 */
export function mockDelete(db: MockDb): void {
	db.delete.mockReturnValue({
		where: vi.fn(() => Promise.resolve()),
	});
}

/**
 * Configure a mock select operation
 */
export function mockSelect(db: MockDb, returnValue: unknown[]): void {
	db.select.mockReturnValue({
		from: vi.fn(() => ({
			where: vi.fn(() => ({
				groupBy: vi.fn(() => Promise.resolve(returnValue)),
			})),
		})),
	});
}

/**
 * Reset all database mocks
 */
export function resetDbMocks(db: MockDb): void {
	// Reset query mocks
	Object.values(db.query).forEach((table) => {
		if (table.findFirst) table.findFirst.mockReset();
		if (table.findMany) table.findMany.mockReset();
	});

	// Reset operation mocks
	db.insert.mockReset();
	db.update.mockReset();
	db.delete.mockReset();
	db.select.mockReset();

	// Re-initialize with default implementations
	mockInsert(db, []);
	mockUpdate(db, []);
	mockDelete(db);
	mockSelect(db, []);
}
