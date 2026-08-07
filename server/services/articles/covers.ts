import { and, eq, inArray } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { Entity } from '#shared/types/dto/entity'
import { MediaCollection } from '#shared/types/media/collection'
import { mediaUrl } from '#shared/utils/mediaUrl'
import { requireEntityId } from '~~/server/services/cache/entities'

export type ArticleCoverKind = 'preview' | 'detail'

export interface ArticleCoverEntry {
  /** Public URL for display. */
  url: string
  /**
   * Source slot on disk (PREVIEW or IMAGE).
   * Display sizing still uses the page role (listing→PREVIEW sizes, detail→DETAIL sizes),
   * not this field — fallback file must not switch size config.
   */
  collection: typeof MediaCollection.PREVIEW | typeof MediaCollection.IMAGE
}

/**
 * Batch-resolve article image URLs.
 * - preview (listing): PREVIEW first, else IMAGE (sized as preview on client)
 * - detail (article page): IMAGE first, else PREVIEW
 */
export async function articleCoverMap(
  modelIds: number[],
  kind: ArticleCoverKind = 'preview',
): Promise<Map<number, ArticleCoverEntry>> {
  const result = new Map<number, ArticleCoverEntry>()
  if (modelIds.length === 0) {
    return result
  }

  const primary = kind === 'preview' ? MediaCollection.PREVIEW : MediaCollection.IMAGE
  const fallback = kind === 'preview' ? MediaCollection.IMAGE : MediaCollection.PREVIEW

  const entityId = await requireEntityId(Entity.ARTICLE)
  const rows = await db
    .select({
      modelId: schema.media.modelId,
      collection: schema.media.collection,
      pathname: schema.media.pathname,
      url: schema.media.url,
    })
    .from(schema.media)
    .where(and(
      eq(schema.media.entityId, entityId),
      inArray(schema.media.collection, [primary, fallback]),
      inArray(schema.media.modelId, modelIds),
    ))

  const byModel = new Map<number, {
    primary?: ArticleCoverEntry
    fallback?: ArticleCoverEntry
  }>()

  for (const row of rows) {
    const url = mediaUrl(row)
    if (!url) {
      continue
    }
    if (row.collection !== primary && row.collection !== fallback) {
      continue
    }

    const entry: ArticleCoverEntry = {
      url,
      collection: row.collection,
    }
    const bucket = byModel.get(row.modelId) ?? {}
    if (row.collection === primary) {
      bucket.primary = entry
    }
    else {
      bucket.fallback = entry
    }
    byModel.set(row.modelId, bucket)
  }

  for (const [modelId, bucket] of byModel) {
    const chosen = bucket.primary ?? bucket.fallback
    if (chosen) {
      result.set(modelId, chosen)
    }
  }

  return result
}

/** Convenience: URL-only map (legacy list DTO `image` string). */
export async function articleCoverUrlMap(
  modelIds: number[],
  kind: ArticleCoverKind = 'preview',
): Promise<Map<number, string>> {
  const covers = await articleCoverMap(modelIds, kind)
  const urls = new Map<number, string>()
  for (const [id, entry] of covers) {
    urls.set(id, entry.url)
  }
  return urls
}
