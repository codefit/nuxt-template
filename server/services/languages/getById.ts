import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { LanguageAdminDetail } from '#shared/types/dto/language'
import { mapLanguageDetail } from '~~/server/services/languages/map'

export async function getLanguageById(
  id: number,
): Promise<LanguageAdminDetail | null> {
  const [row] = await db
    .select()
    .from(schema.languages)
    .where(eq(schema.languages.id, id))
    .limit(1)

  if (!row) {
    return null
  }

  return mapLanguageDetail(row)
}
