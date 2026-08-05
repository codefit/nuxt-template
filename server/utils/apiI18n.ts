import type { H3Event } from 'h3'
import { site } from '#shared/config/site'
import { getLanguageId } from '~~/server/services/cache/languages'
import cs from '../../i18n/locales/cs.json'
import en from '../../i18n/locales/en.json'
import sk from '../../i18n/locales/sk.json'

const catalogs = {
  cs,
  sk,
  en,
} as const

export type AppLocale = keyof typeof catalogs

function isAppLocale(value: string): value is AppLocale {
  return value in catalogs
}

/** Default locale from runtimeConfig / site (env: NUXT_PUBLIC_DEFAULT_LOCALE | NUXT_LOCALE_DEFAULT). */
export function getDefaultLocale(event?: H3Event): AppLocale {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const raw = String(config.public.defaultLocale || site.defaultLocale)
  return isAppLocale(raw) ? raw : site.defaultLocale
}

/**
 * Resolve request locale: `?locale=` → i18n cookie → defaultLocale.
 * Does not check DB `isActive` (safe for error-message catalogs).
 */
export function resolveRequestLocale(event: H3Event): AppLocale {
  const query = getQuery(event)
  if (typeof query.locale === 'string' && isAppLocale(query.locale)) {
    return query.locale
  }

  const cookie = getCookie(event, 'i18n_redirected')
  if (cookie && isAppLocale(cookie)) {
    return cookie
  }

  return getDefaultLocale(event)
}

/** Resolve locale and 404 when it is missing / inactive in DB cache. */
export async function requireRequestLocale(event: H3Event): Promise<AppLocale> {
  const locale = resolveRequestLocale(event)
  const id = await getLanguageId(locale)
  if (id === null) {
    throw createError({
      statusCode: 404,
      message: 'Locale not found',
    })
  }
  return locale
}

function readKey(catalog: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split('.')
  let current: unknown = catalog

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }

  return typeof current === 'string' ? current : undefined
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) {
    return text
  }

  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    text,
  )
}

function translator(locale: AppLocale, fallback: AppLocale) {
  const catalog = catalogs[locale] as Record<string, unknown>
  const fallbackCatalog = catalogs[fallback] as Record<string, unknown>

  return (key: string, params?: Record<string, string | number>): string => {
    const raw = readKey(catalog, key) ?? readKey(fallbackCatalog, key) ?? key
    return interpolate(raw, params)
  }
}

/**
 * Server-side translations for API handlers (same JSON catalogs as @nuxtjs/i18n).
 * Rejects inactive locales (DB cache) with 404.
 */
export async function useApiI18n(event: H3Event) {
  const locale = await requireRequestLocale(event)
  const fallback = getDefaultLocale(event)
  return { locale, t: translator(locale, fallback) }
}

/** Throw `createError` with a translated `message` (not statusMessage — h3 sanitizes that). */
export function apiError(
  event: H3Event,
  statusCode: number,
  key: string,
  params?: Record<string, string | number>,
): never {
  const locale = resolveRequestLocale(event)
  const fallback = getDefaultLocale(event)
  const t = translator(locale, fallback)
  throw createError({
    statusCode,
    message: t(key, params),
  })
}
