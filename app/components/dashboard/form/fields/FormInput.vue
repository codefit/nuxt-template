<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/form'

interface Props {
  label?: string
  name: string
  error?: string
  valid?: boolean
  required?: boolean
  type?: string
  placeholder?: string
  disabled?: boolean
  locale?: FormLocaleHint | null
}

withDefaults(defineProps<Props>(), {
  type: 'text',
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
    <UInput
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full"
      :ui="valid && !error ? { trailing: 'pe-8' } : undefined"
      @blur="emit('blur')"
    />
  </FormField>
</template>
