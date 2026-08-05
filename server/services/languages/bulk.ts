import { and, eq, inArray, ne } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { LanguageListItem } from '#shared/types/language'
import type { BulkResult, TableFilters, TableSelection } from '#shared/types/data-table'
import type { ResourceBulkResponse } from '#shared/types/resource'
import { clearLanguageCache } from '~~/server/services/cache/languages'
import { mapLanguage } from '~~/server/services/languages/map'
import { resolveLanguageSelection } from '~~/server/services/languages/selection'
import { runResourceBulk } from '~~/server/utils/bulkRun'

const ACTIONS = [
  'export',
  'activate',
  'deactivate',
] as const

export type LanguageBulkAction = (typeof ACTIONS)[number]

const ACTION_LABELS: Record<LanguageBulkAction, string> = {
  export: 'Export',
  activate: 'Aktivovat',
  deactivate: 'Deaktivovat',
}

export interface LanguageBulkInput {
  action: LanguageBulkAction
  selection: TableSelection
  filters?: TableFilters
}

export function isLanguageBulkAction(value: string): value is LanguageBulkAction {
  return (ACTIONS as readonly string[]).includes(value)
}

function buildResult(
  action: LanguageBulkAction,
  affected: LanguageListItem[],
  matchedTotal: number,
): BulkResult {
  const active = affected.filter(row => row.isActive).length

  return {
    title: ACTION_LABELS[action],
    description: `Hotovo pro ${affected.length} z ${matchedTotal} filtrovaných jazyků.`,
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
        label: 'Active',
        value: active,
        icon: 'i-lucide-globe',
        color: 'success',
      },
    ],
    items: affected.slice(0, 8).map(row => ({
      title: row.name,
      description: row.code,
      badge: `#${row.id}`,
    })),
  }
}

async function applyMutation(
  action: Exclude<LanguageBulkAction, 'export'>,
  rows: LanguageListItem[],
): Promise<void> {
  if (!rows.length) {
    return
  }

  const now = new Date()

  if (action === 'activate') {
    await db
      .update(schema.languages)
      .set({
        isActive: 1,
        updatedAt: now,
      })
      .where(inArray(schema.languages.id, rows.map(row => row.id)))
    return
  }

  // Never deactivate the default language — skip those rows.
  const ids = rows.filter(row => !row.isDefault).map(row => row.id)
  if (!ids.length) {
    return
  }

  await db
    .update(schema.languages)
    .set({
      isActive: 0,
      updatedAt: now,
    })
    .where(and(
      inArray(schema.languages.id, ids),
      ne(schema.languages.isDefault, 1),
      eq(schema.languages.isActive, 1),
    ))
}

/**
 * Apply bulk action to filtered language selection (include / exclude).
 * No delete — languages are FK roots for translations.
 */
export async function runLanguageBulk(
  input: LanguageBulkInput,
): Promise<ResourceBulkResponse> {
  return runResourceBulk({
    action: input.action,
    selection: input.selection,
    filters: input.filters,
    resolve: async (selection, filters) => {
      const resolved = await resolveLanguageSelection(selection, filters)
      return {
        matchedTotal: resolved.matchedTotal,
        affected: resolved.affected.map(mapLanguage),
      }
    },
    mutate: async (action, affected) => {
      if (action === 'export') {
        return
      }

      await applyMutation(action, affected)
      clearLanguageCache()
    },
    buildResult,
  })
}
