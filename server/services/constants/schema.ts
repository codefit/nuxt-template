import { z } from 'zod'
import { CONSTANT_GROUPS, ConstantType } from '#shared/types/dto/constant'

export const constantFormSchema = z.object({
  group: z.enum(CONSTANT_GROUPS),
  key: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z][a-z0-9_]*$/, 'Key must be snake_case (a-z, 0-9, _).'),
  type: z.enum([ConstantType.TEXT]).default(ConstantType.TEXT),
  value: z.string(),
  label: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  isPrivate: z.boolean(),
})

export type ConstantFormParsed = z.infer<typeof constantFormSchema>

/** Update body — `key` is immutable after create. */
export const constantUpdateSchema = constantFormSchema.omit({ key: true })

export type ConstantUpdateParsed = z.infer<typeof constantUpdateSchema>
