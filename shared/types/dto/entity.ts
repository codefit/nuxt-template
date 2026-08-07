/**
 * Polymorphic model registry keys — use `Entity.ARTICLE`, never raw strings.
 * Maps to `entities.key` for indexed joins (metas, media, …).
 */
export const Entity = {
  ARTICLE: 'article',
  AUTHOR: 'author',
  MESSAGE: 'message',
  PAGE: 'page',
} as const

export type EntityKey = (typeof Entity)[keyof typeof Entity]

export const ENTITY_KEYS = Object.values(Entity) as EntityKey[]

export function isEntityKey(value: string): value is EntityKey {
  return (ENTITY_KEYS as readonly string[]).includes(value)
}
