import { count } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { AuthorListItem } from '#shared/types/dto/author'
import type { ResourceListQuery, ResourceListResponse } from '#shared/types/ui/resource'
import { authorFilterSql } from '~~/server/services/authors/selection'
import {
  listResponse,
  resolveListPagination,
  resolveSortSql,
} from '~~/server/utils/listQuery'

const SORTABLE = {
  id: schema.authors.id,
  name: schema.authors.name,
  email: schema.authors.email,
  phone: schema.authors.phone,
  createdAt: schema.authors.createdAt,
  updatedAt: schema.authors.updatedAt,
} as const

function mapAuthor(row: {
  id: number
  name: string
  email: string | null
  phone: string | null
  createdAt: Date
  updatedAt: Date
}): AuthorListItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

/**
 * Paginated authors list for dashboard.
 */
export async function listAuthors(
  input: ResourceListQuery = {},
): Promise<ResourceListResponse<AuthorListItem>> {
  const pagination = resolveListPagination(input)
  const where = authorFilterSql(input.filters)
  const orderBy = resolveSortSql(SORTABLE, input.sort, {
    id: 'name',
    desc: false,
  })

  const [[totalRow], items] = await Promise.all([
    db
      .select({ total: count() })
      .from(schema.authors)
      .where(where),
    db
      .select({
        id: schema.authors.id,
        name: schema.authors.name,
        email: schema.authors.email,
        phone: schema.authors.phone,
        createdAt: schema.authors.createdAt,
        updatedAt: schema.authors.updatedAt,
      })
      .from(schema.authors)
      .where(where)
      .orderBy(orderBy)
      .limit(pagination.limit)
      .offset(pagination.offset),
  ])

  return listResponse(
    items.map(mapAuthor),
    totalRow?.total ?? 0,
    pagination,
  )
}
