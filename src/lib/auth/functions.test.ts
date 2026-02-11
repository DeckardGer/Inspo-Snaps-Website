/**
 * Tests for auth server functions
 *
 * These tests mock the createServerFn to directly test handlers
 * with mock data and context objects.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createTestUser,
	createUnverifiedUser,
	resetUserCounter,
} from "@/test/fixtures/user.fixtures";
import {
	getMockAuth,
	getMockAuthClient,
	mockChangePassword,
	mockSendVerificationEmail,
	mockUpdateUser,
	mockUsernameAvailability,
} from "@/test/mocks/auth.mock";
import { getMockDb } from "@/test/mocks/db.mock";

describe("Auth Functions", () => {
	beforeEach(() => {
		resetUserCounter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("checkUsernameAvailability", () => {
		it("returns valid: false for username shorter than 3 characters", async () => {
			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "ab" },
			});

			expect(result).toEqual({
				valid: false,
				message: "Username must be at least 3 characters.",
			});
		});

		it("returns valid: false for username longer than 30 characters", async () => {
			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const longUsername = "a".repeat(31);
			const result = await checkUsernameAvailability({
				data: { username: longUsername },
			});

			expect(result).toEqual({
				valid: false,
				message: "Username must be at most 30 characters.",
			});
		});

		it("returns valid: false for username with invalid characters", async () => {
			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "user@name!" },
			});

			expect(result).toEqual({
				valid: false,
				message:
					"Username can only contain alphanumeric characters, underscores, and dots.",
			});
		});

		it("returns valid: true for available username", async () => {
			const authClient = await getMockAuthClient();
			mockUsernameAvailability(authClient, true);

			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "validuser123" },
			});

			expect(result).toEqual({
				valid: true,
				message: "Username is available!",
			});
			expect(authClient.isUsernameAvailable).toHaveBeenCalledWith({
				username: "validuser123",
			});
		});

		it("returns valid: false for taken username", async () => {
			const authClient = await getMockAuthClient();
			mockUsernameAvailability(authClient, false);

			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "takenuser" },
			});

			expect(result).toEqual({
				valid: false,
				message: "This username is already taken.",
			});
		});

		it("handles API errors gracefully", async () => {
			const authClient = await getMockAuthClient();
			mockUsernameAvailability(authClient, false, {
				message: "Service unavailable",
			});

			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "validuser" },
			});

			expect(result).toEqual({
				valid: false,
				message: "Service unavailable",
			});
		});

		it("accepts usernames with underscores and dots", async () => {
			const authClient = await getMockAuthClient();
			mockUsernameAvailability(authClient, true);

			const { checkUsernameAvailability } = await import(
				"@/lib/auth/functions"
			);

			const result = await checkUsernameAvailability({
				data: { username: "user_name.123" },
			});

			expect(result).toEqual({
				valid: true,
				message: "Username is available!",
			});
		});
	});

	describe("hasPassword", () => {
		it("returns true when user has credential provider", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			// Mock the select query for accounts
			const mockSelectResult = [{ providerId: "credential" }];
			db.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(mockSelectResult),
				}),
			});

			const { hasPassword } = await import("@/lib/auth/functions");

			const result = await hasPassword({ context: { user } });

			expect(result).toEqual({ hasPassword: true });
		});

		it("returns false when user only has OAuth provider", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			// Mock the select query for accounts - only OAuth
			const mockSelectResult = [{ providerId: "google" }];
			db.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(mockSelectResult),
				}),
			});

			const { hasPassword } = await import("@/lib/auth/functions");

			const result = await hasPassword({ context: { user } });

			expect(result).toEqual({ hasPassword: false });
		});

		it("returns true when user has both credential and OAuth", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			// Mock the select query for accounts - both providers
			const mockSelectResult = [
				{ providerId: "credential" },
				{ providerId: "google" },
			];
			db.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue(mockSelectResult),
				}),
			});

			const { hasPassword } = await import("@/lib/auth/functions");

			const result = await hasPassword({ context: { user } });

			expect(result).toEqual({ hasPassword: true });
		});

		it("returns false when user has no accounts", async () => {
			const db = await getMockDb();
			const user = createTestUser();

			// Mock the select query for accounts - no accounts
			db.select.mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([]),
				}),
			});

			const { hasPassword } = await import("@/lib/auth/functions");

			const result = await hasPassword({ context: { user } });

			expect(result).toEqual({ hasPassword: false });
		});
	});

	describe("updateUsername", () => {
		it("returns success unchanged when username is the same", async () => {
			const user = createTestUser({ username: "existinguser" });

			const { updateUsername } = await import("@/lib/auth/functions");

			const result = await updateUsername({
				data: { username: "existinguser" },
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Username unchanged.",
			});
		});

		it("returns success unchanged for case-insensitive same username", async () => {
			const user = createTestUser({ username: "existinguser" });

			const { updateUsername } = await import("@/lib/auth/functions");

			const result = await updateUsername({
				data: { username: "ExistingUser" },
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Username unchanged.",
			});
		});

		it("throws error when new username is already taken", async () => {
			const authClient = await getMockAuthClient();
			mockUsernameAvailability(authClient, false);

			const user = createTestUser({ username: "olduser" });

			const { updateUsername } = await import("@/lib/auth/functions");

			await expect(
				updateUsername({
					data: { username: "takenuser" },
					context: { user },
				}),
			).rejects.toThrow("This username is already taken.");
		});

		it("updates username when available", async () => {
			const authClient = await getMockAuthClient();
			const auth = await getMockAuth();
			mockUsernameAvailability(authClient, true);
			mockUpdateUser(auth, true);

			const user = createTestUser({ username: "olduser" });

			const { updateUsername } = await import("@/lib/auth/functions");

			const result = await updateUsername({
				data: { username: "newuser" },
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Username updated successfully.",
			});
			expect(auth.api.updateUser).toHaveBeenCalledWith(
				expect.objectContaining({
					body: { username: "newuser" },
				}),
			);
		});
	});

	describe("changePassword", () => {
		it("throws error when user email is not verified", async () => {
			const user = createUnverifiedUser();

			const { changePassword } = await import("@/lib/auth/functions");

			await expect(
				changePassword({
					data: {
						currentPassword: "OldPass123!",
						newPassword: "NewPass123!",
						confirmPassword: "NewPass123!",
					},
					context: { user },
				}),
			).rejects.toThrow(
				"Please verify your email address before changing your password.",
			);
		});

		it("successfully changes password for verified user", async () => {
			const auth = await getMockAuth();
			mockChangePassword(auth, true);

			const user = createTestUser({ emailVerified: true });

			const { changePassword } = await import("@/lib/auth/functions");

			const result = await changePassword({
				data: {
					currentPassword: "OldPass123!",
					newPassword: "NewPass456!",
					confirmPassword: "NewPass456!",
				},
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Password changed successfully.",
			});
			expect(auth.api.changePassword).toHaveBeenCalledWith(
				expect.objectContaining({
					body: {
						currentPassword: "OldPass123!",
						newPassword: "NewPass456!",
						revokeOtherSessions: true,
					},
				}),
			);
		});

		it("propagates error from auth API", async () => {
			const auth = await getMockAuth();
			mockChangePassword(auth, false, new Error("Invalid current password"));

			const user = createTestUser({ emailVerified: true });

			const { changePassword } = await import("@/lib/auth/functions");

			await expect(
				changePassword({
					data: {
						currentPassword: "WrongPass123!",
						newPassword: "NewPass456!",
						confirmPassword: "NewPass456!",
					},
					context: { user },
				}),
			).rejects.toThrow("Invalid current password");
		});
	});

	describe("sendVerificationEmail", () => {
		it("returns success message when email is already verified", async () => {
			const user = createTestUser({ emailVerified: true });

			const { sendVerificationEmail } = await import("@/lib/auth/functions");

			const result = await sendVerificationEmail({
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Email is already verified.",
			});
		});

		it("sends verification email for unverified user", async () => {
			const auth = await getMockAuth();
			mockSendVerificationEmail(auth, true);

			const user = createUnverifiedUser({ email: "unverified@example.com" });

			const { sendVerificationEmail } = await import("@/lib/auth/functions");

			const result = await sendVerificationEmail({
				context: { user },
			});

			expect(result).toEqual({
				success: true,
				message: "Verification email sent.",
			});
			expect(auth.api.sendVerificationEmail).toHaveBeenCalledWith(
				expect.objectContaining({
					body: {
						email: "unverified@example.com",
						callbackURL: "/my-folders",
					},
				}),
			);
		});

		it("propagates error from auth API", async () => {
			const auth = await getMockAuth();
			mockSendVerificationEmail(auth, false, new Error("Email service error"));

			const user = createUnverifiedUser();

			const { sendVerificationEmail } = await import("@/lib/auth/functions");

			await expect(
				sendVerificationEmail({
					context: { user },
				}),
			).rejects.toThrow("Email service error");
		});
	});
});
