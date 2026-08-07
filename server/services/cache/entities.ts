import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { Entity, ENTITY_KEYS, type EntityKey } from '#shared/types/dto/entity'
import type { Entity as EntityRow } from '#shared/types/db'

export { Entity }

let byKey: Map<string, EntityRow> | null = null
let byId: Map<number, EntityRow> | null = null

function now(): Date {
  return new Date()
}

export function clearEntityCache(): void {
  byKey = null
  byId = null
}

async function insertKey(key: EntityKey): Promise<EntityRow> {
  const stamp = now()
  const [row] = await db
    .insert(schema.entities)
    .values({
      key,
      createdAt: stamp,
      updatedAt: stamp,
    })
    .onConflictDoNothing({ target: schema.entities.key })
    .returning()

  if (row) {
    return row
  }

  const [existing] = await db
    .select()
    .from(schema.entities)
    .where(eq(schema.entities.key, key))
    .limit(1)

  if (!existing) {
    throw createError({
      statusCode: 500,
      message: `Entity "${key}" could not be created.`,
    })
  }

  return existing
}

/**
 * Ensure every registered `Entity.*` key exists in DB, then hydrate cache.
 * Callers should prefer `getEntity(Entity.ARTICLE)` over raw strings.
 */
async function load(): Promise<Map<string, EntityRow>> {
  if (byKey) {
    return byKey
  }

  const existing = await db.select().from(schema.entities)
  const have = new Set(existing.map(row => row.key))
  const missing = ENTITY_KEYS.filter(key => !have.has(key))

  if (missing.length > 0) {
    const stamp = now()
    await db.insert(schema.entities).values(
      missing.map(key => ({
        key,
        createdAt: stamp,
        updatedAt: stamp,
      })),
    ).onConflictDoNothing({ target: schema.entities.key })

    clearEntityCache()
    const rows = await db.select().from(schema.entities)
    byKey = new Map(rows.map(row => [row.key, row]))
    byId = new Map(rows.map(row => [row.id, row]))
    return byKey
  }

  byKey = new Map(existing.map(row => [row.key, row]))
  byId = new Map(existing.map(row => [row.id, row]))
  return byKey
}

/**
 * Facade: resolve entity row by typed key.
 * Creates the registry row on first miss, invalidates cache, returns the new row.
 */
export async function getEntity(key: EntityKey): Promise<EntityRow> {
  const map = await load()
  const cached = map.get(key)
  if (cached) {
    return cached
  }

  const created = await insertKey(key)
  clearEntityCache()
  const refreshed = await load()
  const row = refreshed.get(key) ?? created
  return row
}

export async function getEntitiesByKey(): Promise<ReadonlyMap<string, EntityRow>> {
  return load()
}

export async function getEntityId(key: EntityKey): Promise<number | null> {
  const row = await getEntity(key)
  return row.id
}

export async function requireEntityId(key: EntityKey): Promise<number> {
  const row = await getEntity(key)
  return row.id
}

export async function getEntityKey(id: number): Promise<string | null> {
  await load()
  return byId?.get(id)?.key ?? null
}

export async function getEntityIdMap(): Promise<Record<EntityKey, number>> {
  await load()
  const result = {} as Record<EntityKey, number>

  for (const key of ENTITY_KEYS) {
    result[key] = (await getEntity(key)).id
  }

  return result
}
