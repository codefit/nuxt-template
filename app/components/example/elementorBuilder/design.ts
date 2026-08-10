import type { BlockDesign } from './types'

export const createDesign = (background = '', radius = 16): BlockDesign => ({
  background,
  radius,
})

export const designStyle = (design: BlockDesign): Record<string, string> => {
  const style: Record<string, string> = {
    borderRadius: `${design.radius}px`,
  }
  if (design.background) {
    style.backgroundColor = design.background
  }
  if (design.radius > 0) {
    style.overflow = 'hidden'
  }
  return style
}
