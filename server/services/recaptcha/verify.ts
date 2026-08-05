import type { RecaptchaAction, RecaptchaVerifyResult } from '#shared/types/recaptcha'

interface SiteverifyResponse {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  challenge_ts?: string
  'error-codes'?: string[]
}

export async function verifyRecaptcha(input: {
  secret: string
  token: string
  action: RecaptchaAction
  minScore?: number
  remoteip?: string
}): Promise<RecaptchaVerifyResult> {
  const secret = input.secret.trim()
  const token = input.token.trim()

  if (!secret || !token) {
    return {
      success: false,
      score: 0,
      action: '',
      hostname: '',
      errorCodes: ['missing-input'],
    }
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (input.remoteip) {
    body.set('remoteip', input.remoteip)
  }

  const raw = await $fetch<SiteverifyResponse>(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      body,
    },
  )

  const score = typeof raw.score === 'number' ? raw.score : 0
  const action = raw.action || ''
  const minScore = input.minScore ?? 0.5
  const actionOk = action === input.action
  const scoreOk = score >= minScore

  return {
    success: Boolean(raw.success) && actionOk && scoreOk,
    score,
    action,
    hostname: raw.hostname || '',
    challengeTs: raw.challenge_ts,
    errorCodes: raw['error-codes'],
  }
}
