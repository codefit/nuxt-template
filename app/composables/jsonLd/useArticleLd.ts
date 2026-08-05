import { useJsonld } from '#jsonld'
import { site } from '#shared/config/site'
import type { ArticleDetail } from '#shared/types/article'

type ArticleLdSource = Pick<
  ArticleDetail,
  'slug' | 'title' | 'description' | 'image' | 'author' | 'publishedAt' | 'modifiedAt'
>

/**
 * Article detail JSON-LD (schema.org/Article) via nuxt-jsonld.
 * Listing pages should use HTML microdata instead.
 */
export function useArticleLd(
  source: MaybeRefOrGetter<ArticleLdSource | null | undefined>,
) {
  const { origin, absolute } = useSiteUrl()
  const { localeProperties } = useI18n()
  const localePath = useLocalePath()
  const orgId = computed(() => `${origin.value}/#organization`)

  useJsonld(() => {
    const item = toValue(source)

    if (!item) {
      return null
    }

    const path = localePath({ name: 'articles-slug', params: { slug: item.slug } })
    const url = absolute(path)
    const image = absolute(item.image || site.seo.image)

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: item.title,
      description: item.description,
      image: [image],
      datePublished: item.publishedAt,
      dateModified: item.modifiedAt || item.publishedAt,
      ...(item.author
        ? {
            author: {
              '@type': 'Person',
              name: item.author,
            },
          }
        : {}),
      publisher: {
        '@id': orgId.value,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      inLanguage: localeProperties.value.language || 'cs-CZ',
      isPartOf: {
        '@id': `${origin.value}/#website`,
      },
    }
  })
}
