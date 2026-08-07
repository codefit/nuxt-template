import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { AuthorDetail } from '#shared/types/dto/author'
import { normalizeAuthorInput } from '~~/server/services/authors/create'
import { getAuthorById } from '~~/server/services/authors/getById'
import type { AuthorFormParsed } from '~~/server/services/authors/schema'

/**
 * Update author fields (soft-deleted rows are not found).
 */
export async function updateAuthor(
  id: number,
  input: AuthorFormParsed,
): Promise<AuthorDetail> {
  const [row] = await db
    .select({ id: schema.authors.id })
    .from(schema.authors)
    .where(and(eq(schema.authors.id, id), isNull(schema.authors.deletedAt)))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Author not found.' })
  }

  const data = normalizeAuthorInput(input)
  const now = new Date()

  await db
    .update(schema.authors)
    .set({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      updatedAt: now,
    })
    .where(eq(schema.authors.id, id))

  const detail = await getAuthorById(id)
  if (!detail) {
    throw createError({
      statusCode: 500,
      message: 'Author was updated but could not be loaded.',
    })
  }

  return detail
}
