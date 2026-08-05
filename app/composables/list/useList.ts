import type { ResourceListResponse } from '#shared/types/ui/resource'
import { RESOURCE_DEFAULT_LIMIT } from '#shared/types/ui/resource'
import type { WatchSource } from 'vue'

interface Options {
  endpoint: string
  /** Prefix for useAsyncData key (default: endpoint). */
  key?: string
  /** 1-based page (URL / UPagination). Defaults to 1. */
  page?: MaybeRefOrGetter<number>
  limit?: number
  /** Extra GET params merged into the request. */
  query?: MaybeRefOrGetter<Record<string, string | undefined>>
  /** Include i18n locale in key + query (default true). */
  locale?: boolean
  watchExtra?: MaybeRefOrGetter<unknown>[]
}

/**
 * Paginated resource list via shared `ResourceListResponse<T>`.
 */
export function useList<T>(options: Options) {
  const { locale } = useI18n()
  const limit = options.limit ?? RESOURCE_DEFAULT_LIMIT
  const withLocale = options.locale !== false

  const page = computed(() => {
    const value = Number(toValue(options.page) ?? 1)

    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
  })

  const extraQuery = computed(() => toValue(options.query) ?? {})

  const asyncKey = computed(() => {
    const prefix = options.key ?? options.endpoint
    const loc = withLocale ? `-${locale.value}` : ''

    return `${prefix}${loc}-p${page.value}-l${limit}`
  })

  const watchSources: WatchSource[] = [page, extraQuery]

  if (withLocale) {
    watchSources.push(locale)
  }

  for (const source of options.watchExtra ?? []) {
    watchSources.push(computed(() => toValue(source)))
  }

  return useAsyncData(
    asyncKey,
    () => {
      const query: Record<string, string> = {
        page: String(page.value),
        limit: String(limit),
      }

      if (withLocale) {
        query.locale = locale.value
      }

      for (const [key, value] of Object.entries(extraQuery.value)) {
        if (value != null && value !== '') {
          query[key] = value
        }
      }

      return $fetch<ResourceListResponse<T>>(options.endpoint, { query })
    },
    {
      watch: watchSources,
      default: () => ({
        items: [] as T[],
        meta: { page: page.value, limit, total: 0 },
      }),
    },
  )
}
