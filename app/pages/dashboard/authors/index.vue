<script setup lang="ts">
import type { AuthorListItem } from '#shared/types/dto/author'
import type {
  BulkAction,
  TableFilter,
  TableSearchConfig,
} from '#shared/types/ui/data-table'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { createSortHeader } from '~/utils/sortHeader'

definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()

usePageSeo({
  title: t('dashboard.authors.seoTitle'),
  description: t('dashboard.authors.seoDescription'),
  noindex: true,
})

// --- Table config -----------------------------------------------------------

const searchConfig: TableSearchConfig = {
  columns: ['name', 'email', 'phone'],
  placeholder: t('dashboard.authors.searchHint'),
}

const filters: TableFilter[] = [
  {
    key: 'createdAt',
    label: t('dashboard.authors.filterCreated'),
    type: 'date-range',
    icon: 'i-lucide-calendar-range',
  },
]

const columns: TableColumn<AuthorListItem>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'name',
    header: createSortHeader<AuthorListItem>(t('dashboard.authors.colName')),
  },
  {
    accessorKey: 'email',
    header: createSortHeader<AuthorListItem>(t('dashboard.authors.colEmail')),
    cell: ({ row }) => {
      const value = row.getValue('email') as string | null
      return value || '—'
    },
    meta: {
      class: {
        td: 'lowercase',
      },
    },
  },
  {
    accessorKey: 'phone',
    header: createSortHeader<AuthorListItem>(t('dashboard.authors.colPhone')),
    cell: ({ row }) => {
      const value = row.getValue('phone') as string | null
      return value || '—'
    },
  },
  {
    accessorKey: 'createdAt',
    header: createSortHeader<AuthorListItem>(t('dashboard.authors.colCreated')),
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
    label: t('dashboard.authors.bulkExport'),
    value: 'export',
    icon: 'i-lucide-download',
    toast: 'info',
    result: true,
  },
  {
    label: t('dashboard.authors.bulkDelete'),
    value: 'delete',
    icon: 'i-lucide-trash',
    confirm: true,
    confirmTitle: t('dashboard.authors.bulkDeleteTitle'),
    confirmDescription: t('dashboard.authors.bulkDeleteDesc'),
    confirmLabel: t('dashboard.authors.bulkDelete'),
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
  runRow,
} = await useDashboardList<AuthorListItem>({
  endpoint: '/api/authors',
  filterKeys: ['createdAt'],
  dateRangeKeys: ['createdAt'],
})

const deleteAction = bulkActions.find(action => action.value === 'delete')!

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
      type: 'author',
      mode: 'create',
      title: t('dashboard.authors.createTitle'),
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
      type: 'author',
      mode: 'edit',
      id,
      title: t('dashboard.authors.editTitle'),
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

function rowActions(row: TableRow<AuthorListItem>) {
  return [
    { type: 'label' as const, label: t('dashboard.authors.actions') },
    {
      label: t('dashboard.authors.actionEdit'),
      icon: 'i-lucide-pencil',
      onSelect() {
        openEdit(row.original.id)
      },
    },
    {
      label: t('dashboard.authors.actionCopyId'),
      onSelect() {
        navigator.clipboard?.writeText(String(row.original.id))
      },
    },
    {
      label: row.getIsExpanded()
        ? t('dashboard.authors.actionCollapse')
        : t('dashboard.authors.actionExpand'),
      onSelect() {
        row.toggleExpanded()
      },
    },
    { type: 'separator' as const },
    {
      label: t('dashboard.authors.actionDelete'),
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect() {
        void runRow(deleteAction, row.original.id, {
          confirmTitle: t('dashboard.authors.actionDeleteTitle'),
          confirmDescription: t('dashboard.authors.actionDeleteDesc'),
          confirmLabel: t('dashboard.authors.actionDelete'),
        })
      },
    },
  ]
}
</script>

<template>
  <div>
    <PageHeader
      :title="t('dashboard.authors.title')"
      :lead="t('dashboard.authors.lead')"
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
              :label="t('dashboard.authors.addRecord')"
              icon="i-lucide-plus"
              color="primary"
              :loading="formBusy"
              :disabled="formBusy"
              @click="openCreate"
            />
          </template>
          <template #expanded="{ row }">
            <pre class="overflow-x-auto p-4 text-xs">{{ row.original }}</pre>
          </template>
        </DataTable>
      </div>
    </section>
  </div>
</template>
