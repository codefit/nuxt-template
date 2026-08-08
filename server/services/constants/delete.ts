import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { clearConstantCache } from '~~/server/services/cache/constants'

export async function deleteConstant(id: number): Promise<{ ok: true }> {
  const [row] = await db
    .select({ id: schema.constants.id })
    .from(schema.constants)
    .where(eq(schema.constants.id, id))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Constant not found.' })
  }

  await db.delete(schema.constants).where(eq(schema.constants.id, id))
  clearConstantCache()

  return { ok: true }
}
