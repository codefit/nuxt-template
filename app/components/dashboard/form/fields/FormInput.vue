<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/ui/form'

interface Props {
  name: string
  type?: string
  label?: string
  error?: string
  valid?: boolean
  locale?: FormLocaleHint | null
  required?: boolean
  disabled?: boolean
  placeholder?: string
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
