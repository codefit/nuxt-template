import type { LanguageOption } from '#shared/types/language'

/** Shared active languages (middleware ensure → LangToggle). */
export function useActiveLanguages() {
  return useState<LanguageOption[]>('active-languages', () => [])
}

/**
 * Active languages for UI + locale middleware.
 * - SSR: fill once per request (payload → hydration).
 * - Client: refresh on every call so dashboard language changes
 *   apply on the next in-app navigation (no F5).
 */
export async function ensureActiveLanguages(): Promise<LanguageOption[]> {
  const state = useActiveLanguages()

  if (import.meta.server && state.value.length > 0) {
    return state.value
  }

  try {
    const requestFetch = useRequestFetch()
    state.value = await requestFetch<LanguageOption[]>('/api/languages/options')
  }
  catch {
    return state.value
  }

  return state.value
}
