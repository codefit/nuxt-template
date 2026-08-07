import { createHash } from 'node:crypto'
import { slugify } from '#shared/utils/slug'
import { MEDIA_IMAGE_PREFIX } from '#shared/utils/mediaUrl'

export { MEDIA_IMAGE_PREFIX }

/**
 * Unique blob pathname: `{prefix}/{slug}-{contentHash}.{ext}`.
 * Slug stays readable from the original filename; content hash versions the object.
 */
export function buildMediaPathname(
  fileName: string,
  buffer: Buffer,
  prefix: string,
): { pathname: string, hash: string, slug: string } {
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16)

  const raw = fileName.trim() || 'file'
  const dot = raw.lastIndexOf('.')
  const base = dot > 0 ? raw.slice(0, dot) : raw
  const ext = (dot > 0 ? raw.slice(dot + 1) : '').toLowerCase().replace(/[^a-z0-9]/g, '')

  const slug = slugify(base) || 'file'
  const filename = ext ? `${slug}-${hash}.${ext}` : `${slug}-${hash}`
  const pathname = `${prefix.replace(/\/$/, '')}/${filename}`

  return { pathname, hash, slug }
}
