import { z } from 'zod'
import { Entity, isEntityKey } from '#shared/types/dto/entity'
import { isMediaCollection } from '#shared/types/media/collection'
import { uploadMedia } from '~~/server/services/media/upload'

const metaSchema = z.object({
  entity: z.string().refine(isEntityKey, 'Invalid entity'),
  modelId: z.coerce.number().int().positive(),
  collection: z.string().refine(isMediaCollection, 'Invalid collection'),
  rank: z.coerce.number().int().nonnegative().optional(),
  alt: z.string().optional(),
})

/**
 * Upload one or more files and attach to an entity model.
 * Form fields: `files` (File|File[]), `entity`, `modelId`, `collection`, optional `rank`/`alt`.
 */
export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const meta = metaSchema.parse({
    entity: form.get('entity'),
    modelId: form.get('modelId'),
    collection: form.get('collection'),
    rank: form.get('rank') ?? undefined,
    alt: form.get('alt') ?? undefined,
  })

  const raw = form.getAll('files').filter((entry): entry is File => entry instanceof File && entry.size > 0)
  if (raw.length === 0) {
    const single = form.get('file')
    if (single instanceof File && single.size > 0) {
      raw.push(single)
    }
  }

  if (raw.length === 0) {
    throw createError({ statusCode: 400, message: 'No file provided.' })
  }

  const items = []
  for (const [index, file] of raw.entries()) {
    items.push(await uploadMedia({
      entityKey: meta.entity,
      modelId: meta.modelId,
      collection: meta.collection,
      file,
      rank: meta.rank != null ? meta.rank + index : undefined,
      alt: meta.alt,
    }))
  }

  return items.length === 1 ? items[0] : items
})
