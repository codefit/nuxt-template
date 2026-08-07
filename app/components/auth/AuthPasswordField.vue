<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder: string
  autocomplete?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autocomplete: 'current-password',
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const show = ref(false)

const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next),
})
</script>

<template>
  <UInput
    v-model="value"
    :type="show ? 'text' : 'password'"
    :autocomplete="autocomplete"
    size="xl"
    variant="soft"
    :placeholder="placeholder"
    :required="required"
    class="w-full"
    :ui="{
      base: 'h-14 min-h-14 rounded-2xl bg-[#eef0f3] px-4 text-base ring-0 pe-14 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-300 dark:bg-neutral-800',
    }"
  >
    <template #trailing>
      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-xl bg-[#e2e5ea] text-neutral-500 transition hover:bg-[#d5d9df] dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
        :aria-label="t('auth.togglePassword')"
        @click="show = !show"
      >
        <UIcon
          :name="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          class="size-5"
        />
      </button>
    </template>
  </UInput>
</template>
