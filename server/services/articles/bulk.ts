import { and, inArray, isNull } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ArticleListItem } from '#shared/types/article'
import type { BulkResult, TableFilters, TableSelection } from '#shared/types/data-table'
import type { ResourceBulkResponse } from '#shared/types/resource'
import { runResourceBulk } from '~~/server/utils/bulkRun'
import { resolveArticleSelection } from './selection'

const ACTIONS = [
  'export',
  'publish',
  'unpublish',
  'archive',
  'delete',
] as const

export type ArticleBulkAction = (typeof ACTIONS)[number]

const ACTION_LABELS: Record<ArticleBulkAction, string> = {
  export: 'Export',
  publish: 'Publikovat',
  unpublish: 'Koncept',
  archive: 'Archivovat',
  delete: 'Smazat',
}

export interface ArticleBulkInput {
  action: ArticleBulkAction
  selection: TableSelection
  filters?: TableFilters
  locale: string
}

export function isArticleBulkAction(value: string): value is ArticleBulkAction {
  return (ACTIONS as readonly string[]).includes(value)
}

function buildResult(
  action: ArticleBulkAction,
  affected: ArticleListItem[],
  matchedTotal: number,
): BulkResult {
  const published = affected.filter(row => row.isPublished).length

  return {
    title: ACTION_LABELS[action],
    description: `Hotovo pro ${affected.length} z ${matchedTotal} filtrovaných článků.`,
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
        label: 'Published',
        value: published,
        icon: 'i-lucide-globe',
        color: 'success',
      },
    ],
    items: affected.slice(0, 8).map(row => ({
      title: row.title,
      description: row.slug,
      badge: `#${row.id}`,
    })),
  }
}

async function applyMutation(
  action: Exclude<ArticleBulkAction, 'export'>,
  ids: number[],
): Promise<void> {
  if (!ids.length) {
    return
  }

  const now = new Date()
  const where = and(
    inArray(schema.articles.id, ids),
    isNull(schema.articles.deletedAt),
  )

  if (action === 'publish') {
    await db
      .update(schema.articles)
      .set({
        isPublished: 1,
        archivedAt: null,
        updatedAt: now,
      })
      .where(where)
    return
  }

  if (action === 'unpublish') {
    await db
      .update(schema.articles)
      .set({
        isPublished: 0,
        updatedAt: now,
      })
      .where(where)
    return
  }

  if (action === 'archive') {
    await db
      .update(schema.articles)
      .set({
        isPublished: 0,
        archivedAt: now,
        updatedAt: now,
      })
      .where(where)
    return
  }

  await db
    .update(schema.articles)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(where)
}

/**
 * Apply bulk action to filtered article selection (include / exclude).
 */
export async function runArticleBulk(
  input: ArticleBulkInput,
): Promise<ResourceBulkResponse> {
  return runResourceBulk({
    action: input.action,
    selection: input.selection,
    filters: input.filters,
    resolve: (selection, filters) =>
      resolveArticleSelection(selection, filters, input.locale),
    mutate: async (action, affected) => {
      if (action === 'export') {
        return
      }

      await applyMutation(action, affected.map(row => row.id))
    },
    buildResult,
  })
}
