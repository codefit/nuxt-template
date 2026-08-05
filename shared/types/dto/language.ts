export type LanguageOption = {
  code: string
  icon: string | null
  name: string
  isDefault: boolean
}

export type LanguageListItem = {
  id: number
  code: string
  icon: string | null
  name: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type LanguageFormInput = {
  icon: string | null
  name: string
  isActive: boolean
  isDefault: boolean
}

export type LanguageAdminDetail = LanguageListItem
