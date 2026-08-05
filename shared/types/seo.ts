export type SeoRobots =
  | 'index, follow'
  | 'noindex, follow'
  | 'index, nofollow'
  | 'noindex, nofollow'
  | (string & {})

export type SeoOgType = 'website' | 'article'

export interface SeoInput {
  title: string
  description?: string
  image?: string
  /** Absolute path or full URL; defaults to current route */
  path?: string
  type?: SeoOgType
  robots?: SeoRobots
  noindex?: boolean
  publishedTime?: string
  modifiedTime?: string
  /** Extra keywords (optional; Google mostly ignores, other engines may use) */
  keywords?: string[]
}

/** @deprecated Use SeoInput */
export type PageSeoInput = SeoInput

export interface LdGraph {
  '@context': 'https://schema.org'
  '@graph': Record<string, unknown>[]
}
