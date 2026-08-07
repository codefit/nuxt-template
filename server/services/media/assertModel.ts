import { and, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { Entity, type EntityKey } from '#shared/types/dto/entity'

/**
 * Ensure `modelId` exists for the entity before attaching media.
 * Prevents authed users from orphaning blobs onto fake / foreign IDs.
 */
export async function assertMediaModel(
  entityKey: EntityKey,
  modelId: number,
): Promise<void> {
  if (entityKey === Entity.ARTICLE) {
    const [row] = await db
      .select({ id: schema.articles.id })
      .from(schema.articles)
      .where(and(
        eq(schema.articles.id, modelId),
        isNull(schema.articles.deletedAt),
      ))
      .limit(1)

    if (!row) {
      throw createError({ statusCode: 404, message: 'Article not found.' })
    }
    return
  }

  throw createError({
    statusCode: 400,
    message: `Media is not enabled for entity "${entityKey}".`,
  })
}
