import { and, eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { blob } from '@nuxthub/blob'
import type { EntityKey } from '#shared/types/dto/entity'
import { getEntity } from '~~/server/services/cache/entities'

export async function deleteMedia(id: number): Promise<void> {
  const [row] = await db
    .select()
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Media not found.' })
  }

  await blob.del(row.pathname).catch(() => undefined)
  await db.delete(schema.media).where(eq(schema.media.id, id))
}

/** Remove all media for an entity model (e.g. on article soft-delete). */
export async function deleteEntityMedia(
  entityKey: EntityKey,
  modelId: number,
): Promise<void> {
  const entity = await getEntity(entityKey)
  const rows = await db
    .select()
    .from(schema.media)
    .where(and(
      eq(schema.media.entityId, entity.id),
      eq(schema.media.modelId, modelId),
    ))

  for (const row of rows) {
    await deleteMedia(row.id)
  }
}
