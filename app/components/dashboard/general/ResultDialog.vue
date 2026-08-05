<script setup lang="ts">
import type {
  ResultItem,
  ResultLink,
  ResultStat,
} from '#shared/types/ui/data-table'

interface Props {
  title?: string
  items?: ResultItem[]
  links?: ResultLink[]
  stats?: ResultStat[]
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Výsledek',
  stats: () => [],
  links: () => [],
  items: () => [],
})

const emit = defineEmits<{
  close: [value: boolean]
}>()

function close() {
  emit('close', true)
}
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full cursor-pointer',
      onClick: close,
    }"
    :ui="{
      content: 'sm:max-w-lg',
      header: 'min-h-0',
      body: 'space-y-5',
      footer: 'justify-end',
    }"
  >
    <template #body>
      <div
        v-if="stats.length"
        class="grid grid-cols-2 gap-3"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-lg border border-default bg-elevated/40 p-3"
        >
          <div class="flex items-center gap-2 text-muted">
            <UIcon
              v-if="stat.icon"
              :name="stat.icon"
              class="size-4"
            />
            <span class="text-xs font-medium uppercase tracking-wide">
              {{ stat.label }}
            </span>
          </div>
          <p
            class="mt-1 text-xl font-semibold text-highlighted"
            :class="{
              'text-success': stat.color === 'success',
              'text-error': stat.color === 'error',
              'text-warning': stat.color === 'warning',
              'text-info': stat.color === 'info',
              'text-primary': stat.color === 'primary',
            }"
          >
            {{ stat.value }}
          </p>
          <p
            v-if="stat.description"
            class="mt-0.5 text-xs text-muted"
          >
            {{ stat.description }}
          </p>
        </div>
      </div>

      <div
        v-if="links.length"
        class="flex flex-wrap gap-2"
      >
        <UButton
          v-for="link in links"
          :key="link.href + link.label"
          :label="link.label"
          :icon="link.icon"
          :to="link.href"
          :target="link.external ? '_blank' : undefined"
          color="neutral"
          variant="subtle"
          size="sm"
        />
      </div>

      <ul
        v-if="items.length"
        class="divide-y divide-default overflow-hidden rounded-lg border border-default"
      >
        <li
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          class="flex items-start justify-between gap-3 px-3 py-2.5"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-highlighted">
              {{ item.title }}
            </p>
            <p
              v-if="item.description"
              class="truncate text-xs text-muted"
            >
              {{ item.description }}
            </p>
          </div>
          <UBadge
            v-if="item.badge"
            :label="item.badge"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </li>
      </ul>
    </template>

    <template #footer>
      <UButton
        label="Zavřít"
        color="neutral"
        variant="outline"
        @click="close"
      />
    </template>
  </UModal>
</template>
