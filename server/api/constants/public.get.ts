import type { ConstantPublicMap } from '#shared/types/dto/constant'
import { getPublicConstants } from '~~/server/services/cache/constants'

/**
 * GET /api/constants/public — active + non-private map (key → value).
 */
export default defineEventHandler(async (): Promise<ConstantPublicMap> => {
  return getPublicConstants()
})
