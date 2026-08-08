<script setup lang="ts">
import type {
  ConstantGroupKey,
  ConstantListItem,
} from '#shared/types/dto/constant'
import { isConstantGroup } from '#shared/types/dto/constant'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const confirm = useConfirmDialog()
const { open: openForm } = useFormSlideover()

const groupParam = computed(() => String(route.params.group || ''))

if (!isConstantGroup(groupParam.value)) {
  throw createError({
    statusCode: 404,
    message: t('dashboard.constants.groupNotFound'),
  })
}

const group = computed(() => groupParam.value as ConstantGroupKey)

usePageSeo(() => ({
  title: `${t(`dashboard.constants.groups.${group.value}`)} — ${t('dashboard.constants.seoTitle')}`,
  description: t('dashboard.constants.seoDescription'),
  noindex: true,
}))

const search = ref('')
const formBusy = ref(false)
const deletingId = ref<number | null>(null)

const { data: items, status, refresh } = await useFetch<ConstantListItem[]>(
  '/api/constants',
  {
    query: computed(() => ({ group: group.value })),
    watch: [group],
  },
)

const filtered = computed(() => {
  const rows = items.value ?? []
  const term = search.value.trim().toLowerCase()
  if (!term) {
    return rows
  }

  return rows.filter(item =>
    item.key.toLowerCase().includes(term)
    || item.label.toLowerCase().includes(term)
    || item.value.toLowerCase().includes(term)
    || (item.description?.toLowerCase().includes(term) ?? false),
  )
})

async function openCreate() {
  if (formBusy.value) {
    return
  }

  formBusy.value = true
  try {
    const result = await openForm({
      type: 'constant',
      mode: 'create',
      title: t('dashboard.constants.createTitle'),
      initial: { group: group.value },
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

async function openEdit(id: number) {
  if (formBusy.value) {
    return
  }

  formBusy.value = true
  try {
    const result = await openForm({
      type: 'constant',
      mode: 'edit',
      id,
      title: t('dashboard.constants.editTitle'),
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

async function removeItem(item: ConstantListItem) {
  if (deletingId.value != null) {
    return
  }

  const ok = await confirm({
    title: t('dashboard.constants.actionDeleteTitle'),
    description: t('dashboard.constants.actionDeleteDesc', { key: item.key }),
    confirmLabel: t('dashboard.constants.actionDelete'),
    confirmColor: 'error',
  })

  if (!ok) {
    return
  }

  deletingId.value = item.id
  try {
    await $fetch(`/api/constants/${item.id}`, { method: 'DELETE' })
    toast.add({ title: t('dashboard.constants.toastDeleted'), color: 'success' })
    await refresh()
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    toast.add({
      title: err?.data?.message || err?.message || t('dashboard.form.saveFailed'),
      color: 'error',
    })
  }
  finally {
    deletingId.value = null
  }
}

function typeLabel(type: string) {
  if (type === 'text') {
    return t('dashboard.constants.typeText')
  }
  return type
}
</script>

<template>
  <div>
    <PageHeader
      :title="t(`dashboard.constants.groups.${group}`)"
      :lead="t(`dashboard.constants.groupLeads.${group}`)"
    />

    <section class="section">
      <div class="container space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-4">
            <UButton
              :label="t('dashboard.constants.back')"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              :to="localePath('dashboard-constants')"
            />

            <div class="flex items-center gap-4 text-sm text-muted">
              <span class="inline-flex items-center gap-2">
                <span
                  class="size-2.5 shrink-0 rounded-full bg-success"
                  aria-hidden="true"
                />
                {{ t('dashboard.constants.legendPublic') }}
              </span>
              <span class="inline-flex items-center gap-2">
                <span
                  class="size-2.5 shrink-0 rounded-full bg-error"
                  aria-hidden="true"
                />
                {{ t('dashboard.constants.legendPrivate') }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UInput
              v-model="search"
              type="search"
              name="dashboard-constants-search"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              icon="i-lucide-search"
              :placeholder="t('dashboard.constants.searchHint')"
              class="w-64"
            />
            <UButton
              :label="t('dashboard.constants.addRecord')"
              icon="i-lucide-plus"
              color="primary"
              :loading="formBusy"
              :disabled="formBusy"
              @click="openCreate"
            />
          </div>
        </div>

        <div
          v-if="status === 'pending' && !items"
          class="space-y-2"
        >
          <USkeleton
            v-for="n in 4"
            :key="n"
            class="h-20 w-full rounded-xl"
          />
        </div>

        <div
          v-else-if="!filtered.length"
          class="rounded-2xl border border-dashed border-default px-6 py-12 text-center text-muted"
        >
          {{ t('dashboard.constants.empty') }}
        </div>

        <ul
          v-else
          class="divide-y divide-default overflow-hidden rounded-2xl border border-default"
        >
          <li
            v-for="item in filtered"
            :key="item.id"
            class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
            :class="item.isPrivate ? 'bg-error/5' : 'bg-success/5'"
          >
            <div class="min-w-0 flex-1 space-y-1">
              <p
                class="font-semibold"
                :class="item.isPrivate ? 'text-error' : 'text-success'"
              >
                {{ item.label }}
              </p>
              <p
                v-if="item.description"
                class="text-sm text-muted"
              >
                {{ item.description }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:shrink-0">
              <UBadge
                :label="item.key"
                color="neutral"
                variant="subtle"
                class="font-mono text-xs"
              />
              <UBadge
                :label="typeLabel(item.type)"
                color="info"
                variant="subtle"
              />
            </div>

            <p class="max-w-xs truncate text-sm text-default sm:w-48 sm:shrink-0">
              {{ item.value || '—' }}
            </p>

            <UBadge
              :label="item.isActive
                ? t('dashboard.constants.activeYes')
                : t('dashboard.constants.activeNo')"
              :color="item.isActive ? 'success' : 'neutral'"
              variant="subtle"
              class="w-fit sm:shrink-0"
            />

            <div class="flex items-center gap-1 sm:shrink-0">
              <UButton
                icon="i-lucide-pencil"
                color="info"
                variant="subtle"
                size="sm"
                :aria-label="t('dashboard.constants.actionEdit')"
                :disabled="formBusy"
                @click="openEdit(item.id)"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="subtle"
                size="sm"
                :aria-label="t('dashboard.constants.actionDelete')"
                :loading="deletingId === item.id"
                :disabled="deletingId != null"
                @click="removeItem(item)"
              />
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
