<script setup lang="ts">
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import type { MediaItemDto } from '#shared/types/media/dto'
import { ImageRole } from '#shared/types/media/imageRole'
import { ImageSurface } from '#shared/types/media/imageSurface'
import { getMediaConfig } from '#shared/config/media'
import { resolveMediaSrc, resolveVariantConfig } from '#shared/utils/mediaResolve'

interface Props {
  /** Persisted media row, or a plain src string (e.g. list DTO `image`). */
  media?: MediaItemDto | null
  src?: string | null
  entity: EntityKey
  collection: MediaCollection
  role?: typeof ImageRole[keyof typeof ImageRole]
  surface?: typeof ImageSurface[keyof typeof ImageSurface]
  alt?: string
  /** Extra classes on NuxtImg. */
  imgClass?: string
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  role: ImageRole.PREVIEW,
  surface: ImageSurface.CLIENT,
  loading: 'lazy',
})

const config = computed(() => getMediaConfig(props.entity, props.collection))

const variant = computed(() => {
  if (!config.value) {
    return { width: 640, height: 360, quality: 80, sizes: undefined as string | undefined }
  }
  return resolveVariantConfig(config.value, props.role, props.surface)
})

const resolvedSrc = computed(() => {
  if (props.src) {
    return props.src.startsWith('/api/media/file/')
      ? props.src.replace('/api/media/file/', '/images/')
      : props.src
  }
  if (props.media) {
    return resolveMediaSrc(props.media)
  }
  return null
})

const altText = computed(() =>
  props.alt
  || props.media?.alt
  || props.media?.name
  || '',
)
</script>

<template>
  <NuxtImg
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :alt="altText"
    :width="variant.width"
    :height="variant.height"
    :quality="variant.quality"
    :sizes="variant.sizes"
    densities="x1"
    fit="cover"
    :loading="loading"
    :class="imgClass"
  />
</template>
