import { z } from 'zod'
import { isEntityKey } from '#shared/types/dto/entity'
import { isMediaCollection } from '#shared/types/media/collection'
import { getEntityMedia, listMedia } from '~~/server/services/media/list'

const querySchema = z.object({
  entity: z.string().refine(isEntityKey),
  modelId: z.coerce.number().int().positive(),
  collection: z.string().refine(isMediaCollection).optional(),
  grouped: z
    .union([z.literal('1'), z.literal('true'), z.literal('0'), z.literal('false')])
    .optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  const grouped = query.grouped === '1' || query.grouped === 'true'

  if (grouped) {
    return getEntityMedia(query.entity, query.modelId)
  }

  return listMedia(query.entity, query.modelId, query.collection)
})
