<script setup lang="ts">
interface Props {
  name?: string
  label?: string
  disabled?: boolean
  description?: string
}

defineProps<Props>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <UCheckbox
    v-model="model"
    :label="label"
    :name="name"
    :disabled="disabled"
    :description="description"
  />
</template>
