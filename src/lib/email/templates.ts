export function passwordResetTemplate(resetUrl: string): {
	subject: string;
	html: string;
	text: string;
} {
	return {
		subject: "Reset your InspoSnaps password",
		html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111; font-size: 24px; margin-bottom: 24px;">Reset your password</h1>

  <p>We received a request to reset your InspoSnaps password. Click the button below to choose a new password:</p>

  <a href="${resetUrl}" style="display: inline-block; background-color: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 24px 0; font-weight: 500;">Reset Password</a>

  <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>

  <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="color: #666; font-size: 14px; word-break: break-all;">${resetUrl}</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

  <p style="color: #999; font-size: 12px;">InspoSnaps — Organize your inspiration</p>
</body>
</html>
`.trim(),
		text: `Reset your InspoSnaps password

We received a request to reset your password. Visit this link to choose a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

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
		html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111; font-size: 24px; margin-bottom: 24px;">Verify your email address</h1>

  <p>Thanks for signing up for InspoSnaps! Please verify your email address by clicking the button below:</p>

  <a href="${verificationUrl}" style="display: inline-block; background-color: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 24px 0; font-weight: 500;">Verify Email</a>

  <p style="color: #666; font-size: 14px;">If you didn't create an account with InspoSnaps, you can safely ignore this email.</p>

  <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

  <p style="color: #999; font-size: 12px;">InspoSnaps — Organize your inspiration</p>
</body>
</html>
`.trim(),
		text: `Verify your InspoSnaps email

Thanks for signing up! Please verify your email address by visiting this link:

${verificationUrl}

If you didn't create an account with InspoSnaps, you can safely ignore this email.

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
		html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #111; font-size: 24px; margin-bottom: 24px;">You're invited!</h1>

  <p><strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on InspoSnaps as a <strong>${role}</strong>.</p>

  <a href="${inviteLink}" style="display: inline-block; background-color: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 24px 0; font-weight: 500;">Accept Invitation</a>

  <p style="color: #666; font-size: 14px;">If you don't want to join this team, you can safely ignore this email.</p>

  <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteLink}</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

  <p style="color: #999; font-size: 12px;">InspoSnaps — Organize your inspiration</p>
</body>
</html>
`.trim(),
		text: `You're invited to join ${teamName}!

${inviterName} has invited you to join ${teamName} on InspoSnaps as a ${role}.

Accept the invitation by visiting this link:

${inviteLink}

If you don't want to join this team, you can safely ignore this email.

— InspoSnaps`,
	};
}
