import { z } from 'zod'

/**
 * Login validates presence only — never expose password policy to attackers.
 * Failed auth always returns the same credentials error.
 */
export const loginSchema = z.object({
  email: z.string().trim().min(1).max(255),
  password: z.string().min(1).max(128),
})

/** Shared policy for create/reset — callers must map failures to generic i18n. */
const newPassword = z.string().min(8).max(128)

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  password: newPassword,
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255),
})

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1).max(128),
  password: newPassword,
})

export type LoginParsed = z.infer<typeof loginSchema>
export type RegisterParsed = z.infer<typeof registerSchema>
export type ForgotPasswordParsed = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordParsed = z.infer<typeof resetPasswordSchema>

export function registerErrorKey(issues: { path: PropertyKey[] }[]): string {
  const path = String(issues[0]?.path[0] ?? '')
  if (path === 'password') {
    return 'api.errors.passwordRequirements'
  }
  if (path === 'email') {
    return 'api.errors.invalidEmail'
  }
  return 'api.errors.registerInvalid'
}

export function resetErrorKey(issues: { path: PropertyKey[] }[]): string {
  const path = String(issues[0]?.path[0] ?? '')
  if (path === 'password') {
    return 'api.errors.passwordRequirements'
  }
  if (path === 'token') {
    return 'api.errors.resetInvalid'
  }
  return 'api.errors.resetInvalid'
}
