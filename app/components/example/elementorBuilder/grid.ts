import type { ColSpan, LayoutPreset, ResponsiveCols } from './types'

/** Static maps so Tailwind can scan complete class names. */
export const COL_BASE: Record<ColSpan, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
}

export const COL_SM: Record<ColSpan, string> = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  10: 'sm:col-span-10',
  11: 'sm:col-span-11',
  12: 'sm:col-span-12',
}

export const COL_MD: Record<ColSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
}

export const COL_LG: Record<ColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
}

export const COL_XL: Record<ColSpan, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
  7: 'xl:col-span-7',
  8: 'xl:col-span-8',
  9: 'xl:col-span-9',
  10: 'xl:col-span-10',
  11: 'xl:col-span-11',
  12: 'xl:col-span-12',
}

export const createCols = (base: ColSpan, overrides: Partial<Omit<ResponsiveCols, 'base'>> = {}): ResponsiveCols => ({
  base,
  ...overrides,
})

/** Build Tailwind col-span classes for a column. */
export const colClasses = (cols: ResponsiveCols): string => {
  const list = [COL_BASE[cols.base]]
  if (cols.sm) list.push(COL_SM[cols.sm])
  if (cols.md) list.push(COL_MD[cols.md])
  if (cols.lg) list.push(COL_LG[cols.lg])
  if (cols.xl) list.push(COL_XL[cols.xl])
  return list.join(' ')
}

export const SECTION_GRID = 'grid grid-cols-12 items-stretch'

export const GAP_CLASS: Record<number, string> = {
  0: 'gap-0',
  4: 'gap-1',
  8: 'gap-2',
  12: 'gap-3',
  16: 'gap-4',
  20: 'gap-5',
  24: 'gap-6',
  32: 'gap-8',
  40: 'gap-10',
  48: 'gap-12',
}

export const gapClass = (gap: number) => GAP_CLASS[gap] ?? 'gap-4'

/** Layout presets → responsive 12-col spans (mobile-first full width). */
export const LAYOUTS: LayoutPreset[] = [
  { id: '1', label: '12', cols: [createCols(12)] },
  { id: '2', label: '6 / 6', cols: [createCols(12, { md: 6 }), createCols(12, { md: 6 })] },
  { id: '3', label: '4 / 4 / 4', cols: [createCols(12, { md: 4 }), createCols(12, { md: 4 }), createCols(12, { md: 4 })] },
  { id: '4', label: '3 / 9', cols: [createCols(12, { md: 3 }), createCols(12, { md: 9 })] },
  { id: '5', label: '9 / 3', cols: [createCols(12, { md: 9 }), createCols(12, { md: 3 })] },
  { id: '6', label: '4 / 8', cols: [createCols(12, { md: 4 }), createCols(12, { md: 8 })] },
  { id: '7', label: '8 / 4', cols: [createCols(12, { md: 8 }), createCols(12, { md: 4 })] },
  { id: '8', label: '2 / 10', cols: [createCols(12, { md: 2 }), createCols(12, { md: 10 })] },
  { id: '9', label: '10 / 2', cols: [createCols(12, { md: 10 }), createCols(12, { md: 2 })] },
  { id: '10', label: '2 / 8 / 2', cols: [createCols(12, { md: 2 }), createCols(12, { md: 8 }), createCols(12, { md: 2 })] },
  { id: '11', label: '3 / 6 / 3', cols: [createCols(12, { md: 3 }), createCols(12, { md: 6 }), createCols(12, { md: 3 })] },
  { id: '12', label: '5 / 7', cols: [createCols(12, { md: 5 }), createCols(12, { md: 7 })] },
  { id: '13', label: '7 / 5', cols: [createCols(12, { md: 7 }), createCols(12, { md: 5 })] },
  { id: '14', label: '3 × 4', cols: [createCols(12, { sm: 6, md: 3 }), createCols(12, { sm: 6, md: 3 }), createCols(12, { sm: 6, md: 3 }), createCols(12, { sm: 6, md: 3 })] },
  { id: '15', label: '6 × 2', cols: [createCols(12, { sm: 6 }), createCols(12, { sm: 6 })] },
  {
    id: '16',
    label: '2 × 6',
    cols: Array.from({ length: 6 }, () => createCols(6, { md: 2 })),
  },
  {
    id: '17',
    label: '3 / 3 / 6',
    cols: [createCols(12, { md: 3 }), createCols(12, { md: 3 }), createCols(12, { md: 6 })],
  },
  {
    id: '18',
    label: '6 / 3 / 3',
    cols: [createCols(12, { md: 6 }), createCols(12, { md: 3 }), createCols(12, { md: 3 })],
  },
  {
    id: '19',
    label: '1 / 11',
    cols: [createCols(12, { md: 1 }), createCols(12, { md: 11 })],
  },
  {
    id: '20',
    label: '5 / 2 / 5',
    cols: [createCols(12, { md: 5 }), createCols(12, { md: 2 }), createCols(12, { md: 5 })],
  },
]

/** Parse "2,8,2" | "2 / 8 / 2" | "2x8" → col spans (1–12). */
export const parseColSpans = (raw: string): ColSpan[] | null => {
  const parts = raw
    .trim()
    .split(/[xX×/,+\s|]+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return null
  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => !Number.isInteger(n) || n < 1 || n > 12)) return null
  return nums as ColSpan[]
}

export const colsFromSpans = (spans: ColSpan[]): ResponsiveCols[] =>
  spans.map((span) => createCols(12, { md: span }))

export const spansSum = (spans: ColSpan[]) => spans.reduce((a, b) => a + b, 0)


export const CANVAS_MAX: { id: string; label: string; class: string; width: string }[] = [
  { id: 'sm', label: 'sm (640)', class: 'max-w-screen-sm', width: '640px' },
  { id: 'md', label: 'md (768)', class: 'max-w-screen-md', width: '768px' },
  { id: 'lg', label: 'lg (1024)', class: 'max-w-screen-lg', width: '1024px' },
  { id: 'xl', label: 'xl (1280)', class: 'max-w-screen-xl', width: '1280px' },
  { id: '1400', label: '1400', class: 'max-w-[1400px]', width: '1400px' },
  { id: '2xl', label: '2xl (1536)', class: 'max-w-screen-2xl', width: '1536px' },
  { id: 'full', label: 'Full', class: 'max-w-none', width: '100%' },
]

export const OBJECT_FIT: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

export const OBJECT_POSITION: Record<string, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
}
