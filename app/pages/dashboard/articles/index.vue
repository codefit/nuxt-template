<script setup lang="ts">
import type { ArticleListItem } from '#shared/types/article'
import type {
  BulkAction,
  TableFilter,
  TableSearchConfig,
} from '#shared/types/data-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { createSortHeader } from '~/utils/sortHeader'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: t('dashboard.articles.seoTitle'),
  description: t('dashboard.articles.seoDescription'),
})

// --- Table config -----------------------------------------------------------

const searchConfig: TableSearchConfig = {
  columns: ['title', 'slug'],
  placeholder: t('dashboard.articles.searchHint'),
}

const filters: TableFilter[] = [
  {
    key: 'createdAt',
    label: t('dashboard.articles.filterCreated'),
    type: 'date-range',
    icon: 'i-lucide-calendar-range',
  },
  {
    key: 'isPublished',
    label: t('dashboard.articles.filterPublished'),
    type: 'select',
    icon: 'i-lucide-globe',
    options: [
      { label: t('dashboard.articles.publishedYes'), value: '1' },
      { label: t('dashboard.articles.publishedNo'), value: '0' },
    ],
  },
]

const columns: TableColumn<ArticleListItem>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'title',
    header: createSortHeader<ArticleListItem>(t('dashboard.articles.colTitle')),
  },
  {
    accessorKey: 'author',
    header: t('dashboard.articles.colAuthor'),
    cell: ({ row }) => {
      const author = row.getValue('author') as string | undefined
      return author || '—'
    },
  },
  {
    accessorKey: 'slug',
    header: createSortHeader<ArticleListItem>(t('dashboard.articles.colSlug')),
    meta: {
      class: {
        td: 'lowercase text-muted',
      },
    },
  },
  {
    accessorKey: 'isPublished',
    header: createSortHeader<ArticleListItem>(t('dashboard.articles.colPublished')),
    cell: ({ row }) => {
      const published = row.getValue('isPublished') as boolean
      return published
        ? t('dashboard.articles.publishedYes')
        : t('dashboard.articles.publishedNo')
    },
  },
  {
    accessorKey: 'publishedAt',
    header: createSortHeader<ArticleListItem>(t('dashboard.articles.colPublishedAt')),
    cell: ({ row }) => {
      const value = row.getValue('publishedAt')
      return value
        ? new Date(value as string).toLocaleString()
        : '—'
    },
  },
  {
    accessorKey: 'createdAt',
    header: createSortHeader<ArticleListItem>(t('dashboard.articles.colCreated')),
    cell: ({ row }) => {
      const value = row.getValue('createdAt')
      return value
        ? new Date(value as string).toLocaleString()
        : ''
    },
  },
]

const bulkActions: BulkAction[] = [
  {
    label: t('dashboard.articles.bulkExport'),
    value: 'export',
    icon: 'i-lucide-download',
    toast: 'info',
    result: true,
  },
  {
    label: t('dashboard.articles.bulkPublish'),
    value: 'publish',
    icon: 'i-lucide-globe',
    toast: 'success',
    result: true,
  },
  {
    label: t('dashboard.articles.bulkUnpublish'),
    value: 'unpublish',
    icon: 'i-lucide-eye-off',
    toast: 'success',
    result: true,
  },
  {
    label: t('dashboard.articles.bulkArchive'),
    value: 'archive',
    icon: 'i-lucide-archive',
    confirm: true,
    confirmTitle: t('dashboard.articles.bulkArchiveTitle'),
    confirmDescription: t('dashboard.articles.bulkArchiveDesc'),
    confirmLabel: t('dashboard.articles.bulkArchive'),
    confirmColor: 'warning',
    toast: 'success',
    result: true,
  },
  {
    label: t('dashboard.articles.bulkDelete'),
    value: 'delete',
    icon: 'i-lucide-trash',
    confirm: true,
    confirmTitle: t('dashboard.articles.bulkDeleteTitle'),
    confirmDescription: t('dashboard.articles.bulkDeleteDesc'),
    confirmLabel: t('dashboard.articles.bulkDelete'),
    confirmColor: 'error',
    toast: 'success',
    result: true,
  },
]

// --- State / fetch ----------------------------------------------------------

const {
  pagination,
  sorting,
  search,
  filters: filterValues,
  pageSizes,
  data,
  total,
  status,
  refresh,
  getRowId,
  runBulk,
} = await useDashboardList<ArticleListItem>({
  endpoint: '/api/articles',
  filterKeys: ['createdAt', 'isPublished'],
  dateRangeKeys: ['createdAt'],
  with: ['author'],
  locale: true,
})

const { open: openForm } = useFormSlideover()
const formBusy = ref(false)

// --- Handlers ---------------------------------------------------------------

async function openCreate() {
  if (formBusy.value) {
    return
  }

  formBusy.value = true
  try {
    const result = await openForm({
      type: 'article',
      mode: 'create',
      title: t('dashboard.articles.addRecord'),
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
      type: 'article',
      mode: 'edit',
      id,
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

async function openCopy(id: number) {
  if (formBusy.value) {
    return
  }

  formBusy.value = true
  try {
    const result = await openForm({
      type: 'article',
      mode: 'copy',
      id,
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

function rowActions(row: TableRow<ArticleListItem>) {
  return [
    { type: 'label' as const, label: t('dashboard.articles.actions') },
    {
      label: t('dashboard.articles.actionView'),
      icon: 'i-lucide-pencil',
      onSelect() {
        openEdit(row.original.id)
      },
    },
    {
      label: t('dashboard.articles.actionCopy'),
      icon: 'i-lucide-copy',
      onSelect() {
        openCopy(row.original.id)
      },
    },
    {
      label: t('dashboard.articles.actionCopyId'),
      onSelect() {
        navigator.clipboard?.writeText(String(row.original.id))
      },
    },
    {
      label: row.getIsExpanded()
        ? t('dashboard.articles.actionCollapse')
        : t('dashboard.articles.actionExpand'),
      onSelect() {
        row.toggleExpanded()
      },
    },
    { type: 'separator' as const },
    {
      label: t('dashboard.articles.actionDelete'),
      onSelect() {
        console.log('action:delete', row.original.id)
      },
    },
  ]
}
</script>

<template>
  <div>
    <PageHeader
      :title="t('dashboard.articles.title')"
      :lead="t('dashboard.articles.lead')"
    />

    <section class="section">
      <div class="container">
        <DataTable
          v-model:pagination="pagination"
          v-model:sorting="sorting"
          v-model:search="search"
          v-model:filter-values="filterValues"
          :data="data"
          :total="total"
          :columns="columns"
          :loading="status === 'pending'"
          :get-row-id="getRowId"
          :page-sizes="pageSizes"
          :search-config="searchConfig"
          :filters="filters"
          :bulk-actions="bulkActions"
          :row-actions="rowActions"
          :run-bulk="runBulk"
        >
          <template #toolbar>
            <UButton
              :label="t('dashboard.articles.addRecord')"
              icon="i-lucide-plus"
              color="primary"
              :loading="formBusy"
              :disabled="formBusy"
              @click="openCreate"
            />
          </template>
          <template #title-cell="{ row }">
            <NuxtLink
              v-if="row.original.title"
              :to="localePath({
                name: 'articles-slug',
                params: { slug: row.original.slug },
              })"
              class="text-highlighted underline hover:text-primary duration-200"
              target="_blank"
            >
              {{ row.original.title }}
            </NuxtLink>
            <template v-else>
              —
            </template>
          </template>
          <template #expanded="{ row }">
            <pre class="overflow-x-auto p-4 text-xs">{{ row.original }}</pre>
          </template>
        </DataTable>
      </div>
    </section>
  </div>
</template>
