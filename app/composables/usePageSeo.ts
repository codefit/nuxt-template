import { site } from '#shared/config/site'
import type { SeoInput } from '#shared/types/seo'

/**
 * Page-level SEO: title, description, robots, canonical, Open Graph, Twitter.
 * Prefer this over raw useHead/useSeoMeta on pages.
 */
export function usePageSeo(input: SeoInput | (() => SeoInput)) {
  const route = useRoute()
  const { absolute } = useSiteUrl()

  const seo = computed(() =>
    typeof input === 'function' ? input() : input,
  )

  const description = computed(
    () => seo.value.description?.trim() || site.seo.description,
  )

  const image = computed(() =>
    absolute(seo.value.image || site.seo.image),
  )

  const canonical = computed(() => {
    if (seo.value.path) {
      return absolute(seo.value.path)
    }

    return absolute(route.path)
  })

  const robots = computed(() => {
    if (seo.value.noindex) {
      return 'noindex, nofollow'
    }

    return seo.value.robots || site.seo.robots
  })

  useSeoMeta({
    title: () => seo.value.title,
    description: () => description.value,
    robots: () => robots.value,
    ogType: () => seo.value.type || 'website',
    ogSiteName: site.name,
    ogTitle: () => seo.value.title,
    ogDescription: () => description.value,
    ogUrl: () => canonical.value,
    ogImage: () => image.value,
    ogImageAlt: () => site.seo.imageAlt,
    ogLocale: site.locale,
    twitterCard: site.seo.twitterCard,
    twitterTitle: () => seo.value.title,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    twitterImageAlt: () => site.seo.imageAlt,
    twitterSite: () =>
      site.seo.twitterSite ? `@${site.seo.twitterSite}` : undefined,
    articlePublishedTime: () => seo.value.publishedTime,
    articleModifiedTime: () => seo.value.modifiedTime,
  })

  useHead({
    meta: () => {
      const keywords = seo.value.keywords?.join(', ')

      if (!keywords) {
        return []
      }

      return [
        {
          name: 'keywords',
          content: keywords,
        },
        {
          name: 'author',
          content: site.brand.legalName,
        },
      ]
    },
    link: [
      {
        rel: 'canonical',
        href: () => canonical.value,
      },
    ],
  })
}
