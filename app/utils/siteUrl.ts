import { site } from '#shared/config/site'

/** Resolve public site origin (runtime override wins). */
export function siteOrigin(): string {
  const config = useRuntimeConfig()
  const url = String(config.public.siteUrl || site.url).replace(/\/$/, '')
  return url
}

/** Build absolute URL from path or pass through if already absolute. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const origin = siteOrigin()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalized}`
}
