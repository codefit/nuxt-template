import { formatEmail, formatPhone } from './format'

export type FieldRule =
  | { type: 'required', message?: string }
  | { type: 'email', message?: string }
  | { type: 'phone', message?: string }
  | { type: 'min', value: number, message?: string }
  | { type: 'max', value: number, message?: string }
  | { type: 'pattern', value: RegExp, message?: string }
  | { type: 'custom', test: (value: unknown) => boolean | string }

export interface FieldState {
  error: string | null
  valid: boolean
  touched: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Digits-only length after stripping formatting (CZ/SK friendly). */
function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  }
  return digits
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(formatEmail(value))
}

export function isValidPhone(value: string): boolean {
  const digits = phoneDigits(formatPhone(value))
  // +420XXXXXXXXX (12) or national 9
  return digits.length === 9 || digits.length === 12 || digits.length === 13
}

export function runRules(
  value: unknown,
  rules: FieldRule[],
): string | null {
  const str = value == null ? '' : String(value)
  const empty = str.trim() === ''

  for (const rule of rules) {
    if (rule.type === 'required') {
      if (empty) {
        return rule.message ?? 'required'
      }
      continue
    }

    if (empty) {
      continue
    }

    if (rule.type === 'email' && !isValidEmail(str)) {
      return rule.message ?? 'email'
    }

    if (rule.type === 'phone' && !isValidPhone(str)) {
      return rule.message ?? 'phone'
    }

    if (rule.type === 'min' && str.length < rule.value) {
      return rule.message ?? 'min'
    }

    if (rule.type === 'max' && str.length > rule.value) {
      return rule.message ?? 'max'
    }

    if (rule.type === 'pattern' && !rule.value.test(str)) {
      return rule.message ?? 'pattern'
    }

    if (rule.type === 'custom') {
      const result = rule.test(value)
      if (result === false) {
        return 'custom'
      }
      if (typeof result === 'string') {
        return result
      }
    }
  }

  return null
}
