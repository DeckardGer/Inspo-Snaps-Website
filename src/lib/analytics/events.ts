import { getPostHog } from "./posthog";

function capture(event: string, properties?: Record<string, unknown>) {
	getPostHog()?.capture(event, properties);
}

function captureOnce(event: string, properties?: Record<string, unknown>) {
	if (typeof window === "undefined") return;
	const key = `ph_first_${event}`;
	if (localStorage.getItem(key)) return;
	capture(event, properties);
	localStorage.setItem(key, "1");
}

// --- Auth ---

export function trackSignupCompleted(method: "email" | "google") {
	capture("signup_completed", {
		method,
		$set_once: { signup_method: method },
	});
}

export function identifyUser(user: {
	id: string;
	email: string;
	plan: string;
	createdAt: string;
}) {
	const ph = getPostHog();
	if (!ph) return;
	ph.identify(user.id, {
		email: user.email,
		plan: user.plan,
		created_at: user.createdAt,
	});
}

export function resetUser() {
	getPostHog()?.reset();
}

// --- Subscriptions ---

export function trackPricingModalOpened(source?: string) {
	capture("pricing_modal_opened", { source });
}

export function trackUpgradeInitiated(plan: string, billingCycle: string) {
	capture("upgrade_initiated", { plan, billingCycle });
}

export function trackCheckoutCompleted(plan: string) {
	capture("checkout_completed", { plan });
}

export function trackSubscriptionCancelled(plan: string) {
	capture("subscription_cancelled", { plan });
}

export function trackTrialExpired() {
	capture("trial_expired");
}

export function trackWriteAccessBlocked() {
	capture("write_access_blocked");
}

// --- Folders ---

export function trackFirstFolderCreated() {
	captureOnce("first_folder_created");
}

// --- Images ---

export function trackFirstImageUploaded() {
	captureOnce("first_image_uploaded");
}

export function trackImageUploadFailed(
	reason: string,
	fileSize: number,
	mimeType: string,
) {
	capture("image_upload_failed", { reason, fileSize, mimeType });
}

// --- Sharing ---

export function trackShareModalOpened() {
	capture("share_modal_opened");
}

export function trackFirstShare(type: "link" | "user") {
	captureOnce("first_share", { type });
}

export function trackInvitationResponded(action: "accepted" | "declined") {
	capture("invitation_responded", { action });
}

// --- Errors ---

export function trackErrorPageShown(type: string) {
	capture("error_page_shown", { type });
}
