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
    :title="heading"
    :description="description || undefined"
    :overlay="depth === 0"
    :ui="{
      content: ui?.content ?? 'w-full max-w-none lg:w-1/2',
      body: 'flex flex-col gap-4',
    }"
    @close="dismiss"
  >
    <template #body>
      <UAlert
        v-if="loadError"
        color="error"
        variant="subtle"
        :title="loadError"
      />

      <div
        v-else-if="!formComponent"
        class="flex justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-muted"
        />
      </div>

      <component
        :is="formComponent"
        v-else
        :mode="mode"
        :id="id"
        :initial="initial"
        @submit="onSubmit"
        @cancel="dismiss"
      />
    </template>
  </USlideover>
</template>
