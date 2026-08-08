import type { ConstantPublicMap } from '#shared/types/dto/constant'

/**
 * Public constants (active + non-private) for layout / pages.
 * Loads once via shared `useAsyncData` key (SSR payload → hydration).
 */
export function useConstants() {
  const { data: map, pending, refresh } = useAsyncData(
    'public-constants',
    () => $fetch<ConstantPublicMap>('/api/constants/public'),
    { default: () => ({}) },
  )

  function read(key: string): string | undefined {
    const value = map.value?.[key]
    return value === undefined || value === '' ? undefined : value
  }

  return { map, read, pending, refresh }
}
