import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * GET /api/messages/:id — read one message.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'id')
  const id = Number(raw)

  if (!Number.isFinite(id) || id <= 0) {
    apiError(event, 400, 'api.errors.invalidMessageId')
  }

  const [row] = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.id, id))
    .limit(1)

  if (!row) {
    apiError(event, 404, 'api.errors.messageNotFound')
  }

  return row
})
