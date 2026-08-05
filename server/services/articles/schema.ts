import { z } from 'zod'
import { localeComplete, localeFilled } from '#shared/utils/translations'

const localeSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  body: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  metaKeywords: z.string().optional().default(''),
})

const mediaSchema = z.object({
  id: z.string(),
  field: z.string(),
  name: z.string(),
  mime: z.string(),
  size: z.number().nonnegative(),
  previewUrl: z.string().optional(),
})

export const articleFormSchema = z.object({
  isPublished: z.boolean(),
  publishedAt: z.string().nullable(),
  authorId: z.number().int().positive().nullable(),
  translations: z.record(z.string(), localeSchema),
  media: z.array(mediaSchema).optional(),
})

export type ArticleFormParsed = z.infer<typeof articleFormSchema>

export function assertArticleTranslations(
  translations: ArticleFormParsed['translations'],
  defaultCode: string,
): void {
  const defaultLocale = translations[defaultCode]
  if (!defaultLocale || !localeComplete(defaultLocale)) {
    throw createError({
      statusCode: 400,
      message: `Default locale "${defaultCode}" requires title, slug, excerpt, body and meta fields.`,
    })
  }

  for (const [code, locale] of Object.entries(translations)) {
    if (code === defaultCode) {
      continue
    }
    if (!localeFilled(locale)) {
      continue
    }
    if (!localeComplete(locale)) {
      throw createError({
        statusCode: 400,
        message: `Locale "${code}" is partially filled — complete all translation fields or clear them.`,
      })
    }
  }
}
