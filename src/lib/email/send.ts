import { serverEnv } from "@/config/env/server";
import {
	emailVerificationTemplate,
	passwordResetTemplate,
	teamInvitationTemplate,
	welcomeVerificationTemplate,
} from "./templates";
import { unosend } from "./unosend";

export async function sendPasswordResetEmail(
	to: string,
	resetUrl: string,
): Promise<{ success: boolean; error?: string }> {
	const template = passwordResetTemplate(resetUrl);

	const { error } = await unosend.emails.send({
		from: serverEnv.EMAIL_FROM,
		to,
		subject: template.subject,
		html: template.html,
		text: template.text,
	});

	if (error) {
		console.error("[Email Error] Password reset:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

export async function sendWelcomeVerificationEmail(
	to: string,
	verificationUrl: string,
	userName?: string,
): Promise<{ success: boolean; error?: string }> {
	const template = welcomeVerificationTemplate(verificationUrl, userName);

	const { error } = await unosend.emails.send({
		from: serverEnv.EMAIL_FROM,
		to,
		subject: template.subject,
		html: template.html,
		text: template.text,
	});

	if (error) {
		console.error("[Email Error] Welcome verification:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

export async function sendVerificationEmail(
	to: string,
	verificationUrl: string,
): Promise<{ success: boolean; error?: string }> {
	const template = emailVerificationTemplate(verificationUrl);

	const { error } = await unosend.emails.send({
		from: serverEnv.EMAIL_FROM,
		to,
		subject: template.subject,
		html: template.html,
		text: template.text,
	});

	if (error) {
		console.error("[Email Error] Verification:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

export async function sendTeamInvitationEmail(
	to: string,
	params: {
		inviteLink: string;
		inviterName: string;
		teamName: string;
		role: string;
	},
): Promise<{ success: boolean; error?: string }> {
	const template = teamInvitationTemplate(params);

	const { error } = await unosend.emails.send({
		from: serverEnv.EMAIL_FROM,
		to,
		subject: template.subject,
		html: template.html,
		text: template.text,
	});

	if (error) {
		console.error("[Email Error] Team invitation:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}
