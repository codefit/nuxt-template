import { and, eq, ne } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { LanguageAdminDetail } from '#shared/types/language'
import { clearLanguageCache } from '~~/server/services/cache/languages'
import { getLanguageById } from '~~/server/services/languages/getById'
import type { LanguageFormParsed } from '~~/server/services/languages/schema'

function stamp(): Date {
  return new Date()
}

/**
 * Update language fields. Code is immutable (seeded / FK identity).
 * Ensures exactly one default and that the default stays active.
 */
export async function updateLanguage(
  id: number,
  input: LanguageFormParsed,
): Promise<LanguageAdminDetail> {
  const [row] = await db
    .select()
    .from(schema.languages)
    .where(eq(schema.languages.id, id))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Language not found.' })
  }

  const makeDefault = input.isDefault
  const makeActive = makeDefault ? true : input.isActive

  if (row.isDefault === 1 && !makeDefault) {
    throw createError({
      statusCode: 400,
      message: 'Cannot unset the default language. Set another language as default first.',
    })
  }

  if (row.isDefault === 1 && !makeActive) {
    throw createError({
      statusCode: 400,
      message: 'Cannot deactivate the default language.',
    })
  }

  const now = stamp()

  if (makeDefault) {
    await db
      .update(schema.languages)
      .set({
        isDefault: 0,
        updatedAt: now,
      })
      .where(and(
        eq(schema.languages.isDefault, 1),
        ne(schema.languages.id, id),
      ))
  }

  await db
    .update(schema.languages)
    .set({
      name: input.name.trim(),
      icon: input.icon,
      isActive: makeActive ? 1 : 0,
      isDefault: makeDefault ? 1 : 0,
      updatedAt: now,
    })
    .where(eq(schema.languages.id, id))

  clearLanguageCache()

  const detail = await getLanguageById(id)
  if (!detail) {
    throw createError({
      statusCode: 500,
      message: 'Language was updated but could not be loaded.',
    })
  }

  return detail
}
