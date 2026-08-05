import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { Language } from '#shared/types/db'
import { SEED_LANGUAGES } from '~~/server/services/seed/data'

let byId: Map<number, Language> | null = null
let byCode: Map<string, Language> | null = null
let defaultId: number | null = null

function now(): Date {
  return new Date()
}

async function ensureLanguages(): Promise<void> {
  const existing = await db.select().from(schema.languages)
  const byExisting = new Map(existing.map(row => [row.code, row]))
  const stamp = now()

  for (const lang of SEED_LANGUAGES) {
    if (byExisting.has(lang.code)) {
      continue
    }

    await db.insert(schema.languages).values({
      code: lang.code,
      name: lang.name,
      icon: lang.icon,
      isActive: 1,
      isDefault: lang.isDefault,
      createdAt: stamp,
      updatedAt: stamp,
    })
  }
}

async function load(): Promise<Map<string, Language>> {
  if (byCode) {
    return byCode
  }

  await ensureLanguages()

  const rows = await db
    .select()
    .from(schema.languages)
    .where(eq(schema.languages.isActive, 1))

  byCode = new Map(rows.map(row => [row.code, row]))
  byId = new Map(rows.map(row => [row.id, row]))
  defaultId = rows.find(row => row.isDefault === 1)?.id ?? rows[0]?.id ?? null

  return byCode
}

export function clearLanguageCache(): void {
  byCode = null
  byId = null
  defaultId = null
}

export async function getLanguagesByCode(): Promise<ReadonlyMap<string, Language>> {
  return load()
}

export async function getLanguageId(code: string): Promise<number | null> {
  const map = await load()
  return map.get(code)?.id ?? null
}

export async function requireLanguageId(code: string): Promise<number> {
  const id = await getLanguageId(code)
  if (id === null) {
    throw createError({
      statusCode: 404,
      message: `Language "${code}" is not available.`,
    })
  }
  return id
}

export async function getDefaultLanguageId(): Promise<number> {
  await load()
  if (defaultId === null) {
    throw createError({
      statusCode: 500,
      message: 'Default language is not registered.',
    })
  }
  return defaultId
}

export async function getDefaultLanguage(): Promise<Language> {
  await load()
  const id = await getDefaultLanguageId()
  const language = byId?.get(id)
  if (!language) {
    throw createError({
      statusCode: 500,
      message: 'Default language is not registered.',
    })
  }
  return language
}

export async function getLanguageCode(id: number): Promise<string | null> {
  await load()
  return byId?.get(id)?.code ?? null
}

export async function getLanguageIdMap(): Promise<Record<string, number>> {
  const map = await load()
  const result: Record<string, number> = {}
  for (const [code, row] of map) {
    result[code] = row.id
  }
  return result
}

export async function getActiveLanguages(): Promise<Language[]> {
  const map = await load()
  return [...map.values()]
}
