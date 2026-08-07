/**
 * Media slot on an entity — not a free-form string.
 * IMAGE = cover / main visual, ICON = small glyph, GALLERY = ordered set.
 */
export const MediaCollection = {
  IMAGE: 'image',
  ICON: 'icon',
  GALLERY: 'gallery',
  PREVIEW: 'preview',
  ATTACHMENT: 'attachment',
} as const

export type MediaCollection = (typeof MediaCollection)[keyof typeof MediaCollection]

export function isMediaCollection(value: string): value is MediaCollection {
  return Object.values(MediaCollection).includes(value as MediaCollection)
}
