import { eq, inArray } from 'drizzle-orm'
import { Entity, ENTITY_KEYS } from '#shared/types/dto/entity'
import {
  SEED_ARTICLES,
  SEED_CONSTANTS,
  SEED_LANGUAGES,
  type SeedLocale,
} from '~~/server/services/seed/data'

type Hub = typeof import('@nuxthub/db')
type Db = Hub['db']
type Schema = Hub['schema']

export type SeedResult = {
  languages: number
  entities: number
  articles: number
  constants: number
  skippedArticles: boolean
  syncedSlugs: number
  users: number
}

/** Default test admin — override via SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD. */
export const SEED_ADMIN = {
  email: 'admin@example.com',
  password: 'Admin123!',
  name: 'Admin',
} as const

function stamp(): Date {
  return new Date()
}

async function seedLanguages(db: Db, schema: Schema): Promise<number> {
  const existing = await db.select().from(schema.languages)
  const byCode = new Map(existing.map(row => [row.code, row]))
  let touched = 0
  const now = stamp()

  for (const lang of SEED_LANGUAGES) {
    if (byCode.has(lang.code)) {
      continue
    }

    await db.insert(schema.languages).values({
      code: lang.code,
      name: lang.name,
      icon: lang.icon,
      isActive: 1,
      isDefault: lang.isDefault,
      createdAt: now,
      updatedAt: now,
    })
    touched++
  }

  return touched
}

async function seedEntities(db: Db, schema: Schema): Promise<number> {
  const existing = await db.select({ key: schema.entities.key }).from(schema.entities)
  const have = new Set(existing.map(row => row.key))
  const missing = ENTITY_KEYS.filter(key => !have.has(key))

  if (missing.length === 0) {
    return 0
  }

  const now = stamp()
  await db.insert(schema.entities).values(
    missing.map(key => ({
      key,
      createdAt: now,
      updatedAt: now,
    })),
  )

  return missing.length
}

async function createText(
  db: Db,
  schema: Schema,
  translations: { languageId: number, content: string }[],
): Promise<number> {
  const now = stamp()
  const [text] = await db
    .insert(schema.texts)
    .values({ createdAt: now, updatedAt: now })
    .returning()

  await db.insert(schema.textTranslations).values(
    translations.map(item => ({
      textId: text.id,
      languageId: item.languageId,
      content: item.content,
      createdAt: now,
      updatedAt: now,
    })),
  )

  return text.id
}

async function createSlug(
  db: Db,
  schema: Schema,
  translations: { languageId: number, name: string, content: string }[],
): Promise<number> {
  const now = stamp()
  const [slug] = await db
    .insert(schema.slugs)
    .values({ createdAt: now, updatedAt: now })
    .returning()

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

  return slug.id
}

async function createLongText(
  db: Db,
  schema: Schema,
  translations: { languageId: number, content: string }[],
): Promise<number> {
  const now = stamp()
  const [longText] = await db
    .insert(schema.longTexts)
    .values({ createdAt: now, updatedAt: now })
    .returning()

  await db.insert(schema.longTextTranslations).values(
    translations.map(item => ({
      longTextId: longText.id,
      languageId: item.languageId,
      content: item.content,
      createdAt: now,
      updatedAt: now,
    })),
  )

  return longText.id
}

/**
 * Remove existing articles + metas + orphaned i18n rows (texts / slugs / long_texts).
 * Deleting articles alone leaves slug_translations and breaks unique (languageId, content).
 */
async function clearArticles(db: Db, schema: Schema, entityId: number): Promise<void> {
  const rows = await db
    .select({
      nameId: schema.articles.nameId,
      slugId: schema.articles.slugId,
      excerptId: schema.articles.excerptId,
    })
    .from(schema.articles)

  const metas = await db
    .select({
      contentLongId: schema.metas.contentLongId,
      metaTitleId: schema.metas.metaTitleId,
      metaDescriptionId: schema.metas.metaDescriptionId,
      metaKeywordsId: schema.metas.metaKeywordsId,
    })
    .from(schema.metas)
    .where(eq(schema.metas.entityId, entityId))

  const textIds = new Set<number>()
  const longIds = new Set<number>()

  for (const row of rows) {
    textIds.add(row.nameId)
    if (row.excerptId) {
      textIds.add(row.excerptId)
    }
  }

  for (const meta of metas) {
    if (meta.metaTitleId) {
      textIds.add(meta.metaTitleId)
    }
    if (meta.metaDescriptionId) {
      textIds.add(meta.metaDescriptionId)
    }
    if (meta.metaKeywordsId) {
      textIds.add(meta.metaKeywordsId)
    }
    if (meta.contentLongId) {
      longIds.add(meta.contentLongId)
    }
  }

  await db.delete(schema.metas).where(eq(schema.metas.entityId, entityId))
  await db.delete(schema.articles)

  // Slugs are article-only — wipe all (incl. orphans from a previous failed seed).
  await db.delete(schema.slugs)

  if (textIds.size > 0) {
    await db.delete(schema.texts).where(inArray(schema.texts.id, [...textIds]))
  }
  if (longIds.size > 0) {
    await db.delete(schema.longTexts).where(inArray(schema.longTexts.id, [...longIds]))
  }
}

function localeCodes(
  locales: (typeof SEED_ARTICLES)[number]['locales'],
): SeedLocale[] {
  return (Object.keys(locales) as SeedLocale[]).filter(code => Boolean(locales[code]))
}

async function seedArticles(
  db: Db,
  schema: Schema,
): Promise<{ created: number, skipped: boolean, syncedSlugs: number }> {
  const languages = await db.select().from(schema.languages)
  const languageIds = Object.fromEntries(languages.map(row => [row.code, row.id])) as Record<
    SeedLocale,
    number
  >

  for (const code of SEED_LANGUAGES.map(item => item.code)) {
    if (!languageIds[code]) {
      throw new Error(`Seed language "${code}" is missing.`)
    }
  }

  const [entity] = await db
    .select()
    .from(schema.entities)
    .where(eq(schema.entities.key, Entity.ARTICLE))
    .limit(1)

  if (!entity) {
    throw new Error(`Entity "${Entity.ARTICLE}" is missing.`)
  }

  await clearArticles(db, schema, entity.id)

  let created = 0

  for (const article of SEED_ARTICLES) {
    if (!article.locales.cs) {
      throw new Error('Seed article is missing required CS translation.')
    }

    const now = stamp()
    const codes = localeCodes(article.locales)

    const nameId = await createText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.name,
      })),
    )

    const excerptId = await createText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.excerpt,
      })),
    )

    const slugId = await createSlug(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        name: article.locales[code]!.name,
        content: article.locales[code]!.slug,
      })),
    )

    const contentLongId = await createLongText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.body,
      })),
    )

    const metaTitleId = await createText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.metaTitle,
      })),
    )

    const metaDescriptionId = await createText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.metaDescription,
      })),
    )

    const metaKeywordsId = await createText(
      db,
      schema,
      codes.map(code => ({
        languageId: languageIds[code],
        content: article.locales[code]!.metaKeywords,
      })),
    )

    const publishedAt = new Date(article.publishedAt)
    const [row] = await db
      .insert(schema.articles)
      .values({
        nameId,
        slugId,
        excerptId,
        isPublished: 1,
        publishedAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    await db.insert(schema.metas).values({
      entityId: entity.id,
      modelId: row.id,
      contentLongId,
      metaTitleId,
      metaDescriptionId,
      metaKeywordsId,
      createdAt: now,
      updatedAt: now,
    })

    created++
  }

  return { created, skipped: false, syncedSlugs: 0 }
}

async function seedConstants(db: Db, schema: Schema): Promise<number> {
  if (!schema.constants) {
    throw new Error('Schema is missing constants table.')
  }

  const existing = await db
    .select({ key: schema.constants.key })
    .from(schema.constants)
  const have = new Set(existing.map(row => row.key))
  const missing = SEED_CONSTANTS.filter(item => !have.has(item.key))

  if (missing.length === 0) {
    return 0
  }

  const now = stamp()
  await db.insert(schema.constants).values(
    missing.map(item => ({
      group: item.group,
      key: item.key,
      type: item.type,
      value: item.value,
      label: item.label,
      description: item.description,
      isActive: item.isActive,
      isPrivate: item.isPrivate,
      createdAt: now,
      updatedAt: now,
    })),
  )

  return missing.length
}

async function seedAdmin(db: Db, schema: Schema): Promise<number> {
  if (!schema.users) {
    throw new Error('Schema is missing users table.')
  }

  const email = (
    process.env.SEED_ADMIN_EMAIL
    || SEED_ADMIN.email
  ).trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || SEED_ADMIN.password
  const name = process.env.SEED_ADMIN_NAME || SEED_ADMIN.name

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)

  if (existing.length > 0) {
    return 0
  }

  const { hashPlain } = await import('~~/server/services/auth/password')
  const passwordHash = await hashPlain(password)
  const now = stamp()

  await db.insert(schema.users).values({
    email,
    passwordHash,
    name,
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  })

  return 1
}

/**
 * Languages + entities upsert; articles are wiped and recreated from SEED_ARTICLES.
 * CS translation is always present; SK/EN may be missing on purpose.
 * Admin user is upserted once (skipped if email already exists).
 */
export async function seedDatabase(opts?: { db?: Db, schema?: Schema }): Promise<SeedResult> {
  const hub = opts?.db && opts?.schema ? null : await import('@nuxthub/db')
  const db = opts?.db ?? hub!.db
  const schema = opts?.schema ?? hub!.schema

  const languages = await seedLanguages(db, schema)
  const entities = await seedEntities(db, schema)
  const constants = await seedConstants(db, schema)
  const users = await seedAdmin(db, schema)
  const articles = await seedArticles(db, schema)

  return {
    languages,
    entities,
    constants,
    articles: articles.created,
    skippedArticles: articles.skipped,
    syncedSlugs: articles.syncedSlugs,
    users,
  }
}
