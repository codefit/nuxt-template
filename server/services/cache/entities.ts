import { db, schema } from '@nuxthub/db'
import { ENTITY_KEYS, type EntityKey } from '#shared/types/entity'
import type { Entity } from '#shared/types/db'

let byKey: Map<string, Entity> | null = null
let byId: Map<number, Entity> | null = null

function now(): Date {
  return new Date()
}

async function ensureEntities(): Promise<void> {
  const existing = await db.select({ key: schema.entities.key }).from(schema.entities)
  const have = new Set(existing.map(row => row.key))
  const missing = ENTITY_KEYS.filter(key => !have.has(key))

  if (missing.length === 0) {
    return
  }

  const stamp = now()
  await db.insert(schema.entities).values(
    missing.map(key => ({
      key,
      createdAt: stamp,
      updatedAt: stamp,
    })),
  )
}

async function load(): Promise<Map<string, Entity>> {
  if (byKey) {
    return byKey
  }

  await ensureEntities()

  const rows = await db.select().from(schema.entities)
  byKey = new Map(rows.map(row => [row.key, row]))
  byId = new Map(rows.map(row => [row.id, row]))

  return byKey
}

export function clearEntityCache(): void {
  byKey = null
  byId = null
}

export async function getEntitiesByKey(): Promise<ReadonlyMap<string, Entity>> {
  return load()
}

export async function getEntityId(key: EntityKey): Promise<number | null> {
  const map = await load()
  return map.get(key)?.id ?? null
}

export async function requireEntityId(key: EntityKey): Promise<number> {
  const id = await getEntityId(key)
  if (id === null) {
    throw createError({
      statusCode: 500,
      message: `Entity "${key}" is not registered.`,
    })
  }
  return id
}

export async function getEntityKey(id: number): Promise<string | null> {
  await load()
  return byId?.get(id)?.key ?? null
}

export async function getEntityIdMap(): Promise<Record<EntityKey, number>> {
  const map = await load()
  const result = {} as Record<EntityKey, number>

  for (const key of ENTITY_KEYS) {
    const row = map.get(key)
    if (!row) {
      throw createError({
        statusCode: 500,
        message: `Entity "${key}" is not registered.`,
      })
    }
    result[key] = row.id
  }

  return result
}
