<script setup lang="ts">
import type { ConstantGroupKey, ConstantGroupSummary } from '#shared/types/dto/constant'
import { CONSTANT_GROUPS } from '#shared/types/dto/constant'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: t('dashboard.constants.seoTitle'),
  description: t('dashboard.constants.seoDescription'),
  noindex: true,
})

const icons: Record<ConstantGroupKey, string> = {
  company: 'i-lucide-building-2',
  analytics: 'i-lucide-chart-column',
  contact: 'i-lucide-contact',
  general: 'i-lucide-settings-2',
}

const { data: groups, status } = await useFetch<ConstantGroupSummary[]>(
  '/api/constants/groups',
  { key: 'dashboard-constant-groups' },
)

const cards = computed(() => {
  const byGroup = new Map((groups.value ?? []).map(item => [item.group, item.count]))
  return CONSTANT_GROUPS.map(group => ({
    group,
    count: byGroup.get(group) ?? 0,
    icon: icons[group],
    title: t(`dashboard.constants.groups.${group}`),
    lead: t(`dashboard.constants.groupLeads.${group}`),
  }))
})

function openGroup(group: ConstantGroupKey) {
  return navigateTo(localePath({
    name: 'dashboard-constants-group',
    params: { group },
  }))
}
</script>

<template>
  <div>
    <PageHeader
      :title="t('dashboard.constants.title')"
      :lead="t('dashboard.constants.lead')"
    />

    <section class="section">
      <div class="container">
        <div
          v-if="status === 'pending'"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <USkeleton
            v-for="n in 4"
            :key="n"
            class="h-36 w-full rounded-2xl"
          />
        </div>

        <div
          v-else
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <button
            v-for="card in cards"
            :key="card.group"
            type="button"
            class="flex flex-col gap-3 rounded-2xl border border-default bg-default p-5 text-start transition hover:border-brand-300 hover:bg-elevated/40"
            @click="openGroup(card.group)"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="flex size-10 items-center justify-center rounded-xl bg-elevated text-highlighted">
                <UIcon
                  :name="card.icon"
                  class="size-5"
                />
              </span>
              <UBadge
                :label="String(card.count)"
                color="neutral"
                variant="subtle"
              />
            </div>
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-highlighted">
                {{ card.title }}
              </h2>
              <p class="text-sm text-muted">
                {{ card.lead }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
