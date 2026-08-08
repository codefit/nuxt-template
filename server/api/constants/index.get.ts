import { isConstantGroup } from '#shared/types/dto/constant'
import { listConstants } from '~~/server/services/constants/list'
import { apiError } from '~~/server/utils/apiI18n'

/**
 * GET /api/constants?group=&q= — admin list for one group (fresh).
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const group = typeof query.group === 'string' ? query.group : ''
  const q = typeof query.q === 'string' ? query.q : undefined

  if (!isConstantGroup(group)) {
    apiError(event, 400, 'api.errors.invalidConstantGroup')
  }

  return listConstants({ group, q })
})
