import type { ArticleLocaleInput, ArticleTranslations } from '#shared/types/dto/article'

export function emptyLocale(): ArticleLocaleInput {
  return {
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  }
}

export function localeFilled(locale: ArticleLocaleInput | undefined): boolean {
  if (!locale) {
    return false
  }
  return Object.values(locale).some(value => String(value ?? '').trim() !== '')
}

/** True when every required translation field has content. */
export function localeComplete(locale: ArticleLocaleInput | undefined): boolean {
  if (!locale) {
    return false
  }
  return (
    locale.title.trim() !== ''
    && locale.slug.trim() !== ''
    && locale.excerpt.trim() !== ''
    && locale.body.trim() !== ''
    && locale.metaTitle.trim() !== ''
    && locale.metaDescription.trim() !== ''
  )
}

/**
 * Keep default locale always; drop empty secondary locales.
 * Partially filled secondary locales stay (caller must validate completeness).
 */
export function pruneTranslations(
  translations: ArticleTranslations,
  defaultCode: string,
): ArticleTranslations {
  const result: ArticleTranslations = {}
  for (const [code, locale] of Object.entries(translations)) {
    if (code === defaultCode || localeFilled(locale)) {
      result[code] = locale
    }
  }
  return result
}
