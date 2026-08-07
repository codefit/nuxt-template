import type { MediaItemDto } from '#shared/types/media/dto'

/** Blob public URL prefix — must match `server/routes/images/[...pathname]`. */
export const MEDIA_IMAGE_PREFIX = '/images'

/** Public URL for a stored media pathname via `/images/**` (Nuxt Image + Hub Blob). */
export function mediaUrl(item: Pick<MediaItemDto, 'url' | 'pathname'> | null | undefined): string | null {
  if (!item) {
    return null
  }

  if (item.pathname) {
    return `${MEDIA_IMAGE_PREFIX}/${item.pathname}`
  }

  if (item.url) {
    if (item.url.startsWith('/api/media/file/')) {
      return `${MEDIA_IMAGE_PREFIX}/${item.url.slice('/api/media/file/'.length)}`
    }
    if (item.url.startsWith(`${MEDIA_IMAGE_PREFIX}/`)) {
      return item.url
    }
    return item.url
  }

  return null
}
