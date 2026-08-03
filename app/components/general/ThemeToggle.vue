<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  },
})

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="theme-toggle"
      :aria-label="isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'"
      :title="isDark ? 'Světlý režim' : 'Tmavý režim'"
      @click="toggle"
    >
      <svg
        v-if="isDark"
        class="theme-toggle__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="4"
        />
        <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
      </svg>
      <svg
        v-else
        class="theme-toggle__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path d="M20.5 14.2A8.2 8.2 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
      </svg>
    </button>
    <template #fallback>
      <span
        class="theme-toggle theme-toggle--ghost"
        aria-hidden="true"
      />
    </template>
  </ClientOnly>
</template>
