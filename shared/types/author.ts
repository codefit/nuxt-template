export interface AuthorOption {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export interface AuthorFormInput {
  name: string
  email?: string | null
  phone?: string | null
}

export type AuthorDetail = AuthorOption & {
  createdAt: string
  updatedAt: string
}
