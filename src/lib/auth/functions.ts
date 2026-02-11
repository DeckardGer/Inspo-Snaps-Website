import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import authClient from "@/lib/auth/auth-client";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema/auth.schema";
import { MAX_AVATAR_SIZE_BYTES } from "@/lib/images/constants";
import {
	accountRateLimitMiddleware,
	uploadRateLimitMiddleware,
	usernameCheckRateLimitMiddleware,
} from "@/lib/rate-limit/middleware";
import { deleteStorageObject, getPublicObjectUrl } from "@/lib/storage/s3";

/** Extracts the S3 storage key from a public avatar URL (e.g. "avatars/userId/uuid.jpg") */
function extractStorageKey(url: string): string | null {
	const match = url.match(/(avatars\/.+)/);
	return match?.[1] ?? null;
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
	const session = await auth.api.getSession({
		headers: getRequest().headers,
		returnHeaders: true,
	});

	// Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
	const cookies = session.headers?.getSetCookie();
	if (cookies?.length) {
		setResponseHeader("Set-Cookie", cookies);
	}

	return session.response?.user || null;
});

const UsernameInputSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(30, "Username must be at most 30 characters.")
		.regex(
			/^[a-zA-Z0-9._]+$/,
			"Username can only contain alphanumeric characters, underscores, and dots.",
		),
});

const UsernameInput = z.object({
	username: z.string(),
});

export const checkUsernameAvailability = createServerFn({ method: "GET" })
	.middleware([usernameCheckRateLimitMiddleware])
	.inputValidator(UsernameInput)
	.handler(async ({ data }) => {
		// Validate username format first
		const validationResult = UsernameInputSchema.safeParse(data);

		if (!validationResult.success) {
			// Return first validation error
			const firstError = validationResult.error.issues[0];
			return {
				valid: false,
				message: firstError.message,
			};
		}

		const username = validationResult.data.username;

		// Check availability with Better Auth
		const { data: response, error } = await authClient.isUsernameAvailable({
			username: username,
		});

		if (error) {
			return {
				valid: false,
				message: error.message || "Failed to check username availability.",
			};
		}

		if (response?.available) {
			return {
				valid: true,
				message: "Username is available!",
			};
		}

		return {
			valid: false,
			message: "This username is already taken.",
		};
	});

// ─────────────────────────────────────────────────────────────────────────────
// Update User Profile
// ─────────────────────────────────────────────────────────────────────────────

const UpdateUsernameInput = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters.")
		.max(30, "Username must be at most 30 characters.")
		.regex(
			/^[a-zA-Z0-9._]+$/,
			"Username can only contain alphanumeric characters, underscores, and dots.",
		),
});

export const updateUsername = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateUsernameInput)
	.handler(async ({ data, context }) => {
		// Check if username is the same as current
		if (data.username.toLowerCase() === context.user.username?.toLowerCase()) {
			return { success: true, message: "Username unchanged." };
		}

		// Check availability first
		const { data: availabilityResponse } = await authClient.isUsernameAvailable(
			{
				username: data.username,
			},
		);

		if (!availabilityResponse?.available) {
			throw new Error("This username is already taken.");
		}

		// Update using Better Auth API
		await auth.api.updateUser({
			headers: getRequest().headers,
			body: {
				username: data.username,
			},
		});

		return { success: true, message: "Username updated successfully." };
	});

const GetAvatarUploadUrlInput = z.object({
	filename: z.string(),
	contentType: z
		.string()
		.refine((type) => type.startsWith("image/"), "File must be an image."),
	fileSize: z.number().int().positive().max(MAX_AVATAR_SIZE_BYTES),
});

export const getAvatarUploadUrl = createServerFn({ method: "POST" })
	.middleware([authMiddleware, uploadRateLimitMiddleware])
	.inputValidator(GetAvatarUploadUrlInput)
	.handler(async ({ data, context }) => {
		// Generate a storage key with avatars/ prefix
		const ext = data.filename.split(".").pop() || "";
		const uuid = crypto.randomUUID();
		const storageKey = `avatars/${context.user.id}/${uuid}${ext ? `.${ext}` : ""}`;

		// Create presigned upload URL for the avatar
		const { createPresignedUploadUrl } = await import("@/lib/storage/s3");
		const uploadUrl = await createPresignedUploadUrl(
			storageKey,
			data.contentType,
		);

		return { uploadUrl, storageKey };
	});

const UpdateAvatarInput = z.object({
	storageKey: z.string(),
});

export const updateAvatar = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(UpdateAvatarInput)
	.handler(async ({ data, context }) => {
		const oldImage = context.user.image;

		// Store a permanent public URL — no presigned URLs needed for avatars
		const imageUrl = getPublicObjectUrl(data.storageKey);

		await auth.api.updateUser({
			headers: getRequest().headers,
			body: {
				image: imageUrl,
			},
		});

		// Delete old avatar from S3 if it was stored in our bucket
		if (oldImage?.includes("/avatars/")) {
			try {
				const key = extractStorageKey(oldImage);
				if (key) await deleteStorageObject(key);
			} catch {
				// Ignore errors when deleting old avatar
			}
		}

		return { success: true, imageUrl };
	});

export const removeAvatar = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const oldImage = context.user.image;

		// Update user to remove image - use null to explicitly clear the field
		await auth.api.updateUser({
			headers: getRequest().headers,
			body: {
				image: null as unknown as string | undefined,
			},
		});

		// Delete avatar from S3 if it was stored in our bucket
		if (oldImage?.includes("/avatars/")) {
			try {
				const key = extractStorageKey(oldImage);
				if (key) await deleteStorageObject(key);
			} catch {
				// Ignore errors when deleting avatar
			}
		}

		return { success: true };
	});

// ─────────────────────────────────────────────────────────────────────────────
// Password Management
// ─────────────────────────────────────────────────────────────────────────────

export const hasPassword = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const accounts = await db
			.select({ providerId: account.providerId })
			.from(account)
			.where(eq(account.userId, context.user.id));

		return {
			hasPassword: accounts.some((a) => a.providerId === "credential"),
		};
	});

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
	.regex(/[0-9]/, "Password must contain at least one number.")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character.",
	);

const ChangePasswordInput = z
	.object({
		currentPassword: z.string().min(1, "Current password is required."),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your new password."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password.",
		path: ["newPassword"],
	});

export const changePassword = createServerFn({ method: "POST" })
	.middleware([authMiddleware, accountRateLimitMiddleware])
	.inputValidator(ChangePasswordInput)
	.handler(async ({ data, context }) => {
		// Require email verification before allowing password changes
		if (!context.user.emailVerified) {
			throw new Error(
				"Please verify your email address before changing your password.",
			);
		}

		await auth.api.changePassword({
			headers: getRequest().headers,
			body: {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: true,
			},
		});

		// TODO: Send password change confirmation email when Resend is wired up
		console.log(
			"[Password Changed] User changed their password. Send confirmation email.",
		);

		return { success: true, message: "Password changed successfully." };
	});

export const sendVerificationEmail = createServerFn({ method: "POST" })
	.middleware([authMiddleware, accountRateLimitMiddleware])
	.handler(async ({ context }) => {
		if (context.user.emailVerified) {
			return { success: true, message: "Email is already verified." };
		}

		await auth.api.sendVerificationEmail({
			headers: getRequest().headers,
			body: {
				email: context.user.email,
				callbackURL: "/overview",
			},
		});

		return { success: true, message: "Verification email sent." };
	});
