export interface ExtensionAuthSession {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
	};
	session: {
		id: string;
		expiresAt: string;
		updatedAt: string;
		plan: string;
		canWrite: boolean;
	};
}

export interface ExtensionInfo {
	installed: boolean;
	version?: string;
}

const CHROME_EXTENSION_ID = "logjliapdhfaooaeanbjojildfhilaab";

/**
 * Check if the InspoSnaps extension is installed.
 * Works on both Chromium and Firefox browsers.
 * The extension must have a content script that listens for the probe event.
 */
export function checkExtensionInstalled(timeout = 300): Promise<ExtensionInfo> {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve({ installed: false });
			return;
		}

		const timeoutId = setTimeout(() => {
			resolve({ installed: false });
		}, timeout);

		window.addEventListener(
			"INSPO_SNAPS_INSTALLED",
			((event: CustomEvent<{ version?: string }>) => {
				clearTimeout(timeoutId);
				resolve({
					installed: true,
					version: event.detail?.version,
				});
			}) as EventListener,
			{ once: true },
		);

		window.dispatchEvent(new CustomEvent("INSPO_SNAPS_PROBE"));
	});
}

/**
 * Notify InspoSnaps extension of auth state change.
 * - Chromium: uses externally_connectable (direct messaging)
 * - Firefox/other: falls back to postMessage (requires content script)
 */
export function notifyInspoSnapsExtension(
	session: ExtensionAuthSession | null,
): void {
	if (typeof window === "undefined") return;

	const message = {
		type: "INSPO_SNAPS_AUTH_UPDATE",
		payload: { session },
	};

	// Chromium-based browsers: use externally_connectable
	if (typeof chrome?.runtime?.sendMessage !== "undefined") {
		try {
			chrome.runtime.sendMessage(
				CHROME_EXTENSION_ID,
				message,
				() => chrome.runtime.lastError,
			);
		} catch {
			// Extension not installed - ignore
		}
		return;
	}

	// Firefox/other: fall back to postMessage (requires content script listener)
	window.postMessage(message, window.location.origin);
}
