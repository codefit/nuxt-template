/** Predefined Tailwind text colors for quick pickers (complete class strings). */
export const TEXT_COLORS = [
  { id: 'inherit', label: 'Default', class: 'text-neutral-900', swatch: '#171717' },
  { id: 'brand', label: 'Brand', class: 'text-brand-800', swatch: '#064e3b' },
  { id: 'accent', label: 'Accent', class: 'text-accent-400', swatch: '#facc15' },
  { id: 'neutral-500', label: 'Muted', class: 'text-neutral-500', swatch: '#737373' },
  { id: 'neutral-700', label: 'Gray', class: 'text-neutral-700', swatch: '#404040' },
  { id: 'white', label: 'White', class: 'text-white', swatch: '#ffffff' },
  { id: 'red', label: 'Red', class: 'text-red-600', swatch: '#dc2626' },
  { id: 'orange', label: 'Orange', class: 'text-orange-500', swatch: '#f97316' },
  { id: 'amber', label: 'Amber', class: 'text-amber-500', swatch: '#f59e0b' },
  { id: 'yellow', label: 'Yellow', class: 'text-yellow-500', swatch: '#eab308' },
  { id: 'lime', label: 'Lime', class: 'text-lime-600', swatch: '#65a30d' },
  { id: 'green', label: 'Green', class: 'text-green-600', swatch: '#16a34a' },
  { id: 'emerald', label: 'Emerald', class: 'text-emerald-600', swatch: '#059669' },
  { id: 'teal', label: 'Teal', class: 'text-teal-600', swatch: '#0d9488' },
  { id: 'cyan', label: 'Cyan', class: 'text-cyan-600', swatch: '#0891b2' },
  { id: 'sky', label: 'Sky', class: 'text-sky-600', swatch: '#0284c7' },
  { id: 'blue', label: 'Blue', class: 'text-blue-600', swatch: '#2563eb' },
  { id: 'indigo', label: 'Indigo', class: 'text-indigo-600', swatch: '#4f46e5' },
  { id: 'violet', label: 'Violet', class: 'text-violet-600', swatch: '#7c3aed' },
  { id: 'purple', label: 'Purple', class: 'text-purple-600', swatch: '#9333ea' },
  { id: 'fuchsia', label: 'Fuchsia', class: 'text-fuchsia-600', swatch: '#c026d3' },
  { id: 'pink', label: 'Pink', class: 'text-pink-600', swatch: '#db2777' },
  { id: 'rose', label: 'Rose', class: 'text-rose-600', swatch: '#e11d48' },
] as const

export type TextColorClass = (typeof TEXT_COLORS)[number]['class']

/** Background presets for section / column blocks (hex). */
export const BG_COLORS = [
  { id: 'none', label: 'Žádné', hex: '' },
  { id: 'white', label: 'Bílá', hex: '#ffffff' },
  { id: 'slate-50', label: 'Slate 50', hex: '#f8fafc' },
  { id: 'slate-100', label: 'Slate 100', hex: '#f1f5f9' },
  { id: 'neutral-100', label: 'Neutral', hex: '#f5f5f5' },
  { id: 'stone', label: 'Stone', hex: '#f5f5f4' },
  { id: 'brand-soft', label: 'Brand soft', hex: '#ecfdf5' },
  { id: 'sky-soft', label: 'Sky soft', hex: '#f0f9ff' },
  { id: 'violet-soft', label: 'Violet soft', hex: '#f5f3ff' },
  { id: 'rose-soft', label: 'Rose soft', hex: '#fff1f2' },
  { id: 'amber-soft', label: 'Amber soft', hex: '#fffbeb' },
  { id: 'brand', label: 'Brand', hex: '#064e3b' },
  { id: 'slate-900', label: 'Dark', hex: '#0f172a' },
  { id: 'sky', label: 'Sky', hex: '#0ea5e9' },
  { id: 'violet', label: 'Violet', hex: '#7c3aed' },
] as const
