<script setup lang="ts">
interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  label?: string
  name: string
  error?: string
  valid?: boolean
  required?: boolean
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

defineProps<Props>()

const model = defineModel<string | number | undefined>()
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
    :valid="valid"
    :required="required"
  >
    <USelect
      v-model="model"
      :items="options"
      :placeholder="placeholder"
      :disabled="disabled"
      value-key="value"
      class="w-full"
    />
  </FormField>
</template>
