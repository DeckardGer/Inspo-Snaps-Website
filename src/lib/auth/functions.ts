import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import authClient from "@/lib/auth/auth-client";

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

export const checkUsernameAvailability = createServerFn({ method: "GET" })
	.inputValidator((data: { username: string }) => data)
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
