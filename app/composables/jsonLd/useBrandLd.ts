import { useJsonld } from '#jsonld'
import { site } from '#shared/config/site'

/**
 * Sitewide brand identity as JSON-LD (@graph: Organization + Brand + WebSite).
 * Call once from seo plugin.
 */
export function useBrandLd() {
  const { origin, absolute } = useSiteUrl()
  const { t, localeProperties } = useI18n()
  const base = origin.value
  const orgId = `${base}/#organization`
  const brandId = `${base}/#brand`
  const websiteId = `${base}/#website`
  const logoUrl = absolute(site.brand.logo)

  useJsonld(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: site.brand.legalName,
        legalName: site.brand.legalName,
        url: base,
        email: site.legal.email,
        telephone: site.legal.phone,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
        brand: { '@id': brandId },
        ...(site.brand.sameAs.length ? { sameAs: [...site.brand.sameAs] } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.legal.address,
        },
      },
      {
        '@type': 'Brand',
        '@id': brandId,
        name: site.name,
        url: base,
        logo: logoUrl,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: base,
        name: site.name,
        description: t('site.description'),
        inLanguage: localeProperties.value.language || 'cs-CZ',
        publisher: { '@id': orgId },
      },
    ],
  }))
}
