/**
 * User test fixtures
 * Provides factory functions for creating user test data
 */

export type TestUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
	username: string | null;
	displayUsername: string | null;
};

export type TestAccount = {
	id: string;
	accountId: string;
	providerId: string;
	userId: string;
	accessToken: string | null;
	refreshToken: string | null;
	idToken: string | null;
	accessTokenExpiresAt: Date | null;
	refreshTokenExpiresAt: Date | null;
	scope: string | null;
	password: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type TestMember = {
	id: string;
	organizationId: string;
	userId: string;
	role: string;
	createdAt: Date;
};

export type TestOrganization = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	createdAt: Date;
	metadata: string | null;
};

let userCounter = 0;

// Generate a valid UUID v4 format from a simple counter for predictable test data
// UUID v4 format: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
// The pattern accepts: [0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}
function generateTestUUID(prefix: string, counter: number): string {
	const hex = counter.toString(16).padStart(8, "0");
	// Format: 8 chars - 4 chars - 4xxx - 8xxx - 12 chars
	return `${hex}-${prefix}-4000-8000-000000000000`;
}

/**
 * Create a test user with default values
 */
export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
	userCounter++;
	const id = overrides.id || generateTestUUID("a000", userCounter);

	return {
		id,
		name: `Test User ${userCounter}`,
		email: `test${userCounter}@example.com`,
		emailVerified: true,
		image: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		username: `testuser${userCounter}`,
		displayUsername: `TestUser${userCounter}`,
		...overrides,
	};
}

/**
 * Create an unverified user
 */
export function createUnverifiedUser(
	overrides: Partial<TestUser> = {},
): TestUser {
	return createTestUser({
		emailVerified: false,
		...overrides,
	});
}

/**
 * Create a user with OAuth only (no password credential)
 */
export function createOAuthUser(overrides: Partial<TestUser> = {}): TestUser {
	return createTestUser({
		image: "https://example.com/avatar.jpg",
		...overrides,
	});
}

/**
 * Create a test account (credential provider)
 */
export function createTestAccount(
	userId: string,
	overrides: Partial<TestAccount> = {},
): TestAccount {
	return {
		id: overrides.id || `account-${userId}`,
		accountId: userId,
		providerId: "credential",
		userId,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: null,
		password: "hashed-password",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Create a test OAuth account
 */
export function createOAuthAccount(
	userId: string,
	provider = "google",
	overrides: Partial<TestAccount> = {},
): TestAccount {
	return createTestAccount(userId, {
		providerId: provider,
		accountId: `${provider}-${userId}`,
		accessToken: "access-token",
		refreshToken: "refresh-token",
		password: null,
		...overrides,
	});
}

let orgCounter = 0;

/**
 * Create a test organization
 */
export function createTestOrganization(
	overrides: Partial<TestOrganization> = {},
): TestOrganization {
	orgCounter++;
	const id = overrides.id || generateTestUUID("b000", orgCounter);

	return {
		id,
		name: `Test Organization ${orgCounter}`,
		slug: `test-org-${orgCounter}`,
		logo: null,
		createdAt: new Date("2024-01-01"),
		metadata: null,
		...overrides,
	};
}

/**
 * Create a test organization member
 */
export function createTestMember(
	organizationId: string,
	userId: string,
	role: "owner" | "admin" | "member" = "member",
	overrides: Partial<TestMember> = {},
): TestMember {
	return {
		id: overrides.id || `member-${organizationId}-${userId}`,
		organizationId,
		userId,
		role,
		createdAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Reset the user counter (useful between tests)
 */
export function resetUserCounter(): void {
	userCounter = 0;
	orgCounter = 0;
}
