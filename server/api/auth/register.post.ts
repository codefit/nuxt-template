import { registerUser } from '~~/server/services/auth/register'
import { registerErrorKey, registerSchema } from '~~/server/services/auth/schema'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * POST /api/auth/register — gated by NUXT_PUBLIC_AUTH_ALLOW_REGISTER (default off).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.public.authAllowRegister) {
    apiError(event, 403, 'api.errors.registerDisabled')
  }

  const body = await readValidatedBody(event, (data) => {
    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      apiError(event, 400, registerErrorKey(parsed.error.issues))
    }
    return parsed.data
  })

  const result = await registerUser(body)
  if (!result.ok) {
    apiError(event, 409, 'api.errors.emailExists')
  }

  const user = result.user
  await setUserSession(event, {
    user,
    loggedInAt: new Date().toISOString(),
  })

  return { user }
})
