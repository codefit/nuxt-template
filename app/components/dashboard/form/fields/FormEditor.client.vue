<script setup lang="ts">
/**
 * HugeRTE HTML editor — client-only (`.client.vue`).
 */
import '~/utils/hugerte.client'
import Editor from '@hugerte/hugerte-vue'
import type { FormLocaleHint } from '#shared/types/form'

interface Props {
  label?: string
  name: string
  error?: string
  valid?: boolean
  required?: boolean
  disabled?: boolean
  height?: number
  locale?: FormLocaleHint | null
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  blur: []
}>()

const init = {
  height: props.height,
  menubar: false,
  branding: false,
  promotion: false,
  plugins: 'lists link code',
  toolbar: 'undo redo | styles | bold italic underline | bullist numlist | link | code',
  // Bundled skins (see utils/hugerte.client.ts)
  skin_url: 'default',
  content_css: 'default',
  content_style: 'body { font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; }',
}
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
    :valid="valid"
    :required="required"
    :locale="locale"
  >
    <div
      class="overflow-hidden rounded-md border border-default [&_.tox-tinymce]:!border-0"
      :class="disabled ? 'pointer-events-none opacity-60' : ''"
    >
      <Editor
        v-model="model"
        :disabled="disabled"
        :init="init"
        @onBlur="emit('blur')"
      />
    </div>
  </FormField>
</template>
