import type {
  BulkPayload,
  BulkResult,
} from '#shared/types/data-table'
import type {
  ResourceBulkResponse,
  ResourceListResponse,
} from '#shared/types/resource'
import type { WatchSource } from 'vue'
import { toListQuery } from '~/utils/listQuery'

interface Options {
  endpoint: string
  /** Defaults to `${endpoint}/bulk`. */
  bulkEndpoint?: string
  filterKeys?: string[]
  multiFilterKeys?: string[]
  dateRangeKeys?: string[]
  /** Related data for list GET, e.g. `['author']`. */
  with?: string[]
  /** Inject i18n locale into list + bulk query. */
  locale?: boolean
  pageSize?: number
  pageSizes?: number[]
}

/**
 * Dashboard DataTable wiring: URL table state → list fetch → bulk POST.
 */
export async function useDashboardList<T extends { id: string | number }>(
  options: Options,
) {
  const { locale } = useI18n()
  const withLocale = Boolean(options.locale)
  const bulkEndpoint = options.bulkEndpoint ?? `${options.endpoint}/bulk`

  const {
    pagination,
    sorting,
    search,
    filters,
    pageSizes,
    setPageSize,
    reset,
  } = useTableState({
    pageSize: options.pageSize,
    pageSizes: options.pageSizes,
    filterKeys: options.filterKeys,
    multiFilterKeys: options.multiFilterKeys,
    dateRangeKeys: options.dateRangeKeys,
  })

  const listQuery = computed(() =>
    toListQuery({
      pagination: pagination.value,
      sorting: sorting.value,
      search: search.value,
      filters: filters.value,
      with: options.with,
    }),
  )

  const query = computed(() => {
    if (!withLocale) {
      return listQuery.value
    }

    return {
      ...listQuery.value,
      locale: locale.value,
    }
  })

  const watchSources: WatchSource[] = [listQuery]

  if (withLocale) {
    watchSources.push(locale)
  }

  const { data: list, status, refresh } = await useFetch<ResourceListResponse<T>>(
    options.endpoint,
    {
      query,
      watch: watchSources,
    },
  )

  const data = computed(() => list.value?.items ?? [])
  const total = computed(() => list.value?.meta.total ?? 0)

  function getRowId(row: T) {
    return String(row.id)
  }

  async function runBulk(
    payload: BulkPayload<T>,
  ): Promise<BulkResult | void | false> {
    const response = await $fetch<ResourceBulkResponse>(bulkEndpoint, {
      method: 'POST',
      body: {
        action: payload.action.value,
        selection: payload.selection,
        filters: payload.filters,
      },
      ...(withLocale ? { query: { locale: locale.value } } : {}),
    })

    await refresh()

    return response.result
  }

  return {
    pagination,
    sorting,
    search,
    filters,
    pageSizes,
    setPageSize,
    reset,
    data,
    total,
    status,
    refresh,
    getRowId,
    runBulk,
  }
}
