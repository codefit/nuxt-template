import { listConstantGroups } from '~~/server/services/constants/list'

/**
 * GET /api/constants/groups — counts per group (admin, fresh).
 */
export default defineEventHandler(async () => {
  return listConstantGroups()
})
