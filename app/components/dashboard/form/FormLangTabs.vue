<script setup lang="ts">
import type { LanguageOption } from '#shared/types/language'

interface Props {
  languages: LanguageOption[]
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [code: string]
}>()
</script>

<template>
  <nav
    class="flex items-center gap-1"
    :aria-label="$t('locale.label')"
  >
    <button
      v-for="lang in languages"
      :key="lang.code"
      type="button"
      class="inline-flex items-center justify-center rounded-md p-1 opacity-55 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="{ 'bg-elevated opacity-100': modelValue === lang.code }"
      :title="lang.name"
      :aria-label="lang.name"
      :aria-pressed="modelValue === lang.code"
      @click="emit('update:modelValue', lang.code)"
    >
      <FormLocaleFlag
        :code="lang.code"
        :name="lang.name"
        :icon="lang.icon"
      />
    </button>
  </nav>
</template>
