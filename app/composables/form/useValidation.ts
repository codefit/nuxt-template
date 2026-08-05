import type { FieldRule, FieldState } from '#shared/utils/validate'
import { runRules } from '#shared/utils/validate'
import { formatEmail, formatNumber, formatPhone } from '#shared/utils/format'

export type FormatKind = 'email' | 'phone' | 'number' | 'none'

export interface ValidationFieldConfig {
  rules?: FieldRule[]
  format?: FormatKind
}

export type ValidationSchema = Record<string, ValidationFieldConfig>

/**
 * Shared client validation — errors + green valid state per field.
 * Resource forms pass a schema; section-specific rules stay in the form.
 */
export function useValidation<T extends Record<string, unknown>>(
  model: Ref<T> | T,
  schema: ValidationSchema,
) {
  const states = reactive<Record<string, FieldState>>({})

  for (const key of Object.keys(schema)) {
    states[key] = { error: null, valid: false, touched: false }
  }

  function read(path: string): unknown {
    const source = isRef(model) ? model.value : model
    const parts = path.split('.')
    let current: unknown = source
    for (const part of parts) {
      if (current == null || typeof current !== 'object') {
        return undefined
      }
      current = (current as Record<string, unknown>)[part]
    }
    return current
  }

  function write(path: string, value: unknown): void {
    const source = (isRef(model) ? model.value : model) as Record<string, unknown>
    const parts = path.split('.')
    let current: Record<string, unknown> = source
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]!
      if (current[part] == null || typeof current[part] !== 'object') {
        current[part] = {}
      }
      current = current[part] as Record<string, unknown>
    }
    current[parts[parts.length - 1]!] = value
  }

  function ensure(path: string): FieldState {
    if (!states[path]) {
      states[path] = { error: null, valid: false, touched: false }
    }
    return states[path]!
  }

  function validateField(path: string, touch = true): boolean {
    const config = schema[path]
    const state = ensure(path)
    if (touch) {
      state.touched = true
    }

    if (!config) {
      state.error = null
      state.valid = false
      return true
    }

    const value = read(path)
    const error = runRules(value, config.rules ?? [])
    state.error = error
    const empty = value == null || String(value).trim() === ''
    state.valid = !error && !empty && (config.rules?.length ?? 0) > 0
    return !error
  }

  function validateAll(paths?: string[]): boolean {
    const keys = paths ?? Object.keys(schema)
    let ok = true
    for (const key of keys) {
      if (!validateField(key, true)) {
        ok = false
      }
    }
    return ok
  }

  function blur(path: string): void {
    const config = schema[path]
    if (config?.format && config.format !== 'none') {
      const raw = String(read(path) ?? '')
      if (raw.trim()) {
        if (config.format === 'email') {
          write(path, formatEmail(raw))
        }
        else if (config.format === 'phone') {
          write(path, formatPhone(raw))
        }
        else if (config.format === 'number') {
          write(path, formatNumber(raw))
        }
      }
    }
    validateField(path, true)
  }

  function setError(path: string, message: string | null): void {
    const state = ensure(path)
    state.error = message
    state.touched = true
    state.valid = false
  }

  function applyServerErrors(errors: Record<string, string>): void {
    for (const [path, message] of Object.entries(errors)) {
      setError(path, message)
    }
  }

  function reset(): void {
    for (const key of Object.keys(states)) {
      states[key] = { error: null, valid: false, touched: false }
    }
  }

  function fieldUi(path: string) {
    const state = ensure(path)
    return {
      error: state.touched ? state.error ?? undefined : undefined,
      valid: state.touched && state.valid,
    }
  }

  return {
    states,
    validateField,
    validateAll,
    blur,
    setError,
    applyServerErrors,
    reset,
    fieldUi,
  }
}
