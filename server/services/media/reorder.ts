import { and, eq, inArray } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import { getEntity } from '~~/server/services/cache/entities'

function stamp(): Date {
  return new Date()
}

/**
 * Persist gallery order. `orderedIds` is the full ordered list of media IDs.
 */
export async function reorderMedia(input: {
  entityKey: EntityKey
  modelId: number
  collection: MediaCollection
  orderedIds: number[]
}): Promise<void> {
  const entity = await getEntity(input.entityKey)
  const now = stamp()

  if (input.orderedIds.length === 0) {
    return
  }

  const rows = await db
    .select({ id: schema.media.id })
    .from(schema.media)
    .where(and(
      eq(schema.media.entityId, entity.id),
      eq(schema.media.modelId, input.modelId),
      eq(schema.media.collection, input.collection),
      inArray(schema.media.id, input.orderedIds),
    ))

  const allowed = new Set(rows.map(row => row.id))
  for (const id of input.orderedIds) {
    if (!allowed.has(id)) {
      throw createError({
        statusCode: 400,
        message: `Media #${id} does not belong to this entity collection.`,
      })
    }
  }

  await Promise.all(
    input.orderedIds.map((id, index) =>
      db
        .update(schema.media)
        .set({ rank: index, updatedAt: now })
        .where(eq(schema.media.id, id)),
    ),
  )
}
