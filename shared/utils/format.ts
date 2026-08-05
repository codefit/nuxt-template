/** Collapse whitespace and lowercase domain part of an e-mail. */
export function formatEmail(raw: string): string {
  let value = raw.trim().replace(/\s+/g, '')

  // "info@seznam cz" / "info@seznamcz" → prefer dotted TLD when space before TLD
  value = value.replace(/@([^\s@.]+)\s+([a-z]{2,})$/i, '@$1.$2')

  const at = value.lastIndexOf('@')
  if (at === -1) {
    return value.toLowerCase()
  }

  const local = value.slice(0, at)
  const domain = value.slice(at + 1).toLowerCase()

  return `${local}@${domain}`
}

/**
 * Normalize phone to `+420 XXX XXX XXX` when possible.
 * Accepts: +420…, 00420…, national 9-digit CZ/SK, spaced variants.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '')

  let national = digits
  if (national.startsWith('+')) {
    national = national.slice(1)
  }
  if (national.startsWith('00')) {
    national = national.slice(2)
  }

  // CZ / SK country code
  if (national.startsWith('420') && national.length >= 12) {
    return groupPhone('420', national.slice(3))
  }
  if (national.startsWith('421') && national.length >= 12) {
    return groupPhone('421', national.slice(3))
  }

  // Bare 9-digit mobile
  if (/^\d{9}$/.test(national)) {
    return groupPhone('420', national)
  }

  // Fallback: keep digits with leading + if present
  if (digits.startsWith('+') || digits.startsWith('00')) {
    return `+${national}`
  }

  return raw.trim()
}

function groupPhone(cc: string, rest: string): string {
  const clean = rest.replace(/\D/g, '')
  if (clean.length === 9) {
    return `+${cc} ${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`
  }
  return `+${cc}${clean}`
}

/** Strip spaces from numbers; keep one decimal separator. */
export function formatNumber(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '')
  const normalized = trimmed.replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return trimmed
  }
  return normalized
}
