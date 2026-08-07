<script setup lang="ts">
import type { Component } from 'vue'
import type { FormMode, FormResult } from '#shared/types/ui/form'
import { resolveForm } from '~/composables/form/formRegistry'

interface Props {
  type: string
  mode: FormMode
  id?: number | string
  ui?: { content?: string }
  depth?: number
  title?: string
  initial?: unknown
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  depth: 0,
})

const emit = defineEmits<{
  close: [value?: FormResult]
}>()

const { t } = useI18n()
const formComponent = shallowRef<Component | null>(null)
const loadError = ref('')
const closed = ref(false)

const heading = computed(() => {
  if (props.title) {
    return props.title
  }
  if (props.mode === 'edit') {
    return t('dashboard.form.editTitle')
  }
  if (props.mode === 'copy') {
    return t('dashboard.form.copyTitle')
  }
  return t('dashboard.form.createTitle')
})

/**
 * Nuxt UI Slideover defaults `side:right` → `max-w-md` (~28rem).
 * Must clear that or width overrides never win.
 * `inset` adds floating edge offset; tablet = full, lg+ = half viewport.
 */
const contentClass = computed(() =>
  props.ui?.content
  ?? [
    'max-w-none',
    'w-[calc(100%-2rem)]',
    'lg:w-[calc(50%-1rem)]',
    'rounded-2xl shadow-xl overflow-hidden',
  ].join(' '),
)

onMounted(async () => {
  try {
    formComponent.value = await resolveForm(props.type)
  }
  catch (error) {
    loadError.value = error instanceof Error ? error.message : String(error)
  }
})

function finish(result: FormResult) {
  if (closed.value) {
    return
  }
  closed.value = true
  emit('close', result)
}

function dismiss() {
  finish({ ok: false, mode: props.mode, cancelled: true })
}

function onSubmit(payload: unknown) {
  finish({
    ok: true,
    mode: props.mode,
    data: payload,
  })
}
</script>

<template>
  <USlideover
    inset
    :title="heading"
    :description="description || undefined"
    :overlay="depth === 0"
    :ui="{
      content: contentClass,
      header: 'shrink-0 border-b border-default',
      // Default padding for forms without side tabs (languages, authors, …).
      // Tabbed forms cancel this via FormTabShell negative margins.
      body: 'flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6',
    }"
    @close="dismiss"
  >
    <template #body>
      <UAlert
        v-if="loadError"
        class="m-4"
        color="error"
        variant="subtle"
        :title="loadError"
      />

      <div
        v-else-if="!formComponent"
        class="flex flex-1 justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-muted"
        />
      </div>

      <component
        :is="formComponent"
        v-else
        class="flex min-h-0 flex-1 flex-col"
        :mode="mode"
        :id="id"
        :initial="initial"
        @submit="onSubmit"
        @cancel="dismiss"
      />
    </template>
  </USlideover>
</template>
