import { z } from 'zod'

export const languageFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  icon: z.string().trim().nullable().optional().transform(value => value || null),
  isActive: z.boolean(),
  isDefault: z.boolean(),
})

export type LanguageFormParsed = z.infer<typeof languageFormSchema>
