/**
 * App-level auth types including plugin fields.
 *
 * Better Auth plugins (username, customSession, organization) add fields at
 * runtime, but TypeScript can't infer them through the middleware/API chain.
 * Define them explicitly here so they can be used across the app.
 */

export interface AppUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	username?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface AppSession {
	id: string;
	expiresAt: Date;
	updatedAt: Date;
	activeOrganizationId?: string | null;
	canWrite: boolean;
}
