import { and, asc, eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import type { EntityMediaMap, MediaItemDto } from '#shared/types/media/dto'
import { getEntity } from '~~/server/services/cache/entities'
import { emptyEntityMedia, groupEntityMedia, mapMedia } from '~~/server/services/media/map'

export async function listMedia(
  entityKey: EntityKey,
  modelId: number,
  collection?: MediaCollection,
): Promise<MediaItemDto[]> {
  const entity = await getEntity(entityKey)

  const filters = [
    eq(schema.media.entityId, entity.id),
    eq(schema.media.modelId, modelId),
  ]

  if (collection) {
    filters.push(eq(schema.media.collection, collection))
  }

  const rows = await db
    .select()
    .from(schema.media)
    .where(and(...filters))
    .orderBy(asc(schema.media.rank), asc(schema.media.id))

  return rows.map(mapMedia)
}

export async function getEntityMedia(
  entityKey: EntityKey,
  modelId: number,
): Promise<EntityMediaMap> {
  const items = await listMedia(entityKey, modelId)
  if (items.length === 0) {
    return emptyEntityMedia()
  }
  return groupEntityMedia(items)
}
