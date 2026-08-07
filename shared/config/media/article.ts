import type { EntityMediaConfig } from '#shared/types/media/config'
import { MediaCollection } from '#shared/types/media/collection'

/**
 * Article media slots:
 * - IMAGE → detail hero (primary, optional)
 * - PREVIEW → listing thumb (optional extra; listing falls back to IMAGE)
 * - GALLERY → ordered gallery
 */
export const articleMediaConfig = {
  [MediaCollection.IMAGE]: {
    upload: {
      label: 'Detailový obrázek článku',
      width: 1920,
      height: 1080,
      quality: 85,
      maxSizeKb: 4096,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      extensions: ['jpg', 'jpeg', 'png', 'webp'],
      collection: MediaCollection.IMAGE,
    },
    preview: {
      dashboard: {
        width: 160,
        height: 90,
        quality: 80,
      },
    },
    edit: {
      dashboard: {
        width: 640,
        height: 360,
        quality: 85,
      },
    },
    detail: {
      client: {
        width: 1280,
        height: 720,
        quality: 85,
        // Nuxt Image sizes syntax (not CSS media queries)
        sizes: '100vw md:1280px',
      },
    },
  },
  [MediaCollection.PREVIEW]: {
    upload: {
      label: 'Náhledový obrázek článku',
      width: 1200,
      height: 675,
      quality: 85,
      maxSizeKb: 3072,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      extensions: ['jpg', 'jpeg', 'png', 'webp'],
      collection: MediaCollection.PREVIEW,
    },
    preview: {
      client: {
        width: 480,
        height: 270,
        quality: 85,
        sizes: '100vw sm:50vw lg:33vw',
      },
      dashboard: {
        width: 120,
        height: 68,
        quality: 80,
      },
    },
    edit: {
      dashboard: {
        width: 640,
        height: 360,
        quality: 85,
      },
    },
  },
  [MediaCollection.GALLERY]: {
    upload: {
      label: 'Obrázek galerie článku',
      width: 2000,
      height: 2000,
      quality: 85,
      maxSizeKb: 4096,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      extensions: ['jpg', 'jpeg', 'png', 'webp'],
      collection: MediaCollection.GALLERY,
    },
    preview: {
      dashboard: {
        width: 120,
        height: 120,
        quality: 80,
      },
      client: {
        width: 200,
        height: 200,
        quality: 85,
        sizes: '200px',
      },
    },
    detail: {
      client: {
        width: 1200,
        height: 1200,
        quality: 85,
        sizes: '100vw md:1200px',
      },
    },
  },
} as const satisfies EntityMediaConfig
