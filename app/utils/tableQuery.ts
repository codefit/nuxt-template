import type {
  TableDateRange,
  TableFilter,
  TableFilterValue,
  TableFilters,
} from '#shared/types/ui/data-table'

// --- Types ------------------------------------------------------------------

export type FilterParseKind = 'multi' | 'range'

// --- Filter activity / labels -----------------------------------------------

export function isDateRange(value: unknown): value is TableDateRange {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && ('from' in value || 'to' in value)
  )
}

export function isFilterActive(value: TableFilterValue): boolean {
  if (value === undefined || value === '') {
    return false
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (isDateRange(value)) {
    return Boolean(value.from || value.to)
  }

  return true
}

export function activeFilterCount(values: TableFilters): number {
  return Object.values(values).filter(isFilterActive).length
}

function findOption(
  options: TableFilter['options'],
  value: string,
): { label: string, value: string } | undefined {
  if (!options?.length) {
    return undefined
  }

  for (const option of options) {
    if (option.value === value) {
      return option
    }

    const child = option.children?.find(entry => entry.value === value)

    if (child) {
      return child
    }
  }

  return undefined
}

export function filterLabel(
  field: TableFilter,
  value: TableFilterValue,
): string | undefined {
  if (!isFilterActive(value)) {
    return undefined
  }

  if (typeof value === 'boolean') {
    return value ? field.label : undefined
  }

  if (field.type === 'boolean') {
    return field.label
  }

  if (isDateRange(value)) {
    const from = value.from ?? '…'
    const to = value.to ?? '…'
    return `${field.label}: ${from} – ${to}`
  }

  if (Array.isArray(value)) {
    const labels = value.map((entry) => {
      const option = findOption(field.options, entry)
      return option?.label ?? entry
    })

    return `${field.label}: ${labels.join(', ')}`
  }

  if (typeof value !== 'string') {
    return undefined
  }

  if (field.type === 'select') {
    const option = findOption(field.options, value)
    return `${field.label}: ${option?.label ?? value}`
  }

  return `${field.label}: ${value}`
}

// --- Wire codec (URL ↔ filter value) ----------------------------------------

export function serializeFilterValue(value: TableFilterValue): string | undefined {
  if (!isFilterActive(value)) {
    return undefined
  }

  if (isDateRange(value)) {
    return `${value.from ?? ''}..${value.to ?? ''}`
  }

  if (Array.isArray(value)) {
    return value.join(',')
  }

  return String(value)
}

export function parseFilterValue(
  raw: string,
  kind?: FilterParseKind,
): TableFilterValue {
  if (kind === 'range' || raw.includes('..')) {
    const [from = '', to = ''] = raw.split('..')
    const range: TableDateRange = {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    }

    return isFilterActive(range) ? range : undefined
  }

  if (raw === 'true' || raw === 'false') {
    return raw === 'true'
  }

  if (kind === 'multi') {
    return raw.split(',').map(part => part.trim()).filter(Boolean)
  }

  return raw
}
