const BASE_URL = "https://insposnaps.com";
const LOGO_URL = `${BASE_URL}/logo192.png`;

function emailLayout(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; overflow: hidden;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 36px 40px 0;">
              <a href="${BASE_URL}" style="text-decoration: none;">
                <img src="${LOGO_URL}" alt="InspoSnaps" width="40" height="40" style="display: block; border: 0;" />
              </a>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 24px 40px 36px;">
              ${content}
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">
          <tr>
            <td align="center" style="padding: 24px 40px; font-size: 12px; line-height: 1.5; color: #a1a1aa;">
              <a href="${BASE_URL}" style="color: #71717a; text-decoration: none; font-weight: 500;">InspoSnaps</a> &mdash; Organize, save, and share your visual inspiration
              <br />
              <a href="${BASE_URL}" style="color: #a1a1aa; text-decoration: underline;">insposnaps.com</a> &middot; <a href="https://x.com/DeckardBuilds" style="color: #a1a1aa; text-decoration: underline;">@DeckardBuilds</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function ctaButton(href: string, label: string): string {
	return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
  <tr>
    <td align="center" style="background-color: #444CE7; border-radius: 8px;">
      <a href="${href}" style="display: inline-block; padding: 13px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;">${label}</a>
    </td>
  </tr>
</table>`;
}

export function passwordResetTemplate(resetUrl: string): {
	subject: string;
	html: string;
	text: string;
} {
	return {
		subject: "Reset your InspoSnaps password",
		html: emailLayout(`
              <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #18181b; line-height: 1.3;">Reset your password</h1>
              <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #3f3f46;">We received a request to reset your InspoSnaps password. Click the button below to choose a new one:</p>
              ${ctaButton(resetUrl, "Reset Password")}
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #71717a;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717a;">Or <a href="${resetUrl}" style="color: #444CE7; text-decoration: underline;">click this link</a>.</p>
`),
		text: `Reset your InspoSnaps password

We received a request to reset your password. Visit this link to choose a new one:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

— InspoSnaps`,
	};
}

export function welcomeVerificationTemplate(
	verificationUrl: string,
	userName?: string,
): {
	subject: string;
	html: string;
	text: string;
} {
	const greeting = userName
		? `Welcome, ${userName}!`
		: "Welcome to InspoSnaps!";

	return {
		subject: "Welcome to InspoSnaps — verify your email",
		html: emailLayout(`
              <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #18181b; line-height: 1.3;">${greeting}</h1>
              <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #3f3f46;">You're in! Start organizing your visual inspiration with smart folders, share collections with anyone, and access everything from any device.</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #3f3f46;">Verify your email to get started:</p>
              ${ctaButton(verificationUrl, "Verify Email")}
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #71717a;">If you didn't create an account with InspoSnaps, you can safely ignore this email.</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717a;">Or <a href="${verificationUrl}" style="color: #444CE7; text-decoration: underline;">click this link</a>.</p>
`),
		text: `${greeting}

You're in! Start organizing your visual inspiration with smart folders, share collections with anyone, and access everything from any device.

Verify your email to get started:

${verificationUrl}

If you didn't create an account with InspoSnaps, you can safely ignore this email.

— InspoSnaps`,
	};
}

export function emailVerificationTemplate(verificationUrl: string): {
	subject: string;
	html: string;
	text: string;
} {
	return {
		subject: "Verify your InspoSnaps email",
		html: emailLayout(`
              <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #18181b; line-height: 1.3;">Verify your email address</h1>
              <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #3f3f46;">Please verify your email address by clicking the button below:</p>
              ${ctaButton(verificationUrl, "Verify Email")}
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #71717a;">If you didn't request this, you can safely ignore this email.</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717a;">Or <a href="${verificationUrl}" style="color: #444CE7; text-decoration: underline;">click this link</a>.</p>
`),
		text: `Verify your InspoSnaps email

Please verify your email address by visiting this link:

${verificationUrl}

If you didn't request this, you can safely ignore this email.

— InspoSnaps`,
	};
}

export function teamInvitationTemplate(params: {
	inviteLink: string;
	inviterName: string;
	teamName: string;
	role: string;
}): {
	subject: string;
	html: string;
	text: string;
} {
	const { inviteLink, inviterName, teamName, role } = params;

	return {
		subject: `You've been invited to join ${teamName} on InspoSnaps`,
		html: emailLayout(`
              <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #18181b; line-height: 1.3;">You're invited!</h1>
              <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.6; color: #3f3f46;"><strong style="color: #18181b;">${inviterName}</strong> has invited you to join <strong style="color: #18181b;">${teamName}</strong> on InspoSnaps as a <strong style="color: #18181b;">${role}</strong>.</p>
              ${ctaButton(inviteLink, "Accept Invitation")}
              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #71717a;">If you don't want to join this team, you can safely ignore this email.</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717a;">Or <a href="${inviteLink}" style="color: #444CE7; text-decoration: underline;">click this link</a>.</p>
`),
		text: `You're invited to join ${teamName}!

${inviterName} has invited you to join ${teamName} on InspoSnaps as a ${role}.

Accept the invitation by visiting this link:

${inviteLink}

If you don't want to join this team, you can safely ignore this email.

— InspoSnaps`,
	};
}
