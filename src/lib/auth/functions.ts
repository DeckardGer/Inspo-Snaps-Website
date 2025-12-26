import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import authClient from "@/lib/auth/auth-client";
import { authMiddleware } from "@/lib/auth/middleware";
import {
	createPresignedDownloadUrl,
	deleteStorageObject,
} from "@/lib/storage/s3";

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
});

export const getAvatarUploadUrl = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
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
		// Get the current user's image to delete old avatar if exists
		const oldImageKey = context.user.image;

		// Generate a presigned download URL for the new avatar
		const imageUrl = await createPresignedDownloadUrl(data.storageKey);

		// Update user with new image URL
		await auth.api.updateUser({
			headers: getRequest().headers,
			body: {
				image: imageUrl,
			},
		});

		// Delete old avatar from S3 if it was stored in our bucket
		if (oldImageKey?.includes("avatars/")) {
			try {
				// Extract the storage key from the old URL
				const urlParts = oldImageKey.split("avatars/");
				if (urlParts[1]) {
					const oldStorageKey = `avatars/${urlParts[1].split("?")[0]}`;
					await deleteStorageObject(oldStorageKey);
				}
			} catch {
				// Ignore errors when deleting old avatar
			}
		}

		return { success: true, imageUrl };
	});

export const removeAvatar = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const oldImageKey = context.user.image;

		// Update user to remove image - use null to explicitly clear the field
		await auth.api.updateUser({
			headers: getRequest().headers,
			body: {
				image: null as unknown as string | undefined,
			},
		});

		// Delete avatar from S3 if it was stored in our bucket
		if (oldImageKey?.includes("avatars/")) {
			try {
				const urlParts = oldImageKey.split("avatars/");
				if (urlParts[1]) {
					const oldStorageKey = `avatars/${urlParts[1].split("?")[0]}`;
					await deleteStorageObject(oldStorageKey);
				}
			} catch {
				// Ignore errors when deleting avatar
			}
		}

		return { success: true };
	});
