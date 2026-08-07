import type { UserPublic, UserRole } from '#shared/types/dto/user'

type UserRow = {
  id: number
  email: string
  name: string
  role: string
}

export function toUserPublic(row: UserRow): UserPublic {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: (row.role === 'user' ? 'user' : 'admin') as UserRole,
  }
}

export function toSessionUser(row: UserRow) {
  return toUserPublic(row)
}
