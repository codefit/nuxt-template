import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type {
  ConstantGroupKey,
  ConstantGroupSummary,
  ConstantListItem,
} from '#shared/types/dto/constant'
import { CONSTANT_GROUPS } from '#shared/types/dto/constant'
import { mapConstant } from '~~/server/services/constants/map'

function searchSql(q: string | undefined): SQL | undefined {
  const term = q?.trim()
  if (!term) {
    return undefined
  }

  const pattern = `%${term}%`
  return or(
    ilike(schema.constants.key, pattern),
    ilike(schema.constants.label, pattern),
    ilike(schema.constants.value, pattern),
    ilike(schema.constants.description, pattern),
  )
}

/**
 * Fresh admin list for one group (no cache). Optional search `q`.
 */
export async function listConstants(input: {
  group: ConstantGroupKey
  q?: string
}): Promise<ConstantListItem[]> {
  const where = and(
    eq(schema.constants.group, input.group),
    searchSql(input.q),
  )

  const rows = await db
    .select()
    .from(schema.constants)
    .where(where)
    .orderBy(asc(schema.constants.label), asc(schema.constants.key))

  return rows.map(mapConstant)
}

/** Counts per known group (zeros included). */
export async function listConstantGroups(): Promise<ConstantGroupSummary[]> {
  const rows = await db
    .select({
      group: schema.constants.group,
      count: count(),
    })
    .from(schema.constants)
    .groupBy(schema.constants.group)

  const byGroup = new Map(rows.map(row => [row.group, Number(row.count)]))

  return CONSTANT_GROUPS.map(group => ({
    group,
    count: byGroup.get(group) ?? 0,
  }))
}
