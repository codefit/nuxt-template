<script setup lang="ts">
import type { PendingMedia } from '#shared/types/ui/form'

interface Props {
  name: string
  field?: string
  label?: string
  error?: string
  accept?: string
  disabled?: boolean
  multiple?: boolean
  /** Square drop zone (e.g. cover) — uses grid layout overlay. */
  square?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  field: 'media',
  accept: 'image/*',
  multiple: true,
  square: false,
})

const model = defineModel<PendingMedia[]>({ default: () => [] })
const files = ref<File[] | null | File>(null)

const { t } = useI18n()

const isMultiple = computed(() => (props.square ? false : props.multiple))

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function toList(value: File[] | File | null | undefined): File[] {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

watch(files, (value) => {
  const list = toList(value)
  model.value = list.map(file => ({
    id: uid(),
    field: props.field,
    name: file.name,
    mime: file.type,
    size: file.size,
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }))
})

function remove(id: string) {
  const item = model.value.find(entry => entry.id === id)
  if (item?.previewUrl) {
    URL.revokeObjectURL(item.previewUrl)
  }
  model.value = model.value.filter(entry => entry.id !== id)

  const list = toList(files.value).filter(file =>
    model.value.some(entry => entry.name === file.name && entry.size === file.size),
  )
  files.value = isMultiple.value ? list : (list[0] ?? null)
}
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
        :multiple="isMultiple"
        :disabled="disabled"
        :label="t('dashboard.form.mediaDrop')"
        :description="square ? undefined : t('dashboard.form.mediaHint')"
        icon="i-lucide-image-plus"
        :layout="square ? 'grid' : 'list'"
        :class="square ? 'aspect-square w-full max-w-56' : 'w-full'"
        :ui="square
          ? {
              base: 'aspect-square size-full min-h-0',
              wrapper: 'text-center',
              label: 'text-xs',
              description: 'hidden',
            }
          : undefined"
      />

      <ul
        v-if="!square && model.length"
        class="flex flex-col gap-2"
      >
        <li
          v-for="item in model"
          :key="item.id"
          class="flex items-center gap-3 rounded-md border border-default p-2"
        >
          <img
            v-if="item.previewUrl"
            :src="item.previewUrl"
            :alt="item.name"
            class="size-10 rounded object-cover"
          >
          <UIcon
            v-else
            name="i-lucide-file"
            class="size-10 text-muted"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">
              {{ item.name }}
            </p>
            <p class="text-xs text-muted">
              {{ Math.round(item.size / 1024) }} KB · {{ item.mime || '—' }}
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t('dashboard.form.mediaRemove')"
            @click="remove(item.id)"
          />
        </li>
      </ul>
    </div>
  </FormField>
</template>
