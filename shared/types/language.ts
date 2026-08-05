export type LanguageOption = {
  code: string
  name: string
  icon: string | null
  isDefault: boolean
}

export type LanguageListItem = {
  id: number
  code: string
  name: string
  icon: string | null
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type LanguageFormInput = {
  name: string
  icon: string | null
  isActive: boolean
  isDefault: boolean
}

export type LanguageAdminDetail = LanguageListItem
