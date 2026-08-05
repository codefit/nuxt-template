export type DataLayerPayload = Record<string, unknown>

declare global {
  interface Window {
    dataLayer: DataLayerPayload[]
    /** Official gtag stub — Arguments-style pushes for Consent Mode. */
    gtag?: (...args: unknown[]) => void
    /** Set by vanilla-cookieconsent while an instance is active. */
    _ccRun?: boolean
  }
}

/**
 * Safe dataLayer push for GTM / consent-aware tags.
 * Always available — GTM container may load later or stay empty in dev.
 */
export function useDataLayer() {
  const route = useRoute()
  const { absolute } = useSiteUrl()

  function ensure(): DataLayerPayload[] {
    if (import.meta.server) {
      return []
    }

    window.dataLayer = window.dataLayer || []
    return window.dataLayer
  }

  function push(payload: DataLayerPayload) {
    if (import.meta.server) {
      return
    }

    ensure().push(payload)
  }

  function pageView(path?: string, title?: string) {
    push({
      event: 'nuxt_page_view',
      page_path: path ?? route.fullPath,
      page_title: title ?? (import.meta.client ? document.title : undefined),
      page_location:
        import.meta.client ? window.location.href : absolute(route.fullPath),
    })
  }

  return {
    push,
    pageView,
    ensure,
  }
}
