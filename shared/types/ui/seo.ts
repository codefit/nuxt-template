export type SeoRobots =
  | 'index, follow'
  | 'noindex, follow'
  | 'index, nofollow'
  | 'noindex, nofollow'
  | (string & {})

export type SeoOgType = 'website' | 'article'

export interface SeoInput {
  title: string
  path?: string
  type?: SeoOgType
  image?: string
  robots?: SeoRobots
  noindex?: boolean
  keywords?: string[]
  description?: string
  modifiedTime?: string
  publishedTime?: string
}

/** @deprecated Use SeoInput */
export type PageSeoInput = SeoInput

export interface LdGraph {
  '@context': 'https://schema.org'
  '@graph': Record<string, unknown>[]
}
