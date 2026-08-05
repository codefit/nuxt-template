/** Long date for article meta (e.g. 4. srpna 2026). */
export function formatDate(value: string | Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value instanceof Date ? value : new Date(value))
}
