import { authenticateUser } from '~~/server/services/auth/login'
import { loginSchema } from '~~/server/services/auth/schema'
import { apiError } from '~~/server/utils/apiI18n'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = loginSchema.safeParse(raw)

  // Always the same 401 — no policy/format leakage via status or message.
  if (!parsed.success) {
    apiError(event, 401, 'api.errors.invalidCredentials')
  }

  const user = await authenticateUser(parsed.data)
  if (!user) {
    apiError(event, 401, 'api.errors.invalidCredentials')
  }

  await setUserSession(event, {
    user,
    loggedInAt: new Date().toISOString(),
  })

  return { user }
})
