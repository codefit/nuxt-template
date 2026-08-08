import { and, eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ConstantPublicMap } from '#shared/types/dto/constant'

let byKey: Map<string, string> | null = null

async function load(): Promise<Map<string, string>> {
  if (byKey) {
    return byKey
  }

  const rows = await db
    .select({
      key: schema.constants.key,
      value: schema.constants.value,
    })
    .from(schema.constants)
    .where(and(
      eq(schema.constants.isActive, 1),
      eq(schema.constants.isPrivate, 0),
    ))

  byKey = new Map(rows.map(row => [row.key, row.value]))
  return byKey
}

/** Drop in-memory public constants cache (call after any CRUD). */
export function clearConstantCache(): void {
  byKey = null
}

export async function getPublicConstants(): Promise<ConstantPublicMap> {
  const map = await load()
  return Object.fromEntries(map)
}

export async function getConstant(key: string): Promise<string | undefined> {
  const map = await load()
  return map.get(key)
}
