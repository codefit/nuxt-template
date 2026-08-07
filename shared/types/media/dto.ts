import type { MediaCollection } from './collection'
import type { FileType } from './fileType'

/** Persisted media row (original in blob; display sizes via Nuxt Image). */
export interface MediaItemDto {
  id: number
  entityId: number
  modelId: number
  collection: MediaCollection
  fileType: FileType
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

/** Client pending upload before / during save (may hold File). */
export interface PendingMediaFile {
  id: string
  collection: MediaCollection
  name: string
  mime: string
  size: number
  rank: number
  previewUrl?: string
  /** Existing DB row when editing. */
  mediaId?: number
  pathname?: string
  url?: string | null
  /** Browser File — never JSON-serialized to article endpoints. */
  file?: File
  /** Mark for deletion on next save. */
  remove?: boolean
}

/** Grouped media payload on admin entity detail. */
export interface EntityMediaMap {
  image: MediaItemDto | null
  gallery: MediaItemDto[]
  icon: MediaItemDto | null
  preview: MediaItemDto | null
}
