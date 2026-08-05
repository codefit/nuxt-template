import { count } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Message } from '#shared/types/db'
import type { ResourceListQuery, ResourceListResponse } from '#shared/types/ui/resource'
import { messageFilterSql } from '~~/server/services/messages/selection'
import {
  listResponse,
  resolveListPagination,
  resolveSortSql,
} from '~~/server/utils/listQuery'

const SORTABLE = {
  id: schema.messages.id,
  name: schema.messages.name,
  email: schema.messages.email,
  createdAt: schema.messages.createdAt,
} as const

/**
 * Paginated message list — shared ResourceListQuery + model filters/sort.
 */
export async function listMessages(
  input: ResourceListQuery = {},
): Promise<ResourceListResponse<Message>> {
  const pagination = resolveListPagination(input)
  const where = messageFilterSql(input.filters)
  const orderBy = resolveSortSql(SORTABLE, input.sort, {
    id: 'createdAt',
    desc: true,
  })

  const [[totalRow], items] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.messages)
      .where(where),
    db
      .select()
      .from(schema.messages)
      .where(where)
      .orderBy(orderBy)
      .limit(pagination.limit)
      .offset(pagination.offset),
  ])

  return listResponse(items, totalRow?.total ?? 0, pagination)
}
