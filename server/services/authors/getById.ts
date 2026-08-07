import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { AuthorDetail } from '#shared/types/dto/author'

export async function getAuthorById(id: number): Promise<AuthorDetail | null> {
  const [row] = await db
    .select()
    .from(schema.authors)
    .where(and(eq(schema.authors.id, id), isNull(schema.authors.deletedAt)))
    .limit(1)

  if (!row) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
