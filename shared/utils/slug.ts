/** ASCII slug from free text (accents stripped). */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Ensure slug is unique among `taken`.
 * On collision appends `-1`, `-2`, … using a stable stem (strips trailing `-\d+`
 * so re-running never produces `article-1-1`).
 * Pass `exclude` on edit so the row keeps its own slug.
 */
export function ensureUniqueSlug(
  candidate: string,
  taken: Iterable<string>,
  exclude?: string | null,
): string {
  const desired = slugify(candidate)
  if (!desired) {
    return ''
  }

  const blocked = new Set(
    [...taken].map(item => item.trim()).filter(item => item && item !== exclude),
  )

  if (!blocked.has(desired)) {
    return desired
  }

  const stem = desired.replace(/-\d+$/, '') || desired
  const re = new RegExp(`^${escapeRegex(stem)}-(\\d+)$`)
  let max = 0

  for (const item of blocked) {
    if (item === stem) {
      max = Math.max(max, 0)
    }
    const match = item.match(re)
    if (match) {
      max = Math.max(max, Number(match[1]))
    }
  }

  return `${stem}-${max + 1}`
}
