import type { H3Event } from 'h3'
import type { ResourceBulkBody } from '#shared/types/resource'
import type { TableFilters, TableSelection } from '#shared/types/data-table'
import { apiError } from '~~/server/utils/apiI18n'

export function readBulkSelection(
  event: H3Event,
  body: ResourceBulkBody,
): TableSelection {
  const mode = body.selection?.mode
  const ids = body.selection?.ids

  if (mode !== 'include' && mode !== 'exclude') {
    apiError(event, 400, 'api.errors.bulkInvalidMode')
  }

  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' && typeof id !== 'number')) {
    apiError(event, 400, 'api.errors.bulkInvalidIds')
  }

  return {
    mode,
    ids: ids.map(String),
  }
}

export function readBulkFilters(body: ResourceBulkBody): TableFilters {
  return {
    ...(body.filters ?? {}),
    ...(body.search?.trim() ? { q: body.search.trim() } : {}),
  }
}
