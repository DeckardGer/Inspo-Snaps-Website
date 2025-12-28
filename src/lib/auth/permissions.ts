import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

/**
 * Custom permission statements for the organization
 * Extends the default statements with folder/image permissions
 */
const statement = {
	...defaultStatements,
	folder: ["create", "update", "delete"],
	image: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

/**
 * All available roles (for validation)
 */
export const ALL_ROLES = ["owner", "admin", "member", "viewer"] as const;

/**
 * Roles that can be assigned to new members (excludes owner)
 */
export const ASSIGNABLE_ROLES = ["admin", "member", "viewer"] as const;

/**
 * Role type derived from the roles array
 */
export type Role = (typeof ALL_ROLES)[number];

/**
 * Assignable role type (excludes owner)
 */
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

/**
 * Owner role - full control over everything
 */
export const owner = ac.newRole({
	...ownerAc.statements,
	folder: ["create", "update", "delete"],
	image: ["create", "update", "delete"],
});

/**
 * Admin role - can manage members and content, but not delete org or change owner
 */
export const admin = ac.newRole({
	...adminAc.statements,
	folder: ["create", "update", "delete"],
	image: ["create", "update", "delete"],
});

/**
 * Member role - can create and edit content
 */
export const member = ac.newRole({
	...memberAc.statements,
	folder: ["create", "update", "delete"],
	image: ["create", "update", "delete"],
});

/**
 * Viewer role - read-only access, cannot modify content
 * Has minimal permissions - just enough to be a valid role
 */
export const viewer = ac.newRole({
	// Viewers have no modification permissions
	// They can only view content (read access is implicit)
	folder: [],
	image: [],
});

/**
 * All roles as an object (for use in Better Auth config)
 */
export const roles = {
	owner,
	admin,
	member,
	viewer,
};
