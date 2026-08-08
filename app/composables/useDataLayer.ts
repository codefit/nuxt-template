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
 * Event names follow GA4 recommended events where applicable.
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

  /** SPA / virtual page view — GA4 `page_view` params for a GTM trigger. */
  function pageView(path?: string, title?: string) {
    const pagePath = path ?? route.fullPath

    push({
      event: 'page_view',
      page_path: pagePath,
      page_title: title ?? (import.meta.client ? document.title : undefined),
      page_location: import.meta.client
        ? window.location.href
        : absolute(pagePath),
    })
  }

  /** GA4 recommended `login` event. */
  function login(method = 'email') {
    push({
      event: 'login',
      method,
    })
  }

  /** GA4 recommended `sign_up` event. */
  function signUp(method = 'email') {
    push({
      event: 'sign_up',
      method,
    })
  }

  return {
    push,
    pageView,
    login,
    signUp,
    ensure,
  }
}
