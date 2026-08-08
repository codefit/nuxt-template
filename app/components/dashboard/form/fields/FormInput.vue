<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/ui/form'
import { dashboardFieldProps, dashboardFieldUi } from '~/utils/dashboardForm'

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

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  blur: []
}>()

const fieldUi = computed(() => ({
  ...dashboardFieldUi,
  ...(props.valid && !props.error ? { trailing: 'pe-8' } : {}),
}))
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
      v-bind="dashboardFieldProps"
      class="w-full"
      :ui="fieldUi"
      @blur="emit('blur')"
    />
  </FormField>
</template>
