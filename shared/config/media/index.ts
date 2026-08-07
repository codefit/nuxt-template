import type { EntityKey } from '#shared/types/dto/entity'
import { Entity } from '#shared/types/dto/entity'
import type { EntityMediaConfig, MediaImageConfig } from '#shared/types/media/config'
import type { MediaCollection } from '#shared/types/media/collection'
import { articleMediaConfig } from './article'

/** Registry: entity → collection image pipelines. Extend when adding products, etc. */
export const mediaConfigByEntity: Partial<Record<EntityKey, EntityMediaConfig>> = {
  [Entity.ARTICLE]: articleMediaConfig,
}

export function getMediaConfig(
  entity: EntityKey,
  collection: MediaCollection,
): MediaImageConfig | null {
  return mediaConfigByEntity[entity]?.[collection] ?? null
}

export function requireMediaConfig(
  entity: EntityKey,
  collection: MediaCollection,
): MediaImageConfig {
  const config = getMediaConfig(entity, collection)
  if (!config) {
    throw new Error(`Media config missing for ${entity}/${collection}`)
  }
  return config
}
