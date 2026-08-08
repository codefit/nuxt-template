/** Setting groups for dashboard constants. */
export const ConstantGroup = {
  COMPANY: 'company',
  ANALYTICS: 'analytics',
  CONTACT: 'contact',
  GENERAL: 'general',
} as const

export type ConstantGroupKey = (typeof ConstantGroup)[keyof typeof ConstantGroup]

export const CONSTANT_GROUPS = [
  ConstantGroup.COMPANY,
  ConstantGroup.ANALYTICS,
  ConstantGroup.CONTACT,
  ConstantGroup.GENERAL,
] as const

export function isConstantGroup(value: string): value is ConstantGroupKey {
  return (CONSTANT_GROUPS as readonly string[]).includes(value)
}

/** Value storage type — extend as needed. */
export const ConstantType = {
  TEXT: 'text',
} as const

export type ConstantTypeKey = (typeof ConstantType)[keyof typeof ConstantType]

export interface ConstantFormInput {
  group: ConstantGroupKey
  key: string
  type: ConstantTypeKey
  value: string
  label: string
  description?: string | null
  isActive: boolean
  isPrivate: boolean
}

export interface ConstantListItem {
  id: number
  group: ConstantGroupKey
  key: string
  type: ConstantTypeKey
  value: string
  label: string
  description: string | null
  isActive: boolean
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export type ConstantDetail = ConstantListItem

/** Active + public constants for client render (key → value). */
export type ConstantPublicMap = Record<string, string>

export interface ConstantGroupSummary {
  group: ConstantGroupKey
  count: number
}
