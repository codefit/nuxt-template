<script setup lang="ts">
import type { Message } from '#shared/types/db'
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
  title: t('messages.seoTitle'),
  description: t('messages.seoDescription'),
})

// --- Table config -----------------------------------------------------------

const searchConfig: TableSearchConfig = {
  columns: ['name', 'email', 'message'],
  placeholder: t('messages.searchHint'),
}

const filters: TableFilter[] = [
  {
    key: 'createdAt',
    label: t('messages.filterCreated'),
    type: 'date-range',
    icon: 'i-lucide-calendar-range',
  },
]

const columns: TableColumn<Message>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'name',
    header: createSortHeader<Message>(t('messages.colName')),
  },
  {
    accessorKey: 'email',
    header: createSortHeader<Message>(t('messages.colEmail')),
    meta: {
      class: {
        td: 'lowercase',
      },
    },
  },
  {
    accessorKey: 'message',
    header: t('messages.colMessage'),
  },
  {
    accessorKey: 'createdAt',
    header: createSortHeader<Message>(t('messages.colCreated')),
    cell: ({ row }) => {
      const value = row.getValue('createdAt')
      return value
        ? new Date(value as string | number | Date).toLocaleString()
        : ''
    },
  },
]

const bulkActions: BulkAction[] = [
  {
    label: t('messages.bulkExport'),
    value: 'export',
    icon: 'i-lucide-download',
    toast: 'info',
    result: true,
  },
  {
    label: t('messages.bulkDelete'),
    value: 'delete',
    icon: 'i-lucide-trash',
    confirm: true,
    confirmTitle: t('messages.bulkDeleteTitle'),
    confirmDescription: t('messages.bulkDeleteDesc'),
    confirmLabel: t('messages.bulkDelete'),
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
  getRowId,
  runBulk,
} = await useDashboardList<Message>({
  endpoint: '/api/messages',
  filterKeys: ['createdAt'],
  dateRangeKeys: ['createdAt'],
})

// --- Handlers ---------------------------------------------------------------

function rowActions(row: TableRow<Message>) {
  return [
    { type: 'label' as const, label: t('messages.actions') },
    {
      label: t('messages.actionCopyId'),
      onSelect() {
        navigator.clipboard?.writeText(String(row.original.id))
      },
    },
    {
      label: row.getIsExpanded()
        ? t('messages.actionCollapse')
        : t('messages.actionExpand'),
      onSelect() {
        row.toggleExpanded()
      },
    },
    { type: 'separator' as const },
    {
      label: t('messages.actionView'),
      onSelect() {
        console.log('action:view', row.original)
      },
    },
    {
      label: t('messages.actionDelete'),
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
      :title="t('messages.title')"
      :lead="t('messages.lead')"
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
          <template #expanded="{ row }">
            <pre class="overflow-x-auto p-4 text-xs">{{ row.original }}</pre>
          </template>
        </DataTable>
      </div>
    </section>
  </div>
</template>
