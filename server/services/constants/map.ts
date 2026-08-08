import type { ConstantDetail, ConstantGroupKey, ConstantTypeKey } from '#shared/types/dto/constant'

type Row = {
  id: number
  group: string
  key: string
  type: string
  value: string
  label: string
  description: string | null
  isActive: number
  isPrivate: number
  createdAt: Date
  updatedAt: Date
}

export function mapConstant(row: Row): ConstantDetail {
  return {
    id: row.id,
    group: row.group as ConstantGroupKey,
    key: row.key,
    type: row.type as ConstantTypeKey,
    value: row.value,
    label: row.label,
    description: row.description,
    isActive: row.isActive === 1,
    isPrivate: row.isPrivate === 1,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
