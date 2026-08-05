import { inArray } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Message } from '#shared/types/db'
import type { BulkResult, TableFilters, TableSelection } from '#shared/types/ui/data-table'
import type { ResourceBulkResponse } from '#shared/types/ui/resource'
import { runResourceBulk } from '~~/server/utils/bulkRun'
import { resolveMessageSelection } from './selection'

const ACTIONS = [
  'export',
  'delete',
] as const

export type MessageBulkAction = (typeof ACTIONS)[number]

const ACTION_LABELS: Record<MessageBulkAction, string> = {
  export: 'Export',
  delete: 'Smazat',
}

export interface MessageBulkInput {
  action: MessageBulkAction
  filters?: TableFilters
  selection: TableSelection
}

export function isMessageBulkAction(value: string): value is MessageBulkAction {
  return (ACTIONS as readonly string[]).includes(value)
}

function buildResult(
  action: MessageBulkAction,
  affected: Message[],
  matchedTotal: number,
): BulkResult {
  const emails = new Set(affected.map(row => row.email))

  return {
    title: ACTION_LABELS[action],
    description: `Hotovo pro ${affected.length} z ${matchedTotal} filtrovaných zpráv.`,
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
      {
        label: 'E-maily',
        value: emails.size,
        icon: 'i-lucide-mail',
        color: 'success',
      },
    ],
    items: affected.slice(0, 8).map(row => ({
      title: row.name,
      description: row.email,
      badge: `#${row.id}`,
    })),
  }
}

/**
 * Apply bulk action to filtered message selection (include / exclude).
 * Schema supports hard delete + export only (no read/archive columns yet).
 */
export async function runMessageBulk(
  input: MessageBulkInput,
): Promise<ResourceBulkResponse> {
  return runResourceBulk({
    action: input.action,
    selection: input.selection,
    filters: input.filters,
    resolve: resolveMessageSelection,
    mutate: async (action, affected) => {
      if (action !== 'delete' || !affected.length) {
        return
      }

      await db
        .delete(schema.messages)
        .where(inArray(schema.messages.id, affected.map(row => row.id)))
    },
    buildResult,
  })
}
