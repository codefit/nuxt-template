import { and, eq, inArray, isNotNull, like, ne, or } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { slugify } from '#shared/utils/slug'

function stamp(): Date {
  return new Date()
}

function uniqueIds(ids: (number | null | undefined)[]): number[] {
  return [...new Set(ids.filter((id): id is number => id != null))]
}

export async function createText(
  translations: { languageId: number, content: string }[],
): Promise<number> {
  const now = stamp()
  const [text] = await db
    .insert(schema.texts)
    .values({ createdAt: now, updatedAt: now })
    .returning()

  if (!text) {
    throw createError({ statusCode: 500, message: 'Text insert failed.' })
  }

  if (translations.length) {
    await db.insert(schema.textTranslations).values(
      translations.map(item => ({
        textId: text.id,
        languageId: item.languageId,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })),
    )
  }

  return text.id
}

/**
 * Sync text translations: upsert provided, delete missing language rows.
 * Creates a new text identity when `textId` is null.
 */
export async function syncText(
  textId: number | null | undefined,
  translations: { languageId: number, content: string }[],
): Promise<number | null> {
  if (!translations.length) {
    return textId ?? null
  }

  const now = stamp()

  if (!textId) {
    return createText(translations)
  }

  await db
    .update(schema.texts)
    .set({ updatedAt: now })
    .where(eq(schema.texts.id, textId))

  const existing = await db
    .select()
    .from(schema.textTranslations)
    .where(eq(schema.textTranslations.textId, textId))

  const byLang = new Map(existing.map(row => [row.languageId, row]))
  const keep = new Set(translations.map(item => item.languageId))

  for (const item of translations) {
    const row = byLang.get(item.languageId)
    if (row) {
      await db
        .update(schema.textTranslations)
        .set({ content: item.content, updatedAt: now })
        .where(eq(schema.textTranslations.id, row.id))
    }
    else {
      await db.insert(schema.textTranslations).values({
        textId,
        languageId: item.languageId,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  for (const row of existing) {
    if (!keep.has(row.languageId)) {
      await db
        .delete(schema.textTranslations)
        .where(eq(schema.textTranslations.id, row.id))
    }
  }

  return textId
}

/** languageId → content for one text identity. */
export type TextLangMap = Record<number, string>

/** textId → language map. One SELECT for all ids. */
export async function loadTextMaps(
  ids: (number | null | undefined)[],
): Promise<Record<number, TextLangMap>> {
  const textIds = uniqueIds(ids)
  if (!textIds.length) {
    return {}
  }

  const rows = await db
    .select({
      textId: schema.textTranslations.textId,
      languageId: schema.textTranslations.languageId,
      content: schema.textTranslations.content,
    })
    .from(schema.textTranslations)
    .where(inArray(schema.textTranslations.textId, textIds))

  const maps: Record<number, TextLangMap> = {}
  for (const id of textIds) {
    maps[id] = {}
  }
  for (const row of rows) {
    maps[row.textId]![row.languageId] = row.content
  }

  return maps
}

export async function loadTextMap(
  textId: number | null | undefined,
): Promise<TextLangMap> {
  if (!textId) {
    return {}
  }

  const maps = await loadTextMaps([textId])
  return maps[textId] ?? {}
}

export async function createLongText(
  translations: { languageId: number, content: string }[],
): Promise<number> {
  const now = stamp()
  const [longText] = await db
    .insert(schema.longTexts)
    .values({ createdAt: now, updatedAt: now })
    .returning()

  if (!longText) {
    throw createError({ statusCode: 500, message: 'Long text insert failed.' })
  }

  if (translations.length) {
    await db.insert(schema.longTextTranslations).values(
      translations.map(item => ({
        longTextId: longText.id,
        languageId: item.languageId,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })),
    )
  }

  return longText.id
}

export async function syncLongText(
  longTextId: number | null | undefined,
  translations: { languageId: number, content: string }[],
): Promise<number | null> {
  if (!translations.length) {
    return longTextId ?? null
  }

  const now = stamp()

  if (!longTextId) {
    return createLongText(translations)
  }

  await db
    .update(schema.longTexts)
    .set({ updatedAt: now })
    .where(eq(schema.longTexts.id, longTextId))

  const existing = await db
    .select()
    .from(schema.longTextTranslations)
    .where(eq(schema.longTextTranslations.longTextId, longTextId))

  const byLang = new Map(existing.map(row => [row.languageId, row]))
  const keep = new Set(translations.map(item => item.languageId))

  for (const item of translations) {
    const row = byLang.get(item.languageId)
    if (row) {
      await db
        .update(schema.longTextTranslations)
        .set({ content: item.content, updatedAt: now })
        .where(eq(schema.longTextTranslations.id, row.id))
    }
    else {
      await db.insert(schema.longTextTranslations).values({
        longTextId,
        languageId: item.languageId,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  for (const row of existing) {
    if (!keep.has(row.languageId)) {
      await db
        .delete(schema.longTextTranslations)
        .where(eq(schema.longTextTranslations.id, row.id))
    }
  }

  return longTextId
}

/** longTextId → language map. One SELECT for all ids. */
export async function loadLongTextMaps(
  ids: (number | null | undefined)[],
): Promise<Record<number, TextLangMap>> {
  const longTextIds = uniqueIds(ids)
  if (!longTextIds.length) {
    return {}
  }

  const rows = await db
    .select({
      longTextId: schema.longTextTranslations.longTextId,
      languageId: schema.longTextTranslations.languageId,
      content: schema.longTextTranslations.content,
    })
    .from(schema.longTextTranslations)
    .where(inArray(schema.longTextTranslations.longTextId, longTextIds))

  const maps: Record<number, TextLangMap> = {}
  for (const id of longTextIds) {
    maps[id] = {}
  }
  for (const row of rows) {
    maps[row.longTextId]![row.languageId] = row.content
  }

  return maps
}

export async function loadLongTextMap(
  longTextId: number | null | undefined,
): Promise<TextLangMap> {
  if (!longTextId) {
    return {}
  }

  const maps = await loadLongTextMaps([longTextId])
  return maps[longTextId] ?? {}
}

export async function createSlug(
  translations: { languageId: number, name: string, content: string }[],
): Promise<number> {
  const now = stamp()
  const [slug] = await db
    .insert(schema.slugs)
    .values({ createdAt: now, updatedAt: now })
    .returning()

  if (!slug) {
    throw createError({ statusCode: 500, message: 'Slug insert failed.' })
  }

  if (translations.length) {
    await db.insert(schema.slugTranslations).values(
      translations.map(item => ({
        slugId: slug.id,
        languageId: item.languageId,
        name: item.name,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })),
    )
  }

  return slug.id
}

export async function syncSlug(
  slugId: number | null | undefined,
  translations: { languageId: number, name: string, content: string }[],
): Promise<number | null> {
  if (!translations.length) {
    return slugId ?? null
  }

  const now = stamp()

  if (!slugId) {
    return createSlug(translations)
  }

  await db
    .update(schema.slugs)
    .set({ updatedAt: now })
    .where(eq(schema.slugs.id, slugId))

  const existing = await db
    .select()
    .from(schema.slugTranslations)
    .where(eq(schema.slugTranslations.slugId, slugId))

  const byLang = new Map(existing.map(row => [row.languageId, row]))
  const keep = new Set(translations.map(item => item.languageId))

  for (const item of translations) {
    const row = byLang.get(item.languageId)
    if (row) {
      await db
        .update(schema.slugTranslations)
        .set({
          name: item.name,
          content: item.content,
          updatedAt: now,
        })
        .where(eq(schema.slugTranslations.id, row.id))
    }
    else {
      await db.insert(schema.slugTranslations).values({
        slugId,
        languageId: item.languageId,
        name: item.name,
        content: item.content,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  for (const row of existing) {
    if (!keep.has(row.languageId)) {
      await db
        .delete(schema.slugTranslations)
        .where(eq(schema.slugTranslations.id, row.id))
    }
  }

  return slugId
}

export type SlugLangMap = Record<number, { name: string, content: string }>

/** slugId → language map. One SELECT for all ids. */
export async function loadSlugMaps(
  ids: (number | null | undefined)[],
): Promise<Record<number, SlugLangMap>> {
  const slugIds = uniqueIds(ids)
  if (!slugIds.length) {
    return {}
  }

  const rows = await db
    .select({
      slugId: schema.slugTranslations.slugId,
      languageId: schema.slugTranslations.languageId,
      name: schema.slugTranslations.name,
      content: schema.slugTranslations.content,
    })
    .from(schema.slugTranslations)
    .where(inArray(schema.slugTranslations.slugId, slugIds))

  const maps: Record<number, SlugLangMap> = {}
  for (const id of slugIds) {
    maps[id] = {}
  }
  for (const row of rows) {
    maps[row.slugId]![row.languageId] = {
      name: row.name,
      content: row.content ?? '',
    }
  }

  return maps
}

export async function loadSlugMap(
  slugId: number | null | undefined,
): Promise<SlugLangMap> {
  if (!slugId) {
    return {}
  }

  const maps = await loadSlugMaps([slugId])
  return maps[slugId] ?? {}
}

/**
 * Slugs that can collide with `candidate` (exact stem + `stem-N` variants).
 * Does not load every slug for the language.
 */
export async function listSlugContents(
  languageId: number,
  candidate: string,
  excludeSlugId?: number | null,
): Promise<string[]> {
  const desired = slugify(candidate)
  if (!desired) {
    return []
  }

  const stem = desired.replace(/-\d+$/, '') || desired
  const parts = [
    eq(schema.slugTranslations.languageId, languageId),
    isNotNull(schema.slugTranslations.content),
    or(
      eq(schema.slugTranslations.content, stem),
      like(schema.slugTranslations.content, `${stem}-%`),
    ),
  ]

  if (excludeSlugId != null) {
    parts.push(ne(schema.slugTranslations.slugId, excludeSlugId))
  }

  const rows = await db
    .select({ content: schema.slugTranslations.content })
    .from(schema.slugTranslations)
    .where(and(...parts))

  return rows
    .map(row => row.content)
    .filter((content): content is string => Boolean(content))
}
