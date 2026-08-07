import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import { getMediaConfig } from '#shared/config/media'
import { fileTypeFromExtension, fileTypeFromMime, FileType } from '#shared/types/media/fileType'

export interface MediaFileMeta {
  name: string
  mime: string
  size: number
}

/**
 * Validate an upload against the entity + collection media config.
 * Throws createError(400) on failure.
 */
export function assertMediaUpload(
  entity: EntityKey,
  collection: MediaCollection,
  file: MediaFileMeta,
): void {
  const config = getMediaConfig(entity, collection)
  if (!config) {
    throw createError({
      statusCode: 400,
      message: 'Media uploads are not configured for this entity collection.',
    })
  }

  const { upload } = config
  const maxBytes = upload.maxSizeKb * 1024
  if (file.size <= 0 || file.size > maxBytes) {
    throw createError({
      statusCode: 400,
      message: `File exceeds max size of ${upload.maxSizeKb} KB.`,
    })
  }

  const ext = file.name.includes('.')
    ? file.name.split('.').pop()!.toLowerCase()
    : ''

  if (!upload.extensions.includes(ext)) {
    throw createError({
      statusCode: 400,
      message: `Extension ".${ext}" is not allowed.`,
    })
  }

  if (!upload.mimeTypes.includes(file.mime)) {
    throw createError({
      statusCode: 400,
      message: `MIME type "${file.mime}" is not allowed.`,
    })
  }

  const fromMime = fileTypeFromMime(file.mime)
  const fromExt = fileTypeFromExtension(ext)
  if (fromMime === FileType.UNKNOWN && fromExt === FileType.UNKNOWN) {
    throw createError({
      statusCode: 400,
      message: 'Unrecognized file type.',
    })
  }
}
