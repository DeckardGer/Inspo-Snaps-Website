import { organizationClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/config/env/client";

const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: clientEnv.VITE_BASE_URL,
	plugins: [usernameClient(), organizationClient()],
});

export default authClient;
