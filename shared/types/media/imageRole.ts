/** Processed image variant role (source vs derived sizes). */
export const ImageRole = {
  ORIGINAL: 'ORIGINAL',
  PREVIEW: 'PREVIEW',
  DETAIL: 'DETAIL',
  EDIT: 'EDIT',
} as const

export type ImageRole = (typeof ImageRole)[keyof typeof ImageRole]

export function isImageRole(value: string): value is ImageRole {
  return Object.values(ImageRole).includes(value as ImageRole)
}
