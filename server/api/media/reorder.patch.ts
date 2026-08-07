import { z } from 'zod'
import { isEntityKey } from '#shared/types/dto/entity'
import { isMediaCollection } from '#shared/types/media/collection'
import { reorderMedia } from '~~/server/services/media/reorder'

const bodySchema = z.object({
  entity: z.string().refine(isEntityKey),
  modelId: z.number().int().positive(),
  collection: z.string().refine(isMediaCollection),
  orderedIds: z.array(z.number().int().positive()).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  await reorderMedia({
    entityKey: body.entity,
    modelId: body.modelId,
    collection: body.collection,
    orderedIds: body.orderedIds,
  })
  return { ok: true }
})
