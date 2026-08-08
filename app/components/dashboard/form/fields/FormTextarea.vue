<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/ui/form'
import { dashboardFieldProps, dashboardTextareaUi } from '~/utils/dashboardForm'

interface Props {
  name: string
  rows?: number
  label?: string
  error?: string
  valid?: boolean
  locale?: FormLocaleHint | null
  required?: boolean
  disabled?: boolean
  placeholder?: string
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
      v-bind="dashboardFieldProps"
      class="w-full"
      :ui="dashboardTextareaUi"
      autoresize
      @blur="emit('blur')"
    />
  </FormField>
</template>
