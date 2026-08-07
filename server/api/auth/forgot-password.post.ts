import { requestPasswordReset } from '~~/server/services/auth/passwordReset'
import { forgotPasswordSchema } from '~~/server/services/auth/schema'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    const parsed = forgotPasswordSchema.safeParse(data)
    if (!parsed.success) {
      apiError(event, 400, 'api.errors.invalidEmail')
    }
    return parsed.data
  })

  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || '')
  if (!siteUrl) {
    apiError(event, 500, 'api.errors.resetConfig')
  }

  const localePath = '/dashboard/reset-password'

  await requestPasswordReset(body, {
    siteUrl,
    resendApiKey: String(config.resendApiKey || ''),
    localePath,
  })

  return { ok: true }
})
