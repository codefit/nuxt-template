<script setup lang="ts">
import type { LanguageListItem } from '#shared/types/dto/language'
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
  title: t('dashboard.languages.seoTitle'),
  description: t('dashboard.languages.seoDescription'),
})

// --- Table config -----------------------------------------------------------

const searchConfig: TableSearchConfig = {
  columns: ['code', 'name'],
  placeholder: t('dashboard.languages.searchHint'),
}

const filters: TableFilter[] = [
  {
    key: 'createdAt',
    label: t('dashboard.languages.filterCreated'),
    type: 'date-range',
    icon: 'i-lucide-calendar-range',
  },
  {
    key: 'isActive',
    label: t('dashboard.languages.filterActive'),
    type: 'select',
    icon: 'i-lucide-globe',
    options: [
      { label: t('dashboard.languages.activeYes'), value: '1' },
      { label: t('dashboard.languages.activeNo'), value: '0' },
    ],
  },
  {
    key: 'isDefault',
    label: t('dashboard.languages.filterDefault'),
    type: 'select',
    icon: 'i-lucide-star',
    options: [
      { label: t('dashboard.languages.defaultYes'), value: '1' },
      { label: t('dashboard.languages.defaultNo'), value: '0' },
    ],
  },
]

const columns: TableColumn<LanguageListItem>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'code',
    header: createSortHeader<LanguageListItem>(t('dashboard.languages.colCode')),
    meta: {
      class: {
        td: 'lowercase font-mono',
      },
    },
  },
  {
    accessorKey: 'name',
    header: createSortHeader<LanguageListItem>(t('dashboard.languages.colName')),
  },
  {
    accessorKey: 'icon',
    header: t('dashboard.languages.colIcon'),
  },
  {
    accessorKey: 'isActive',
    header: createSortHeader<LanguageListItem>(t('dashboard.languages.colActive')),
    cell: ({ row }) => {
      const active = row.getValue('isActive') as boolean
      return active
        ? t('dashboard.languages.activeYes')
        : t('dashboard.languages.activeNo')
    },
  },
  {
    accessorKey: 'isDefault',
    header: createSortHeader<LanguageListItem>(t('dashboard.languages.colDefault')),
    cell: ({ row }) => {
      const isDefault = row.getValue('isDefault') as boolean
      return isDefault
        ? t('dashboard.languages.defaultYes')
        : t('dashboard.languages.defaultNo')
    },
  },
  {
    accessorKey: 'updatedAt',
    header: createSortHeader<LanguageListItem>(t('dashboard.languages.colUpdated')),
    cell: ({ row }) => {
      const value = row.getValue('updatedAt')
      return value
        ? new Date(value as string).toLocaleString()
        : ''
    },
  },
]

const bulkActions: BulkAction[] = [
  {
    label: t('dashboard.languages.bulkExport'),
    value: 'export',
    icon: 'i-lucide-download',
    toast: 'info',
    result: true,
  },
  {
    label: t('dashboard.languages.bulkActivate'),
    value: 'activate',
    icon: 'i-lucide-globe',
    toast: 'success',
    result: true,
  },
  {
    label: t('dashboard.languages.bulkDeactivate'),
    value: 'deactivate',
    icon: 'i-lucide-eye-off',
    confirm: true,
    confirmTitle: t('dashboard.languages.bulkDeactivateTitle'),
    confirmDescription: t('dashboard.languages.bulkDeactivateDesc'),
    confirmLabel: t('dashboard.languages.bulkDeactivate'),
    confirmColor: 'warning',
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
} = await useDashboardList<LanguageListItem>({
  endpoint: '/api/languages',
  filterKeys: ['createdAt', 'isActive', 'isDefault'],
  dateRangeKeys: ['createdAt'],
})

const { open: openForm } = useFormSlideover()
const formBusy = ref(false)

// --- Handlers ---------------------------------------------------------------

async function openEdit(id: number) {
  if (formBusy.value) {
    return
  }

  formBusy.value = true
  try {
    const result = await openForm({
      type: 'language',
      mode: 'edit',
      id,
      title: t('dashboard.languages.editTitle'),
    })
    if (result?.ok) {
      await refresh()
    }
  }
  finally {
    formBusy.value = false
  }
}

function rowActions(row: TableRow<LanguageListItem>) {
  return [
    { type: 'label' as const, label: t('dashboard.languages.actions') },
    {
      label: t('dashboard.languages.actionEdit'),
      icon: 'i-lucide-pencil',
      onSelect() {
        openEdit(row.original.id)
      },
    },
    {
      label: t('dashboard.languages.actionCopyId'),
      onSelect() {
        navigator.clipboard?.writeText(String(row.original.id))
      },
    },
    {
      label: row.getIsExpanded()
        ? t('dashboard.languages.actionCollapse')
        : t('dashboard.languages.actionExpand'),
      onSelect() {
        row.toggleExpanded()
      },
    },
  ]
}
</script>

<template>
  <div>
    <PageHeader
      :title="t('dashboard.languages.title')"
      :lead="t('dashboard.languages.lead')"
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
          <template #icon-cell="{ row }">
            <img
              v-if="row.original.icon"
              :src="row.original.icon"
              :alt="row.original.code"
              class="size-5 rounded-sm object-contain"
            >
            <span
              v-else
              class="text-muted"
            >—</span>
          </template>
          <template #expanded="{ row }">
            <pre class="overflow-x-auto p-4 text-xs">{{ row.original }}</pre>
          </template>
        </DataTable>
      </div>
    </section>
  </div>
</template>
