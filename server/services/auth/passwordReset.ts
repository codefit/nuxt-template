import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { sendEmail } from '~~/server/services/mail/resend'
import { findUserByEmail, findUserByResetToken } from '~~/server/services/auth/find'
import { updatePassword } from '~~/server/services/auth/register'
import type { ForgotPasswordParsed, ResetPasswordParsed } from '~~/server/services/auth/schema'

const RESET_TTL_MS = 60 * 60 * 1000

function makeToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Always succeeds from the caller's POV (no email enumeration).
 * Sends reset mail when Resend is configured; otherwise logs the link in dev.
 */
export async function requestPasswordReset(
  input: ForgotPasswordParsed,
  opts: { siteUrl: string, resendApiKey: string, localePath: string },
) {
  const user = await findUserByEmail(input.email)
  if (!user) {
    return { ok: true as const }
  }

  const token = makeToken()
  const now = new Date()

  await db
    .update(schema.users)
    .set({
      resetToken: token,
      resetExpiresAt: new Date(now.getTime() + RESET_TTL_MS),
      updatedAt: now,
    })
    .where(eq(schema.users.id, user.id))

  const resetUrl = `${opts.siteUrl.replace(/\/$/, '')}${opts.localePath}?token=${token}`

  if (opts.resendApiKey) {
    await sendEmail(opts.resendApiKey, {
      to: user.email,
      subject: 'Reset password',
      html: `<p>Reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Link expires in 1 hour.</p>`,
    })
  }
  else if (import.meta.dev) {
    console.info('[auth] Password reset link (no Resend key):', resetUrl)
  }

  return { ok: true as const }
}

export async function resetPasswordWithToken(input: ResetPasswordParsed) {
  const user = await findUserByResetToken(input.token)
  if (!user?.resetExpiresAt) {
    return { ok: false as const, reason: 'invalid' as const }
  }

  if (user.resetExpiresAt.getTime() < Date.now()) {
    return { ok: false as const, reason: 'expired' as const }
  }

  await updatePassword(user.id, input.password)
  return { ok: true as const }
}
