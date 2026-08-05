import { site } from '#shared/config/site'

/**
 * Site origin + absolute URLs via runtimeConfig.
 * Must be called in setup / plugin / middleware (Nuxt composable).
 */
export function useSiteUrl() {
  const config = useRuntimeConfig()

  const origin = computed(() =>
    String(config.public.siteUrl || site.url).replace(/\/$/, ''),
  )

  function absolute(path = '/') {
    if (/^https?:\/\//i.test(path)) {
      return path
    }

    const normalized = path.startsWith('/') ? path : `/${path}`
    return `${origin.value}${normalized}`
  }

  return {
    origin,
    absolute,
  }
}
