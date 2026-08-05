import { db, schema } from '@nuxthub/db'
import { RECAPTCHA_ACTIONS } from '#shared/types/recaptcha'
import { verifyRecaptcha } from '~~/server/services/recaptcha/verify'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const body = await readBody<MessageForm & {
    gdpr?: boolean
    recaptchaToken?: string
  }>(event)

  const config = useRuntimeConfig(event)
  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const message = body?.message?.trim()
  const recaptchaToken = body?.recaptchaToken?.trim() || ''

  if (!body?.gdpr) {
    apiError(event, 400, 'api.errors.gdprRequired')
  }

  if (!name || !email || !message) {
    apiError(event, 400, 'api.errors.messageRequired')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    apiError(event, 400, 'api.errors.invalidEmail')
  }

  const secret = String(config.recaptchaSecretKey || '').trim()
  if (!secret) {
    apiError(event, 500, 'api.errors.recaptchaConfig')
  }

  if (!recaptchaToken) {
    apiError(event, 400, 'api.errors.recaptchaRequired')
  }

  const minScore = Number(config.recaptchaMinScore)
  const verified = await verifyRecaptcha({
    secret,
    token: recaptchaToken,
    action: RECAPTCHA_ACTIONS.contact,
    minScore: Number.isFinite(minScore) ? minScore : 0.5,
    remoteip: getRequestIP(event, { xForwardedFor: true }) || undefined,
  })

  if (!verified.success) {
    apiError(event, 400, 'api.errors.recaptchaFailed')
  }

  const [row] = await db
    .insert(schema.messages)
    .values({
      name,
      email,
      message,
      createdAt: new Date(),
    })
    .returning()

  return row
})
