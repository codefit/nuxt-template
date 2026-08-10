<script setup lang="ts">
const SEARCH_DEBOUNCE_MS = 300

const model = defineModel<string>({ default: '' })

defineProps<{
  placeholder?: string
}>()

const input = ref(model.value)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => model.value,
  (value) => {
    if (value !== input.value) {
      input.value = value
    }
  },
)

function commit(value: string) {
  if (model.value === value) {
    return
  }

  model.value = value
}

watch(input, (value) => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }

  // Clear immediately so empty search refreshes without delay.
  if (!value.trim()) {
    commit('')
    return
  }

  timer = setTimeout(() => {
    commit(value)
  }, SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

function clear() {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }

  input.value = ''
  commit('')
}
</script>

<template>
  <UInput
    v-model="input"
    type="search"
    name="dashboard-table-search"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    data-1p-ignore
    data-lpignore="true"
    data-form-type="other"
    :placeholder="placeholder ?? 'Hledat…'"
    icon="i-lucide-search"
    size="sm"
    class="w-72 max-w-full shrink-0"
    :ui="{
      base: 'h-9 rounded-xl py-0',
    }"
    aria-label="Hledat"
  >
    <template
      v-if="input"
      #trailing
    >
      <UButton
        color="neutral"
        variant="link"
        size="xs"
        icon="i-lucide-x"
        aria-label="Vymazat hledání"
        @click="clear"
      />
    </template>
  </UInput>
</template>
