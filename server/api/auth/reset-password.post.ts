import { resetPasswordWithToken } from '~~/server/services/auth/passwordReset'
import { resetErrorKey, resetPasswordSchema } from '~~/server/services/auth/schema'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    const parsed = resetPasswordSchema.safeParse(data)
    if (!parsed.success) {
      apiError(event, 400, resetErrorKey(parsed.error.issues))
    }
    return parsed.data
  })

  const result = await resetPasswordWithToken(body)
  if (!result.ok) {
    apiError(
      event,
      400,
      result.reason === 'expired'
        ? 'api.errors.resetExpired'
        : 'api.errors.resetInvalid',
    )
  }

  return { ok: true }
})
