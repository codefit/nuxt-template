import type { MediaImageConfig, ImageVariantConfig } from '#shared/types/media/config'
import { ImageRole } from '#shared/types/media/imageRole'
import type { ImageSurface } from '#shared/types/media/imageSurface'
import type { MediaItemDto } from '#shared/types/media/dto'
import { mediaUrl } from '#shared/utils/mediaUrl'

/**
 * Resolve display size config for a role + surface from entity media config.
 * Falls back: requested → PREVIEW → upload dimensions.
 */
export function resolveVariantConfig(
  config: MediaImageConfig,
  role: typeof ImageRole[keyof typeof ImageRole],
  surface: ImageSurface,
): ImageVariantConfig {
  if (role === ImageRole.DETAIL && config.detail?.[surface]) {
    return config.detail[surface]!
  }
  if (role === ImageRole.EDIT && config.edit?.[surface]) {
    return config.edit[surface]!
  }
  if (role === ImageRole.PREVIEW && config.preview?.[surface]) {
    return config.preview[surface]!
  }
  if (config.preview?.[surface]) {
    return config.preview[surface]!
  }

  return {
    width: config.upload.width,
    height: config.upload.height,
    quality: config.upload.quality,
  }
}

/** Public URL for a media row (original); Nuxt Image resizes via role/surface. */
export function resolveMediaSrc(
  item: MediaItemDto | null | undefined,
): string | null {
  return mediaUrl(item)
}
