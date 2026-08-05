import type { LanguageOption } from '#shared/types/language'

/** Shared active languages (middleware ensure → LangToggle). */
export function useActiveLanguages() {
  return useState<LanguageOption[]>('active-languages', () => [])
}

/**
 * Fill state once; later callers reuse the same array.
 * Uses `useRequestFetch` so SSR keeps the incoming host/cookies
 * (plain `$fetch` on Railway often 500s the first document request).
 */
export async function ensureActiveLanguages(): Promise<LanguageOption[]> {
  const state = useActiveLanguages()
  if (state.value.length > 0) {
    return state.value
  }

  try {
    const requestFetch = useRequestFetch()
    state.value = await requestFetch<LanguageOption[]>('/api/languages/options')
  }
  catch {
    return []
  }

  return state.value
}
