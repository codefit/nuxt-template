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
      class="w-full"
    />
  </FormField>
</template>
