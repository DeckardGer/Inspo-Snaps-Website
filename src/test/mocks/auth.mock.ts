/**
 * Auth mock utilities for testing
 * Provides helper functions to configure auth-related mocks
 */
import type { Mock } from "vitest";
import { createTestUser, type TestUser } from "../fixtures/user.fixtures";

// Type for mocked auth API
export type MockAuthApi = {
	getSession: Mock;
	updateUser: Mock;
	changePassword: Mock;
	sendVerificationEmail: Mock;
};

// Type for mocked auth client
export type MockAuthClient = {
	isUsernameAvailable: Mock;
};

/**
 * Get the mocked auth instance
 */
export async function getMockAuth(): Promise<{ api: MockAuthApi }> {
	const { auth } = await import("@/lib/auth/auth");
	return auth as unknown as { api: MockAuthApi };
}

/**
 * Get the mocked auth client
 */
export async function getMockAuthClient(): Promise<MockAuthClient> {
	const authClient = await import("@/lib/auth/auth-client");
	return authClient.default as unknown as MockAuthClient;
}

/**
 * Configure auth middleware to return a specific user
 * This mocks the getSession call that authMiddleware makes
 */
export function mockAuthSession(
	auth: { api: MockAuthApi },
	user: TestUser | null,
): void {
	if (user) {
		auth.api.getSession.mockResolvedValue({ user });
	} else {
		auth.api.getSession.mockResolvedValue(null);
	}
}

/**
 * Configure username availability check
 */
export function mockUsernameAvailability(
	authClient: MockAuthClient,
	available: boolean,
	error?: { message: string },
): void {
	if (error) {
		authClient.isUsernameAvailable.mockResolvedValue({
			data: null,
			error,
		});
	} else {
		authClient.isUsernameAvailable.mockResolvedValue({
			data: { available },
			error: null,
		});
	}
}

/**
 * Configure updateUser mock
 */
export function mockUpdateUser(
	auth: { api: MockAuthApi },
	success = true,
	error?: Error,
): void {
	if (success) {
		auth.api.updateUser.mockResolvedValue({ success: true });
	} else {
		auth.api.updateUser.mockRejectedValue(error || new Error("Update failed"));
	}
}

/**
 * Configure changePassword mock
 */
export function mockChangePassword(
	auth: { api: MockAuthApi },
	success = true,
	error?: Error,
): void {
	if (success) {
		auth.api.changePassword.mockResolvedValue({ success: true });
	} else {
		auth.api.changePassword.mockRejectedValue(
			error || new Error("Change password failed"),
		);
	}
}

/**
 * Configure sendVerificationEmail mock
 */
export function mockSendVerificationEmail(
	auth: { api: MockAuthApi },
	success = true,
	error?: Error,
): void {
	if (success) {
		auth.api.sendVerificationEmail.mockResolvedValue({ success: true });
	} else {
		auth.api.sendVerificationEmail.mockRejectedValue(
			error || new Error("Send verification email failed"),
		);
	}
}

/**
 * Reset all auth mocks
 */
export function resetAuthMocks(auth: { api: MockAuthApi }): void {
	auth.api.getSession.mockReset();
	auth.api.updateUser.mockReset();
	auth.api.changePassword.mockReset();
	auth.api.sendVerificationEmail.mockReset();
}

/**
 * Reset auth client mocks
 */
export function resetAuthClientMocks(authClient: MockAuthClient): void {
	authClient.isUsernameAvailable.mockReset();
}

/**
 * Create a mock context object with a user for direct handler testing
 */
export function createMockContext(user?: TestUser): { user: TestUser } {
	return {
		user: user || createTestUser(),
	};
}
