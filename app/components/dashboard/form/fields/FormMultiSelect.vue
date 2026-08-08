<script setup lang="ts">
import { dashboardFieldProps, dashboardFieldUi } from '~/utils/dashboardForm'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  name: string
  label?: string
  error?: string
  valid?: boolean
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

defineProps<Props>()

const model = defineModel<(string | number)[]>({ default: () => [] })
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
    :valid="valid"
    :required="required"
  >
    <USelectMenu
      v-model="model"
      :items="options"
      multiple
      value-key="value"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="dashboardFieldProps"
      class="w-full"
      :ui="dashboardFieldUi"
    />
  </FormField>
</template>
