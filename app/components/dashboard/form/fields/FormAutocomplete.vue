<script setup lang="ts">
interface SelectOption {
  label: string
  value: string
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
  /** Opens nested create slideover when set. */
  createLabel?: string
}

defineProps<Props>()

const model = defineModel<string | null | undefined>()

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :error="error"
    :valid="valid"
    :required="required"
  >
    <div class="flex items-start gap-2">
      <UInputMenu
        v-model="model"
        :items="options"
        value-key="value"
        :placeholder="placeholder"
        :disabled="disabled"
        clear
        class="min-w-0 flex-1"
      />
      <UButton
        v-if="createLabel"
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        :aria-label="createLabel"
        :title="createLabel"
        class="shrink-0"
        @click="emit('create')"
      />
    </div>
  </FormField>
</template>
