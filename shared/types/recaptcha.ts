export interface RecaptchaVerifyResult {
  success: boolean
  score: number
  action: string
  hostname: string
  challengeTs?: string
  errorCodes?: string[]
}

/** Allowed reCAPTCHA v3 actions — must match client `execute` and server `verify`. */
export const RECAPTCHA_ACTIONS = {
  contact: 'contact',
} as const

export type RecaptchaAction = (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS]
