import type { LanguageOption } from '#shared/types/language'

/** Shared active languages (middleware ensure → LangToggle). */
export function useActiveLanguages() {
  return useState<LanguageOption[]>('active-languages', () => [])
}

/** Fill state once; later callers reuse the same array. */
export async function ensureActiveLanguages(): Promise<LanguageOption[]> {
  const state = useActiveLanguages()
  if (state.value.length > 0) {
    return state.value
  }

  state.value = await $fetch<LanguageOption[]>('/api/languages/options')
  return state.value
}
