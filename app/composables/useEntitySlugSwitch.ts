import type { LocaleRouteParams, LocaleSlugMap } from '#shared/types/i18n/localeSwitch'
import { provideLocaleSwitchParams } from '~/composables/useLocaleSwitch'

/**
 * Publish a locale → slug map (e.g. from article detail payload) to LangToggle.
 * No extra API call — use when the page already loaded `slugMap`.
 */
export function provideLocaleSlugMap(
  slugMap: MaybeRefOrGetter<LocaleSlugMap | null | undefined>,
  paramKey = 'slug',
): void {
  const params = computed((): LocaleRouteParams | null => {
    const map = toValue(slugMap)
    if (!map) {
      return null
    }

    const out: LocaleRouteParams = {}
    for (const [code, value] of Object.entries(map)) {
      out[code] = { [paramKey]: value }
    }
    return out
  })

  provideLocaleSwitchParams(params)
}
