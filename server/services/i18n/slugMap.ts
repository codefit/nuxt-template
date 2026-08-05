import { and, eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { EntityKey } from '#shared/types/dto/entity'
import type { LocaleSlugMap } from '#shared/types/i18n/localeSwitch'

/** Entities that own a `slugId` column pointing at `slugs`. */
const SLUG_TABLES = {
  article: schema.articles,
} as const satisfies Partial<Record<EntityKey, typeof schema.articles>>

type SlugEntity = keyof typeof SLUG_TABLES

export function hasSlugEntity(entity: string): entity is SlugEntity {
  return entity in SLUG_TABLES
}

/**
 * Resolve all locale URL slugs for an entity row identified by any language slug.
 */
export async function getEntitySlugMap(
  entity: EntityKey,
  slug: string,
): Promise<LocaleSlugMap | null> {
  if (!hasSlugEntity(entity)) {
    return null
  }

  const owner = SLUG_TABLES[entity]

  const [hit] = await db
    .select({ slugId: schema.slugTranslations.slugId })
    .from(schema.slugTranslations)
    .innerJoin(owner, eq(owner.slugId, schema.slugTranslations.slugId))
    .where(eq(schema.slugTranslations.content, slug))
    .limit(1)

  if (!hit) {
    return null
  }

  const rows = await db
    .select({
      code: schema.languages.code,
      content: schema.slugTranslations.content,
    })
    .from(schema.slugTranslations)
    .innerJoin(schema.languages, eq(schema.languages.id, schema.slugTranslations.languageId))
    .where(
      and(
        eq(schema.slugTranslations.slugId, hit.slugId),
        eq(schema.languages.isActive, 1),
      ),
    )

  const map: LocaleSlugMap = {}
  for (const row of rows) {
    if (row.content) {
      map[row.code] = row.content
    }
  }

  return Object.keys(map).length > 0 ? map : null
}
