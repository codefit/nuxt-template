import type { MediaItemDto, EntityMediaMap } from '#shared/types/media/dto'
import { MediaCollection, isMediaCollection } from '#shared/types/media/collection'
import { isFileType } from '#shared/types/media/fileType'

export interface MediaRowLike {
  id: number
  entityId: number
  modelId: number
  collection: string
  fileType: string
  pathname: string
  url: string | null
  mime: string
  name: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  rank: number
}

export function mapMedia(row: MediaRowLike): MediaItemDto {
  return {
    id: row.id,
    entityId: row.entityId,
    modelId: row.modelId,
    collection: isMediaCollection(row.collection)
      ? row.collection
      : row.collection as MediaItemDto['collection'],
    fileType: isFileType(row.fileType)
      ? row.fileType
      : row.fileType as MediaItemDto['fileType'],
    pathname: row.pathname,
    url: row.url,
    mime: row.mime,
    name: row.name,
    size: row.size,
    width: row.width,
    height: row.height,
    alt: row.alt,
    rank: row.rank,
  }
}

export function emptyEntityMedia(): EntityMediaMap {
  return {
    image: null,
    gallery: [],
    icon: null,
    preview: null,
  }
}

export function groupEntityMedia(items: MediaItemDto[]): EntityMediaMap {
  const result = emptyEntityMedia()

  for (const item of items) {
    if (item.collection === MediaCollection.IMAGE) {
      result.image = item
    }
    else if (item.collection === MediaCollection.ICON) {
      result.icon = item
    }
    else if (item.collection === MediaCollection.PREVIEW) {
      result.preview = item
    }
    else if (item.collection === MediaCollection.GALLERY) {
      result.gallery.push(item)
    }
  }

  result.gallery.sort((a, b) => a.rank - b.rank)
  return result
}
