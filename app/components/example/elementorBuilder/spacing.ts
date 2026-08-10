import type { BoxSides, Spacing } from './types'

export const emptyBox = (): BoxSides => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

/** Default inner padding for sections (matches editor + preview). */
export const SECTION_PAD = 32
/** Default inner padding for columns / cards. */
export const COLUMN_PAD = 24

export const createSpacing = (pad = 0): Spacing => ({
  margin: emptyBox(),
  padding: { top: pad, right: pad, bottom: pad, left: pad },
})

export const createSectionSpacing = (pad = SECTION_PAD): Spacing => {
  const spacing = createSpacing(pad)
  spacing.margin.bottom = 24
  return spacing
}

export const createColumnSpacing = (pad = COLUMN_PAD): Spacing => createSpacing(pad)

export const boxCss = (box: BoxSides, prefix: 'margin' | 'padding') => ({
  [`${prefix}Top`]: `${box.top}px`,
  [`${prefix}Right`]: `${box.right}px`,
  [`${prefix}Bottom`]: `${box.bottom}px`,
  [`${prefix}Left`]: `${box.left}px`,
})

export const spacingStyle = (spacing: Spacing): Record<string, string> => ({
  ...boxCss(spacing.margin, 'margin'),
  ...boxCss(spacing.padding, 'padding'),
})
