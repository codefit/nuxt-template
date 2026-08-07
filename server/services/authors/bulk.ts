import { and, inArray, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Author } from '#shared/types/db'
import type { BulkResult, TableFilters, TableSelection } from '#shared/types/ui/data-table'
import type { ResourceBulkResponse } from '#shared/types/ui/resource'
import { resolveAuthorSelection } from '~~/server/services/authors/selection'
import { runResourceBulk } from '~~/server/utils/bulkRun'

const ACTIONS = [
  'export',
  'delete',
] as const

export type AuthorBulkAction = (typeof ACTIONS)[number]

const ACTION_LABELS: Record<AuthorBulkAction, string> = {
  export: 'Export',
  delete: 'Smazat',
}

export interface AuthorBulkInput {
  action: AuthorBulkAction
  filters?: TableFilters
  selection: TableSelection
}

export function isAuthorBulkAction(value: string): value is AuthorBulkAction {
  return (ACTIONS as readonly string[]).includes(value)
}

function buildResult(
  action: AuthorBulkAction,
  affected: Author[],
  matchedTotal: number,
): BulkResult {
  return {
    title: ACTION_LABELS[action],
    description: `Hotovo pro ${affected.length} z ${matchedTotal} filtrovaných autorů.`,
    stats: [
      {
        label: 'Affected',
        value: affected.length,
        icon: 'i-lucide-rows-3',
        color: 'primary',
        description: 'zpracované řádky',
      },
      {
        label: 'Matched',
        value: matchedTotal,
        icon: 'i-lucide-filter',
        color: 'info',
        description: 'po filtrech',
      },
    ],
    items: affected.slice(0, 8).map(row => ({
      title: row.name,
      description: row.email ?? undefined,
      badge: `#${row.id}`,
    })),
  }
}

/**
 * Apply bulk action to filtered author selection (include / exclude).
 * Delete is soft (`deletedAt`).
 */
export async function runAuthorBulk(
  input: AuthorBulkInput,
): Promise<ResourceBulkResponse> {
  return runResourceBulk({
    action: input.action,
    selection: input.selection,
    filters: input.filters,
    resolve: resolveAuthorSelection,
    mutate: async (action, affected) => {
      if (action !== 'delete' || !affected.length) {
        return
      }

      const now = new Date()
      await db
        .update(schema.authors)
        .set({
          deletedAt: now,
          updatedAt: now,
        })
        .where(and(
          inArray(schema.authors.id, affected.map(row => row.id)),
          isNull(schema.authors.deletedAt),
        ))
    },
    buildResult,
  })
}
