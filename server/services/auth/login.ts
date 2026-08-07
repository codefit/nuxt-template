import type { LoginParsed } from '~~/server/services/auth/schema'
import { findUserByEmail } from '~~/server/services/auth/find'
import { toSessionUser } from '~~/server/services/auth/map'
import { verifyPlain } from '~~/server/services/auth/password'

export async function authenticateUser(input: LoginParsed) {
  const user = await findUserByEmail(input.email)

  if (!user) {
    return null
  }

  const valid = await verifyPlain(user.passwordHash, input.password)
  if (!valid) {
    return null
  }

  return toSessionUser(user)
}
