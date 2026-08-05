<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/form'

interface Props {
  label?: string
  name: string
  error?: string
  valid?: boolean
  required?: boolean
  placeholder?: string
  rows?: number
  disabled?: boolean
  locale?: FormLocaleHint | null
}

withDefaults(defineProps<Props>(), {
  rows: 3,
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  blur: []
}>()
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
    <UTextarea
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="w-full"
      autoresize
      @blur="emit('blur')"
    />
  </FormField>
</template>
