import type { LocaleRouteParams } from '#shared/types/localeSwitch'

const STATE_KEY: string = 'locale-switch-params'

/**
 * Shared locale → route param overrides for LangToggle (layout ↔ page).
 * Uses `useState` because Header lives in the layout and cannot inject from NuxtPage.
 */
export function useLocaleSwitchParams(): Ref<LocaleRouteParams | null> {
  return useState<LocaleRouteParams | null>(STATE_KEY, () => null)
}

/**
 * Detail page publishes per-locale param overrides (and clears them on leave).
 * Example: `{ cs: { slug: 'vitejte-na-webu' }, en: { slug: 'welcome-to-the-site' } }`
 */
export function provideLocaleSwitchParams(
  params: MaybeRefOrGetter<LocaleRouteParams | null | undefined>,
): void {
  const state = useLocaleSwitchParams()

  watch(
    () => toValue(params) ?? null,
    (value) => {
      state.value = value
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    state.value = null
  })
}

/** Strip i18n suffix from route name (`articles-slug___en` → `articles-slug`). */
export function routeBaseName(
  name: string | symbol | null | undefined,
): string | undefined {
  if (!name || typeof name !== 'string') {
    return undefined
  }
  return name.split('___')[0] || undefined
}

export function flattenRouteParams(
  params: Record<string, string | string[]>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    out[key] = Array.isArray(value) ? (value[0] ?? '') : String(value)
  }
  return out
}
