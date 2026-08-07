import { blob } from '@nuxthub/blob'
import { and, eq, sql } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import { MediaCollection as Collections } from '#shared/types/media/collection'
import type { MediaItemDto } from '#shared/types/media/dto'
import { fileTypeFromMime } from '#shared/types/media/fileType'
import { MEDIA_IMAGE_PREFIX, buildMediaPathname } from '~~/server/services/media/pathname'
import { getEntity } from '~~/server/services/cache/entities'
import { assertMediaModel } from '~~/server/services/media/assertModel'
import { mapMedia } from '~~/server/services/media/map'
import { assertMediaUpload } from '~~/server/services/media/validate'

function stamp(): Date {
  return new Date()
}

function blobPrefix(entity: EntityKey, modelId: number, collection: MediaCollection): string {
  return `media/${entity}/${modelId}/${collection}`
}

function publicUrl(pathname: string): string {
  return `${MEDIA_IMAGE_PREFIX}/${pathname}`
}

/**
 * Store file in Hub Blob and insert media row.
 * Pathname = slugified original name + content hash (unique version).
 * DB `name` keeps the original upload filename for display.
 */
export async function uploadMedia(input: {
  entityKey: EntityKey
  modelId: number
  collection: MediaCollection
  file: File
  rank?: number
  alt?: string | null
}): Promise<MediaItemDto> {
  const { entityKey, modelId, collection, file } = input

  assertMediaUpload(entityKey, collection, {
    name: file.name,
    mime: file.type,
    size: file.size,
  })
  await assertMediaModel(entityKey, modelId)

  const entity = await getEntity(entityKey)
  const now = stamp()
  const prefix = blobPrefix(entityKey, modelId, collection)
  const buffer = Buffer.from(await file.arrayBuffer())
  const { pathname } = buildMediaPathname(file.name, buffer, prefix)

  const stored = await blob.put(pathname, buffer, {
    addRandomSuffix: false,
  })

  const isSingle
    = collection === Collections.IMAGE
      || collection === Collections.ICON
      || collection === Collections.PREVIEW

  let rank = input.rank ?? 0
  if (collection === Collections.GALLERY && input.rank == null) {
    const [agg] = await db
      .select({ max: sql<number>`coalesce(max(${schema.media.rank}), -1)` })
      .from(schema.media)
      .where(and(
        eq(schema.media.entityId, entity.id),
        eq(schema.media.modelId, modelId),
        eq(schema.media.collection, collection),
      ))
    rank = Number(agg?.max ?? -1) + 1
  }

  const url = publicUrl(stored.pathname)

  let row: typeof schema.media.$inferSelect
  try {
    const [inserted] = await db
      .insert(schema.media)
      .values({
        entityId: entity.id,
        modelId,
        collection,
        fileType: fileTypeFromMime(file.type),
        pathname: stored.pathname,
        url,
        mime: file.type || 'application/octet-stream',
        name: file.name,
        size: file.size,
        width: null,
        height: null,
        alt: input.alt ?? null,
        rank,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    if (!inserted) {
      throw createError({ statusCode: 500, message: 'Media insert failed.' })
    }
    row = inserted
  }
  catch (error) {
    await blob.del(stored.pathname).catch(() => undefined)
    throw error
  }

  // Replace previous single-slot file only after the new row is committed.
  if (isSingle) {
    const previous = await db
      .select()
      .from(schema.media)
      .where(and(
        eq(schema.media.entityId, entity.id),
        eq(schema.media.modelId, modelId),
        eq(schema.media.collection, collection),
      ))

    for (const old of previous) {
      if (old.id === row.id) {
        continue
      }
      await blob.del(old.pathname).catch(() => undefined)
      await db.delete(schema.media).where(eq(schema.media.id, old.id))
    }
  }

  return mapMedia(row)
}
