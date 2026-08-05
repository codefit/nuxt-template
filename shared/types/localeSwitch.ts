/**
 * Locale code → route params to merge when switching language
 * (e.g. `{ en: { slug: 'welcome-to-the-site' } }`).
 */
export type LocaleRouteParams = Record<string, Record<string, string>>

/** Locale code → translated URL slug for one param (usually `slug`). */
export type LocaleSlugMap = Record<string, string>
