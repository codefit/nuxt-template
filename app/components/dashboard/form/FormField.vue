<script setup lang="ts">
import type { FormLocaleHint } from '#shared/types/form'

interface Props {
  label?: string
  name: string
  error?: string
  valid?: boolean
  required?: boolean
  hint?: string
  /** Active translation locale — shown next to the field label. */
  locale?: FormLocaleHint | null
}

defineProps<Props>()
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
    :error="error"
    :hint="hint"
    :required="required"
  >
    <template
      v-if="label"
      #label="{ label: text }"
    >
      <span class="inline-flex items-center gap-1.5">
        <FormLocaleFlag
          v-if="locale"
          size="sm"
          :code="locale.code"
          :name="locale.name"
          :icon="locale.icon"
        />
        <span>{{ text }}</span>
      </span>
    </template>

    <div class="relative">
      <slot />
      <UIcon
        v-if="valid && !error"
        name="i-lucide-check"
        class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-success"
      />
    </div>
  </UFormField>
</template>
