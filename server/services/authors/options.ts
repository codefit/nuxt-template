import { and, asc, isNull, like, or } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { AuthorOption } from '#shared/types/dto/author'

/**
 * Autocomplete options for author pickers (ArticleForm, …).
 */
export async function listAuthorOptions(q?: string): Promise<AuthorOption[]> {
  const where = [isNull(schema.authors.deletedAt)]

  const term = q?.trim()
  if (term) {
    const pattern = `%${term}%`
    where.push(
      or(
        like(schema.authors.name, pattern),
        like(schema.authors.email, pattern),
      )!,
    )
  }

  const rows = await db
    .select({
      id: schema.authors.id,
      name: schema.authors.name,
      email: schema.authors.email,
      phone: schema.authors.phone,
    })
    .from(schema.authors)
    .where(and(...where))
    .orderBy(asc(schema.authors.name))
    .limit(50)

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
  }))
}
