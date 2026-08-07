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
  entity?: EntityKey
  accept?: string
  disabled?: boolean
  error?: string
  /** Edit mode: show "Save order" after drag. */
  persistOrder?: boolean
  orderPending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/jpeg,image/png,image/webp',
  persistOrder: false,
  orderPending: false,
})

const emit = defineEmits<{
  'save-order': []
}>()

const model = defineModel<PendingMediaFile[]>({ default: () => [] })
const files = ref<File[] | null>(null)
const { t } = useI18n()

const dragId = ref<string | null>(null)
const orderDirty = ref(false)

const visible = computed(() => model.value.filter(item => !item.remove))

watch(files, (value) => {
  const list = value ?? []
  if (list.length === 0) {
    return
  }

  const base = visible.value.length
  const added = list.map((file, index) => pendingFromFile(file, props.collection, base + index))
  model.value = [...model.value, ...added]
  files.value = null
})

function remove(id: string) {
  const target = model.value.find(item => item.id === id)
  if (!target) {
    return
  }

  if (target.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(target.previewUrl)
  }

  if (target.mediaId) {
    model.value = model.value.map(item =>
      item.id === id
        ? { ...item, remove: true, previewUrl: undefined, file: undefined }
        : item,
    )
  }
  else {
    model.value = model.value.filter(item => item.id !== id)
  }

  reindex()
}

function reindex() {
  let rank = 0
  model.value = model.value.map((item) => {
    if (item.remove) {
      return item
    }
    const next = { ...item, rank }
    rank += 1
    return next
  })
}

function onDragStart(id: string) {
  dragId.value = id
}

function onDragOver(event: DragEvent, targetId: string) {
  event.preventDefault()
  if (!dragId.value || dragId.value === targetId) {
    return
  }

  const list = [...visible.value]
  const from = list.findIndex(item => item.id === dragId.value)
  const to = list.findIndex(item => item.id === targetId)
  if (from < 0 || to < 0) {
    return
  }

  const [moved] = list.splice(from, 1)
  if (!moved) {
    return
  }
  list.splice(to, 0, moved)

  const removed = model.value.filter(item => item.remove)
  model.value = [
    ...list.map((item, index) => ({ ...item, rank: index })),
    ...removed,
  ]
  orderDirty.value = true
}

function onDragEnd() {
  dragId.value = null
}

function saveOrder() {
  emit('save-order')
  orderDirty.value = false
}

watch(
  () => props.orderPending,
  (pending) => {
    if (!pending) {
      orderDirty.value = false
    }
  },
)
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
  >
    <div class="flex flex-col gap-3">
      <UFileUpload
        v-model="files"
        :accept="accept"
        :disabled="disabled"
        multiple
        :label="t('dashboard.form.mediaDrop')"
        :description="t('dashboard.form.galleryHint')"
        icon="i-lucide-images"
        class="w-full"
      />

      <ul
        v-if="visible.length"
        class="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        <li
          v-for="item in visible"
          :key="item.id"
          draggable="true"
          class="group relative aspect-square overflow-hidden rounded-lg border border-default bg-elevated"
          :class="{ 'opacity-60 ring-2 ring-primary': dragId === item.id }"
          @dragstart="onDragStart(item.id)"
          @dragover="onDragOver($event, item.id)"
          @dragend="onDragEnd"
        >
          <MediaImg
            v-if="entity && item.url && !item.previewUrl?.startsWith('blob:')"
            :src="item.url"
            :entity="entity"
            :collection="collection"
            :role="ImageRole.PREVIEW"
            :surface="ImageSurface.DASHBOARD"
            :alt="item.name"
            img-class="size-full object-cover"
          />
          <img
            v-else-if="item.previewUrl || item.url"
            :src="item.previewUrl || item.url || ''"
            :alt="item.name"
            class="size-full object-cover"
          >
          <div class="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-1.5">
            <UIcon
              name="i-lucide-grip-vertical"
              class="size-4 text-white/90"
            />
            <span class="text-[10px] font-medium text-white/90">
              #{{ item.rank + 1 }}
            </span>
          </div>
          <div class="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/50 to-transparent p-1.5">
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="solid"
              size="xs"
              :aria-label="t('dashboard.form.mediaRemove')"
              @click="remove(item.id)"
            />
          </div>
        </li>
      </ul>

      <div
        v-if="persistOrder && orderDirty && visible.some(i => i.mediaId)"
        class="flex justify-end"
      >
        <UButton
          :label="t('dashboard.form.saveOrder')"
          icon="i-lucide-arrow-up-down"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="orderPending"
          @click="saveOrder"
        />
      </div>
    </div>
  </FormField>
</template>
