import type { H3Event } from 'h3'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * Require an authenticated dashboard session (throws 401).
 */
export async function requireAdmin(event: H3Event) {
  try {
    return await requireUserSession(event)
  }
  catch {
    apiError(event, 401, 'api.errors.unauthorized')
  }
}
