/** Where an image variant is consumed (public site vs admin UI). */
export const ImageSurface = {
  CLIENT: 'client',
  DASHBOARD: 'dashboard',
} as const

export type ImageSurface = (typeof ImageSurface)[keyof typeof ImageSurface]

export function isImageSurface(value: string): value is ImageSurface {
  return Object.values(ImageSurface).includes(value as ImageSurface)
}
