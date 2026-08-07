import type { MediaCollection } from './collection'
import type { ImageSurface } from './imageSurface'

/** Source upload constraints for a media collection. */
export interface MediaUploadConfig {
  label: string
  width: number
  height: number
  quality: number
  maxSizeKb: number
  mimeTypes: readonly string[]
  extensions: readonly string[]
  collection: MediaCollection
}

/** Derived display / edit size for a surface. */
export interface ImageVariantConfig {
  width: number
  height: number
  quality: number
  sizes?: string
}

export type ImageSurfaceMap = Partial<Record<ImageSurface, ImageVariantConfig>>

/** Full image pipeline for one collection on an entity. */
export interface MediaImageConfig {
  upload: MediaUploadConfig
  preview?: ImageSurfaceMap
  detail?: ImageSurfaceMap
  edit?: ImageSurfaceMap
}

/** Entity may expose several named collections (image, gallery, icon…). */
export type EntityMediaConfig = Partial<Record<MediaCollection, MediaImageConfig>>
