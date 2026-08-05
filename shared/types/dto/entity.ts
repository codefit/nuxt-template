/** Registry keys for `entities.key` — map to table / model names. */
export const ENTITY_KEYS = [
  'article',
  'author',
  'message',
  'page',
] as const

export type EntityKey = (typeof ENTITY_KEYS)[number]

export function isEntityKey(value: string): value is EntityKey {
  return (ENTITY_KEYS as readonly string[]).includes(value)
}
