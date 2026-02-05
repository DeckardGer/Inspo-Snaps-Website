/**
 * Global test setup for Vitest
 * This file runs before all tests and sets up mocks for external dependencies
 */
import { vi } from "vitest";

// Mock TanStack Start server utilities
vi.mock("@tanstack/react-start/server", () => ({
	getRequest: vi.fn(() => ({
		headers: new Headers(),
	})),
	setResponseStatus: vi.fn(),
	setResponseHeader: vi.fn(),
}));

// Mock createServerFn to allow direct handler testing
// This creates a wrapper that captures the handler for direct invocation
vi.mock("@tanstack/react-start", () => {
	// Validator can be a Zod schema or a function
	type Validator =
		| { parse?: (data: unknown) => unknown }
		| ((data: unknown) => unknown);

	const createServerFn = ({ method }: { method: string }) => {
		let handler: (args: {
			data?: unknown;
			context?: unknown;
		}) => Promise<unknown>;
		let validator: Validator | undefined;

		const chainable = {
			middleware: () => {
				return chainable;
			},
			inputValidator: (v: Validator) => {
				validator = v;
				return chainable;
			},
			validator: (v: Validator) => {
				validator = v;
				return chainable;
			},
			handler: (
				h: (args: { data?: unknown; context?: unknown }) => Promise<unknown>,
			) => {
				handler = h;
				// Return a function that can be called with { data, context }
				const fn = async (args: { data?: unknown; context?: unknown } = {}) => {
					// For testing, validate input if validator exists
					let validatedData = args.data;
					if (validator && args.data !== undefined) {
						// Handle both Zod schemas (with .parse) and plain functions
						if (typeof validator === "function") {
							validatedData = validator(args.data);
						} else if (validator && typeof validator.parse === "function") {
							validatedData = validator.parse(args.data);
						}
					}
					return handler({ data: validatedData, context: args.context });
				};
				// Store handler for direct access in tests
				(fn as unknown as Record<string, unknown>).__handler = handler;
				(fn as unknown as Record<string, unknown>).__method = method;
				return fn;
			},
		};

		return chainable;
	};

	// Mock createMiddleware for the auth middleware
	const createMiddleware = () => ({
		server: (fn: unknown) => fn,
	});

	return {
		createServerFn,
		createMiddleware,
	};
});

// Mock the database module - will be configured per test
vi.mock("@/lib/db", () => ({
	db: {
		query: {
			folder: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			user: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			account: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			image: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			folderImage: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			userShare: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			shareLink: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			favouriteFolder: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			member: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
			notification: {
				findFirst: vi.fn(),
				findMany: vi.fn(),
			},
		},
		insert: vi.fn(() => ({
			values: vi.fn(() => ({
				returning: vi.fn(() => Promise.resolve([])),
				onConflictDoNothing: vi.fn(() => Promise.resolve()),
			})),
		})),
		update: vi.fn(() => ({
			set: vi.fn(() => ({
				where: vi.fn(() => ({
					returning: vi.fn(() => Promise.resolve([])),
				})),
			})),
		})),
		delete: vi.fn(() => ({
			where: vi.fn(() => Promise.resolve()),
		})),
		select: vi.fn(() => ({
			from: vi.fn(() => ({
				where: vi.fn(() => ({
					groupBy: vi.fn(() => Promise.resolve([])),
				})),
			})),
		})),
	},
}));

// Mock auth module
vi.mock("@/lib/auth/auth", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
			updateUser: vi.fn(),
			changePassword: vi.fn(),
			sendVerificationEmail: vi.fn(),
		},
	},
}));

// Mock auth client
vi.mock("@/lib/auth/auth-client", () => ({
	default: {
		isUsernameAvailable: vi.fn(),
	},
}));

// Mock S3 storage functions
vi.mock("@/lib/storage/s3", () => ({
	createPresignedUploadUrl: vi.fn(() =>
		Promise.resolve("https://s3.example.com/upload-url"),
	),
	createPresignedDownloadUrl: vi.fn(() =>
		Promise.resolve("https://s3.example.com/download-url"),
	),
	deleteStorageObject: vi.fn(() => Promise.resolve()),
	deleteStorageObjects: vi.fn(() => Promise.resolve()),
}));

// Mock storage functions module
vi.mock("@/lib/storage/functions", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@/lib/storage/functions")>();
	return {
		...original,
		createPresignedDownloadUrl: vi.fn(() =>
			Promise.resolve("https://s3.example.com/download-url"),
		),
		deleteStorageObject: vi.fn(() => Promise.resolve()),
		deleteStorageObjects: vi.fn(() => Promise.resolve()),
	};
});

// Mock notification functions
vi.mock("@/lib/notifications/create", () => ({
	createFolderInviteNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createFolderInviteAcceptedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createFolderInviteDeclinedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createFolderAccessRevokedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createTeamInviteNotification: vi.fn(() => Promise.resolve("notification-id")),
	createTeamInviteAcceptedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createTeamInviteDeclinedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createTeamMemberRemovedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
	createTeamRoleChangedNotification: vi.fn(() =>
		Promise.resolve("notification-id"),
	),
}));

// Mock rate limit middleware (pass through)
vi.mock("@/lib/rate-limit/middleware", () => ({
	usernameCheckRateLimitMiddleware: {
		_types: undefined,
	},
	accountRateLimitMiddleware: {
		_types: undefined,
	},
	uploadRateLimitMiddleware: {
		_types: undefined,
	},
	shareRateLimitMiddleware: {
		_types: undefined,
	},
}));

// Mock crypto.randomUUID for predictable test values
const mockUUID = vi.fn(() => "test-uuid-1234");
vi.stubGlobal("crypto", {
	...crypto,
	randomUUID: mockUUID,
});

export { mockUUID };
