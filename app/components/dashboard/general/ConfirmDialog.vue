<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
  confirmColor?: 'error' | 'primary' | 'neutral' | 'success' | 'warning' | 'info' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  title: 'Potvrdit',
  confirmLabel: 'Potvrdit',
  cancelLabel: 'Zrušit',
  confirmColor: 'primary',
})

const emit = defineEmits<{
  close: [value: boolean]
}>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :close="false"
    :ui="{
      content: 'sm:max-w-sm',
      header: 'min-h-0',
      footer: 'justify-end gap-2',
    }"
  >
    <template #footer>
      <UButton
        :label="cancelLabel"
        color="neutral"
        variant="outline"
        @click="emit('close', false)"
      />
      <UButton
        :label="confirmLabel"
        :color="confirmColor"
        @click="emit('close', true)"
      />
    </template>
  </UModal>
</template>
