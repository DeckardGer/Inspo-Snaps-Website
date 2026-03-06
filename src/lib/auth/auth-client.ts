import { polarClient } from "@polar-sh/better-auth/client";
import {
	customSessionClient,
	organizationClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/config/env/client";
import type { auth } from "./auth";
import { ac, roles } from "./permissions";

const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: clientEnv.VITE_BASE_URL,
	plugins: [
		usernameClient(),
		organizationClient({
			ac,
			roles,
		}),
		polarClient(),
		customSessionClient<typeof auth>(),
	],
});

export default authClient;
