export { MediaCollection, isMediaCollection } from './collection'
export type { MediaCollection as MediaCollectionType } from './collection'

export { FileType, FILE_TYPE_EXTENSIONS, FILE_TYPE_MIMES, fileTypeFromExtension, fileTypeFromMime, isFileType } from './fileType'
export type { FileType as FileTypeValue } from './fileType'

export { ImageRole, isImageRole } from './imageRole'
export type { ImageRole as ImageRoleValue } from './imageRole'

export { ImageSurface, isImageSurface } from './imageSurface'
export type { ImageSurface as ImageSurfaceValue } from './imageSurface'

export type {
  MediaUploadConfig,
  ImageVariantConfig,
  ImageSurfaceMap,
  MediaImageConfig,
  EntityMediaConfig,
} from './config'

export type {
  MediaItemDto,
  PendingMediaFile,
  EntityMediaMap,
} from './dto'
