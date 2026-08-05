import { z } from 'zod'

export const authorFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
})

export type AuthorFormParsed = z.infer<typeof authorFormSchema>
