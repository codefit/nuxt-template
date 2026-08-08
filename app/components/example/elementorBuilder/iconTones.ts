/** Pastel icon chip backgrounds (static Tailwind classes). */
export const ICON_BOX_TONES = [
  { id: 'violet', label: 'Violet', box: 'bg-violet-100', icon: 'text-violet-700' },
  { id: 'sky', label: 'Sky', box: 'bg-sky-100', icon: 'text-sky-700' },
  { id: 'mint', label: 'Mint', box: 'bg-emerald-100', icon: 'text-emerald-700' },
  { id: 'peach', label: 'Peach', box: 'bg-orange-100', icon: 'text-orange-700' },
  { id: 'rose', label: 'Rose', box: 'bg-rose-100', icon: 'text-rose-700' },
  { id: 'amber', label: 'Amber', box: 'bg-amber-100', icon: 'text-amber-700' },
  { id: 'indigo', label: 'Indigo', box: 'bg-indigo-100', icon: 'text-indigo-700' },
  { id: 'teal', label: 'Teal', box: 'bg-teal-100', icon: 'text-teal-700' },
  { id: 'slate', label: 'Slate', box: 'bg-slate-100', icon: 'text-slate-700' },
  { id: 'brand', label: 'Brand', box: 'bg-brand-100', icon: 'text-brand-800' },
] as const

export type IconBoxToneId = (typeof ICON_BOX_TONES)[number]['id']

export const iconBoxTone = (id: string) =>
  ICON_BOX_TONES.find((t) => t.id === id) ?? ICON_BOX_TONES[1]!
