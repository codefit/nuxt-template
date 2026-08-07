<script setup lang="ts">
import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import type { PendingMediaFile } from '#shared/types/media/dto'
import { ImageRole } from '#shared/types/media/imageRole'
import { ImageSurface } from '#shared/types/media/imageSurface'
import { pendingFromFile } from '~/composables/form/useMediaUpload'

interface Props {
  label?: string
  name: string
  collection: MediaCollection
  /** When set, saved previews go through MediaImg / Nuxt Image. */
  entity?: EntityKey
  accept?: string
  disabled?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/jpeg,image/png,image/webp',
})

/** Current slot value. When replacing an existing row, `replaceId` holds the old media id. */
const model = defineModel<PendingMediaFile | null>({ default: null })
const replaceId = defineModel<number | null>('replaceId', { default: null })

const files = ref<File | null>(null)
const { t } = useI18n()

const preview = computed(() => {
  if (!model.value || model.value.remove) {
    return null
  }
  return model.value.previewUrl || model.value.url || null
})

const isLocalBlob = computed(() => Boolean(preview.value?.startsWith('blob:')))

watch(files, (value) => {
  if (!value) {
    return
  }

  if (model.value?.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(model.value.previewUrl)
  }

  if (model.value?.mediaId) {
    replaceId.value = model.value.mediaId
  }

  model.value = pendingFromFile(value, props.collection, 0)
})

function clear() {
  if (model.value?.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(model.value.previewUrl)
  }

  if (model.value?.mediaId) {
    replaceId.value = model.value.mediaId
    model.value = null
  }
  else if (replaceId.value) {
    model.value = null
  }
  else {
    model.value = null
  }
  files.value = null
}
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
  >
    <div class="relative w-full max-w-none sm:max-w-56">
      <UFileUpload
        v-model="files"
        :accept="accept"
        :disabled="disabled"
        :multiple="false"
        :label="t('dashboard.form.mediaDrop')"
        :description="hint"
        icon="i-lucide-image-plus"
        layout="grid"
        class="aspect-square w-full"
        :ui="{
          base: 'aspect-square size-full min-h-0',
          wrapper: 'text-center',
          label: 'text-xs',
          description: hint ? 'text-xs' : 'hidden',
        }"
      />

      <div
        v-if="preview"
        class="absolute inset-0 overflow-hidden rounded-lg border border-default"
      >
        <MediaImg
          v-if="entity && !isLocalBlob"
          :src="preview"
          :entity="entity"
          :collection="collection"
          :role="ImageRole.EDIT"
          :surface="ImageSurface.DASHBOARD"
          :alt="model?.name || label || ''"
          img-class="size-full object-cover"
        />
        <img
          v-else
          :src="preview"
          :alt="model?.name || label || ''"
          class="size-full object-cover"
        >
        <div class="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/50 to-transparent p-2">
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="solid"
            size="xs"
            :aria-label="t('dashboard.form.mediaRemove')"
            @click.stop="clear"
          />
        </div>
      </div>
    </div>
  </FormField>
</template>
