<script setup lang="ts">
import { dashboardFieldProps, dashboardFieldUi } from '~/utils/dashboardForm'

interface SelectOption {
  label: string
  value: string
}

interface Props {
  name: string
  label?: string
  error?: string
  valid?: boolean
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  createLabel?: string
  placeholder?: string
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
    <div class="flex items-center gap-2">
      <UInputMenu
        v-model="model"
        :items="options"
        value-key="value"
        :placeholder="placeholder"
        :disabled="disabled"
        v-bind="dashboardFieldProps"
        clear
        class="min-w-0 flex-1"
        :ui="dashboardFieldUi"
      />
      <UButton
        v-if="createLabel"
        icon="i-lucide-plus"
        color="neutral"
        variant="soft"
        square
        :aria-label="createLabel"
        :title="createLabel"
        class="size-11 shrink-0 rounded-xl"
        :ui="{
          base: 'p-0 inline-flex items-center justify-center',
          leadingIcon: 'size-5',
        }"
        @click="emit('create')"
      />
    </div>
  </FormField>
</template>
