import type {
  AlertData,
  BlockDesign,
  ButtonColor,
  ButtonData,
  ButtonGroupData,
  ButtonVariant,
  ColumnNode,
  HeadingData,
  IconData,
  IconListData,
  ImageData,
  MapsData,
  ProgressData,
  ResponsiveCols,
  SectionNode,
  SocialData,
  SpacerData,
  Spacing,
  StarRatingData,
  TabsData,
  TestimonialsData,
  TextData,
  ToggleData,
  VideoData,
  WidgetNode,
  DividerData,
  AccordionData,
} from './types'
import { TEXT_COLORS } from './colors'
import { iconBoxTone } from './iconTones'
import { CANVAS_MAX } from './grid'

export interface ExportOptions {
  /** CSS max-width for canvas (e.g. 1280px) */
  maxWidth?: string
  title?: string
}

type LucidePack = {
  icons: Record<string, { body: string }>
  width?: number
  height?: number
}

let lucidePack: LucidePack | null = null

const loadLucide = async (): Promise<LucidePack> => {
  if (lucidePack) return lucidePack
  const mod = await import('@iconify-json/lucide')
  lucidePack = mod.icons as LucidePack
  return lucidePack
}

const TEXT_HEX: Record<string, string> = Object.fromEntries(
  TEXT_COLORS.map((c) => [c.class, c.swatch]),
)

const EXTRA_HEX: Record<string, string> = {
  'text-slate-900': '#0f172a',
  'text-slate-800': '#1e293b',
  'text-slate-700': '#334155',
  'text-slate-500': '#64748b',
  'text-slate-400': '#94a3b8',
  'text-neutral-900': '#171717',
  'text-neutral-800': '#262626',
  'text-neutral-700': '#404040',
  'text-neutral-600': '#525252',
  'text-neutral-500': '#737373',
  'text-neutral-400': '#a3a3a3',
  'text-neutral-300': '#d4d4d4',
  'text-sky-700': '#0369a1',
  'text-sky-950': '#082f49',
  'text-emerald-700': '#047857',
  'text-emerald-950': '#022c22',
  'text-amber-400': '#fbbf24',
  'text-amber-700': '#b45309',
  'text-amber-950': '#451a03',
  'text-violet-700': '#6d28d9',
  'text-orange-700': '#c2410c',
  'text-rose-700': '#be123c',
  'text-indigo-700': '#4338ca',
  'text-teal-700': '#0f766e',
  'text-red-950': '#450a0a',
  'fill-amber-400': '#fbbf24',
}

const BG_HEX: Record<string, string> = {
  'bg-violet-100': '#ede9fe',
  'bg-sky-100': '#e0f2fe',
  'bg-emerald-100': '#d1fae5',
  'bg-orange-100': '#ffedd5',
  'bg-rose-100': '#ffe4e6',
  'bg-amber-100': '#fef3c7',
  'bg-indigo-100': '#e0e7ff',
  'bg-teal-100': '#ccfbf1',
  'bg-slate-100': '#f1f5f9',
  'bg-brand-100': '#d1fae5',
  'bg-sky-50': '#f0f9ff',
  'bg-emerald-50': '#ecfdf5',
  'bg-amber-50': '#fffbeb',
  'bg-red-50': '#fef2f2',
  'bg-neutral-200': '#e5e5e5',
}

const colorFromClass = (cls: string): string =>
  TEXT_HEX[cls] ?? EXTRA_HEX[cls] ?? '#171717'

const bgFromClass = (cls: string): string => BG_HEX[cls] ?? '#f1f5f9'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const escapeAttr = (value: string): string => escapeHtml(value).replace(/'/g, '&#39;')

const sidesCss = (spacing: Spacing): string => {
  const m = spacing.margin
  const p = spacing.padding
  return [
    `margin:${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`,
    `padding:${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
  ].join(';')
}

const designCss = (design: BlockDesign): string => {
  const parts = [`border-radius:${design.radius}px`]
  if (design.background) parts.push(`background-color:${design.background}`)
  if (design.radius > 0) parts.push('overflow:hidden')
  return parts.join(';')
}

const blockStyle = (spacing: Spacing, design: BlockDesign): string =>
  `${sidesCss(spacing)};${designCss(design)}`

const colVars = (cols: ResponsiveCols): string => {
  const parts = [`--eb-base:${cols.base}`]
  if (cols.sm) parts.push(`--eb-sm:${cols.sm}`)
  if (cols.md) parts.push(`--eb-md:${cols.md}`)
  if (cols.lg) parts.push(`--eb-lg:${cols.lg}`)
  if (cols.xl) parts.push(`--eb-xl:${cols.xl}`)
  return parts.join(';')
}

const iconKey = (name: string): string | null => {
  const match = name.match(/^i-lucide-(.+)$/)
  return match?.[1] ?? null
}

const iconSvg = (
  pack: LucidePack,
  name: string,
  size: number,
  color: string,
  filled = false,
): string => {
  const key = iconKey(name)
  const body = key ? pack.icons[key]?.body : undefined
  if (!body) {
    return `<span style="display:inline-block;width:${size}px;height:${size}px;background:${color};border-radius:2px;opacity:.35"></span>`
  }
  const fillBody = filled
    ? body.replace(/fill="none"/g, 'fill="currentColor"')
    : body
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;color:${color};flex-shrink:0" aria-hidden="true">${fillBody}</svg>`
}

const headingSizes: Record<HeadingData['tag'], string> = {
  h1: 'font-size:2.25rem;font-weight:700;letter-spacing:-0.025em;line-height:1.15',
  h2: 'font-size:1.875rem;font-weight:700;letter-spacing:-0.025em;line-height:1.2',
  h3: 'font-size:1.5rem;font-weight:600;letter-spacing:-0.025em;line-height:1.25',
  h4: 'font-size:1.25rem;font-weight:600;letter-spacing:-0.025em;line-height:1.3',
  h5: 'font-size:1.125rem;font-weight:600;line-height:1.35',
  h6: 'font-size:1rem;font-weight:600;line-height:1.4',
}

const textSizes: Record<TextData['size'], string> = {
  sm: 'font-size:0.875rem;line-height:1.625',
  base: 'font-size:15px;line-height:1.625',
  lg: 'font-size:1.125rem;line-height:1.625',
}

const buttonCss = (data: {
  color: ButtonColor
  variant: ButtonVariant
  block?: boolean
}): string => {
  const base =
    'display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;border-radius:0.5rem;font-size:0.875rem;font-weight:500;line-height:1.25rem;padding:0.5rem 0.875rem;text-decoration:none;border:1px solid transparent;cursor:pointer;box-sizing:border-box'
  const width = data.block ? 'width:100%' : ''

  const solid: Record<ButtonColor, string> = {
    primary: 'background:#064e3b;color:#fff',
    neutral: 'background:#171717;color:#fff',
    error: 'background:#dc2626;color:#fff',
  }
  const outline: Record<ButtonColor, string> = {
    primary: 'background:transparent;color:#064e3b;border-color:#064e3b',
    neutral: 'background:transparent;color:#171717;border-color:#d4d4d4',
    error: 'background:transparent;color:#dc2626;border-color:#dc2626',
  }
  const soft: Record<ButtonColor, string> = {
    primary: 'background:#ecfdf5;color:#064e3b',
    neutral: 'background:#f5f5f5;color:#171717',
    error: 'background:#fef2f2;color:#dc2626',
  }
  const ghost: Record<ButtonColor, string> = {
    primary: 'background:transparent;color:#064e3b',
    neutral: 'background:transparent;color:#171717',
    error: 'background:transparent;color:#dc2626',
  }
  const link: Record<ButtonColor, string> = {
    primary: 'background:transparent;color:#064e3b;padding:0;text-decoration:underline',
    neutral: 'background:transparent;color:#171717;padding:0;text-decoration:underline',
    error: 'background:transparent;color:#dc2626;padding:0;text-decoration:underline',
  }

  const variants = { solid, outline, soft, ghost, link }
  const tone = variants[data.variant]?.[data.color] ?? solid.primary
  return [base, width, tone].filter(Boolean).join(';')
}

const alertTone = (tone: AlertData['tone']) => {
  const map = {
    info: { border: '#bae6fd', bg: '#f0f9ff', color: '#082f49', icon: 'i-lucide-info' },
    success: { border: '#a7f3d0', bg: '#ecfdf5', color: '#022c22', icon: 'i-lucide-circle-check' },
    warning: { border: '#fde68a', bg: '#fffbeb', color: '#451a03', icon: 'i-lucide-triangle-alert' },
    error: { border: '#fecaca', bg: '#fef2f2', color: '#450a0a', icon: 'i-lucide-circle-x' },
  }
  return map[tone]
}

const objectFit = (fit: ImageData['objectFit']) => fit
const objectPos = (pos: ImageData['objectPosition']) => pos

const blobToDataUrl = async (src: string): Promise<string> => {
  if (!src) return ''
  if (src.startsWith('data:')) return src
  if (!src.startsWith('blob:')) return src
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } catch {
    return ''
  }
}

const resolveImages = async (sections: SectionNode[]): Promise<Map<string, string>> => {
  const map = new Map<string, string>()
  const urls = new Set<string>()
  for (const section of sections) {
    for (const column of section.columns) {
      for (const widget of column.widgets) {
        if (widget.plugin === 'image' && widget.data.src) urls.add(widget.data.src)
      }
    }
  }
  await Promise.all(
    [...urls].map(async (url) => {
      map.set(url, await blobToDataUrl(url))
    }),
  )
  return map
}

const renderHeading = (data: HeadingData): string => {
  const tag = data.tag
  const style = [
    headingSizes[tag],
    `margin:0;max-width:100%;text-wrap:balance`,
    `text-align:${data.align}`,
    `color:${colorFromClass(data.color)}`,
  ].join(';')
  return `<${tag} style="${style}">${escapeHtml(data.text)}</${tag}>`
}

const renderText = (data: TextData): string => {
  const style = [
    textSizes[data.size],
    'margin:0;max-width:100%;white-space:pre-wrap',
    `text-align:${data.align}`,
    `color:${colorFromClass(data.color)}`,
  ].join(';')
  return `<p style="${style}">${escapeHtml(data.text)}</p>`
}

const renderButton = (data: ButtonData): string => {
  const href = data.href?.trim() || '#'
  const label = escapeHtml(data.label || 'Tlačítko')
  const style = buttonCss(data)
  return `<div style="width:100%;text-align:${data.align}"><a class="eb-btn" href="${escapeAttr(href)}" style="${style}">${label}</a></div>`
}

const renderButtonGroup = (data: ButtonGroupData): string => {
  const justify =
    data.align === 'center' ? 'center' : data.align === 'right' ? 'flex-end' : 'flex-start'
  const items = data.items
    .map((item) => {
      const href = item.href?.trim() || '#'
      const label = escapeHtml(item.label || 'Tlačítko')
      const style = buttonCss(item)
      return `<a class="eb-btn" href="${escapeAttr(href)}" style="${style}">${label}</a>`
    })
    .join('')
  return `<div style="display:flex;flex-wrap:wrap;align-items:center;width:100%;gap:${data.gap}px;justify-content:${justify}">${items}</div>`
}

const renderIcon = (pack: LucidePack, data: IconData): string => {
  const tone = iconBoxTone(data.boxTone)
  if (data.boxed) {
    const box = Math.round(data.size * 2.2)
    const svg = iconSvg(pack, data.name, data.size, colorFromClass(tone.icon))
    return `<div style="text-align:${data.align}"><span style="display:inline-flex;align-items:center;justify-content:center;width:${box}px;height:${box}px;border-radius:0.75rem;background:${bgFromClass(tone.box)}">${svg}</span></div>`
  }
  const svg = iconSvg(pack, data.name, data.size, colorFromClass(data.color))
  return `<div style="text-align:${data.align}">${svg}</div>`
}

const renderImage = (data: ImageData, images: Map<string, string>): string => {
  const radius = Math.min(30, Math.max(0, data.radius ?? 0))
  const frame = `position:relative;width:100%;overflow:hidden;height:${data.height}px;border-radius:${radius}px;background:#f1f5f9;box-shadow:0 1px 2px rgba(15,23,42,0.06)`
  const src = images.get(data.src) || data.src
  if (!src) {
    return `<div style="${frame};display:flex;align-items:center;justify-content:center;border:1px dashed #cbd5e1;color:#94a3b8;font-size:12px">Obrázek</div>`
  }
  return `<div style="${frame}"><img src="${escapeAttr(src)}" alt="${escapeAttr(data.alt || 'Obrázek')}" style="width:100%;height:100%;object-fit:${objectFit(data.objectFit)};object-position:${objectPos(data.objectPosition)};display:block"></div>`
}

/** Session video is not inlined (files are large). Export keeps layout frame only. */
const renderVideo = (data: VideoData): string => {
  const radius = Math.min(30, Math.max(0, data.radius ?? 0))
  const frame = `display:flex;align-items:center;justify-content:center;width:100%;height:${data.height}px;border-radius:${radius}px;background:#0f172a;border:1px dashed #475569;color:#94a3b8;font-size:12px;text-align:center;padding:1rem`
  const label = data.src ? 'Video (není v HTML exportu — přidejte soubor ručně)' : 'Video'
  return `<div style="${frame}">${escapeHtml(label)}</div>`
}

const renderMaps = (data: MapsData): string => {
  const q = encodeURIComponent(data.query || 'Praha')
  const z = data.zoom || 14
  const src = `https://maps.google.com/maps?q=${q}&z=${z}&output=embed`
  return `<div style="overflow:hidden;border-radius:0.375rem;background:#f5f5f5"><iframe src="${escapeAttr(src)}" title="${escapeAttr(`Mapa: ${data.query}`)}" style="width:100%;height:${data.height}px;border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
}

const renderIconList = (pack: LucidePack, data: IconListData): string => {
  const items = data.items
    .map((item) => {
      const svg = iconSvg(pack, item.icon, 16, '#064e3b')
      return `<li style="display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;color:#262626">${svg}<span>${escapeHtml(item.text)}</span></li>`
    })
    .join('')
  return `<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.5rem">${items}</ul>`
}

const renderSocial = (pack: LucidePack, data: SocialData): string => {
  const items = data.items
    .map((item) => {
      const svg = iconSvg(pack, item.icon, data.size, '#064e3b')
      const href = item.href?.trim() || '#'
      return `<a href="${escapeAttr(href)}" aria-label="${escapeAttr(item.label)}" style="display:inline-flex;color:#064e3b;text-decoration:none" target="_blank" rel="noopener noreferrer">${svg}</a>`
    })
    .join('')
  return `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem">${items}</div>`
}

const renderDivider = (data: DividerData): string =>
  `<div style="display:flex;width:100%;align-items:center;justify-content:center;padding:0.25rem 0"><hr style="margin:0;border:0;width:${data.width}%;border-top:${data.weight}px ${data.style} ${data.color}"></div>`

const renderSpacer = (data: SpacerData): string =>
  `<div style="width:100%;height:${data.height}px" aria-hidden="true"></div>`

const renderProgress = (data: ProgressData): string => {
  const pct = Math.min(100, Math.max(0, data.value))
  return `<div style="display:flex;flex-direction:column;gap:0.375rem"><div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;font-size:0.875rem"><span style="font-weight:500;color:#262626">${escapeHtml(data.label)}</span><span style="color:#737373">${pct}%</span></div><div style="height:0.625rem;overflow:hidden;border-radius:9999px;background:#e5e5e5"><div style="height:100%;width:${pct}%;border-radius:9999px;background:${data.color}"></div></div></div>`
}

const renderTestimonials = (data: TestimonialsData): string => {
  const items = data.items
    .map((item) => {
      const role = item.role ? ` — ${escapeHtml(item.role)}` : ''
      return `<blockquote style="margin:0;border-left:2px solid #085544;padding-left:1rem"><p style="margin:0 0 0.5rem;font-size:0.875rem;line-height:1.625;color:#404040;font-style:italic">„${escapeHtml(item.quote)}“</p><footer style="font-size:0.75rem;color:#737373"><span style="font-weight:600;color:#262626">${escapeHtml(item.author)}</span>${role}</footer></blockquote>`
    })
    .join('')
  return `<div style="display:flex;flex-direction:column;gap:1rem">${items}</div>`
}

const renderAccordion = (pack: LucidePack, data: AccordionData): string => {
  const chevron = iconSvg(pack, 'i-lucide-chevron-down', 16, '#a3a3a3')
  const items = data.items
    .map((item, index) => {
      const open = index === 0 ? ' open' : ''
      return `<details class="eb-acc"${open} style="border-bottom:1px solid #e5e5e5"><summary style="display:flex;width:100%;align-items:center;justify-content:space-between;gap:0.5rem;padding:0.625rem 0.75rem;list-style:none;cursor:pointer;font-size:0.875rem;font-weight:500;color:#171717">${escapeHtml(item.title)}<span class="eb-acc-ico">${chevron}</span></summary><div style="padding:0 0.75rem 0.75rem;font-size:0.875rem;line-height:1.625;color:#525252">${escapeHtml(item.body)}</div></details>`
    })
    .join('')
  return `<div class="eb-acc-root" style="border:1px solid #e5e5e5;border-radius:0.375rem;overflow:hidden">${items}</div>`
}

const renderToggle = (pack: LucidePack, data: ToggleData): string => {
  const plus = iconSvg(pack, 'i-lucide-plus', 16, '#a3a3a3')
  const minus = iconSvg(pack, 'i-lucide-minus', 16, '#a3a3a3')
  const items = data.items
    .map(
      (item) =>
        `<details class="eb-tog" style="border:1px solid #e5e5e5;border-radius:0.375rem;margin-bottom:0.5rem"><summary style="display:flex;width:100%;align-items:center;justify-content:space-between;gap:0.5rem;padding:0.625rem 0.75rem;list-style:none;cursor:pointer;font-size:0.875rem;font-weight:500;color:#171717">${escapeHtml(item.title)}<span class="eb-tog-plus">${plus}</span><span class="eb-tog-minus">${minus}</span></summary><div style="border-top:1px solid #f5f5f5;padding:0.5rem 0.75rem;font-size:0.875rem;line-height:1.625;color:#525252">${escapeHtml(item.body)}</div></details>`,
    )
    .join('')
  return `<div>${items}</div>`
}

const renderTabs = (data: TabsData): string => {
  const tabs = data.items
    .map((item, index) => {
      const active = index === 0 ? ' is-active' : ''
      return `<button type="button" class="eb-tab${active}" data-tab="${escapeAttr(item.id)}" style="margin-bottom:-1px;border:0;border-bottom:2px solid transparent;background:transparent;padding:0.5rem 0.75rem;font-size:0.875rem;font-weight:500;color:#737373;cursor:pointer">${escapeHtml(item.title)}</button>`
    })
    .join('')
  const panels = data.items
    .map((item, index) => {
      const hide = index === 0 ? '' : ' hidden'
      return `<div class="eb-panel${hide}" data-panel="${escapeAttr(item.id)}" style="font-size:0.875rem;line-height:1.625;color:#404040">${escapeHtml(item.body)}</div>`
    })
    .join('')
  return `<div class="eb-tabs"><div style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.75rem;border-bottom:1px solid #e5e5e5">${tabs}</div>${panels}</div>`
}

const renderAlert = (pack: LucidePack, data: AlertData): string => {
  const tone = alertTone(data.tone)
  const svg = iconSvg(pack, tone.icon, 20, tone.color)
  const title = data.title
    ? `<p style="margin:0;font-size:0.875rem;font-weight:600">${escapeHtml(data.title)}</p>`
    : ''
  return `<div style="display:flex;gap:0.75rem;border-radius:0.375rem;border:1px solid ${tone.border};background:${tone.bg};color:${tone.color};padding:0.75rem">${svg}<div style="min-width:0">${title}<p style="margin:0.125rem 0 0;font-size:0.875rem;line-height:1.625;opacity:0.9">${escapeHtml(data.body)}</p></div></div>`
}

const renderStars = (pack: LucidePack, data: StarRatingData): string => {
  const stars = Array.from({ length: data.max }, (_, i) => {
    const on = i + 1 <= data.value
    return iconSvg(pack, 'i-lucide-star', 20, on ? '#fbbf24' : '#d4d4d4', on)
  }).join('')
  const label = data.label
    ? `<p style="margin:0 0 0.25rem;font-size:0.875rem;font-weight:500;color:#404040">${escapeHtml(data.label)}</p>`
    : ''
  return `<div style="text-align:${data.align}">${label}<div style="display:inline-flex;align-items:center;gap:0.125rem">${stars}</div></div>`
}

const renderWidget = (
  pack: LucidePack,
  widget: WidgetNode,
  images: Map<string, string>,
): string => {
  let inner = ''
  switch (widget.plugin) {
    case 'heading':
      inner = renderHeading(widget.data)
      break
    case 'text':
      inner = renderText(widget.data)
      break
    case 'button':
      inner = renderButton(widget.data)
      break
    case 'button-group':
      inner = renderButtonGroup(widget.data)
      break
    case 'icon':
      inner = renderIcon(pack, widget.data)
      break
    case 'image':
      inner = renderImage(widget.data, images)
      break
    case 'video':
      inner = renderVideo(widget.data)
      break
    case 'maps':
      inner = renderMaps(widget.data)
      break
    case 'icon-list':
      inner = renderIconList(pack, widget.data)
      break
    case 'social':
      inner = renderSocial(pack, widget.data)
      break
    case 'divider':
      inner = renderDivider(widget.data)
      break
    case 'spacer':
      inner = renderSpacer(widget.data)
      break
    case 'progress':
      inner = renderProgress(widget.data)
      break
    case 'testimonials':
      inner = renderTestimonials(widget.data)
      break
    case 'accordion':
      inner = renderAccordion(pack, widget.data)
      break
    case 'toggle':
      inner = renderToggle(pack, widget.data)
      break
    case 'tabs':
      inner = renderTabs(widget.data)
      break
    case 'alert':
      inner = renderAlert(pack, widget.data)
      break
    case 'star-rating':
      inner = renderStars(pack, widget.data)
      break
  }
  return `<div class="eb-widget" style="${sidesCss(widget.spacing)}">${inner}</div>`
}

const renderColumn = (
  pack: LucidePack,
  column: ColumnNode,
  images: Map<string, string>,
): string => {
  const card =
    column.surface === 'card'
      ? 'height:100%;border-radius:1rem;background:#fff;box-shadow:0 10px 40px rgba(15,23,42,0.06);outline:1px solid #f1f5f9'
      : 'height:100%'
  const widgets = column.widgets.map((w) => renderWidget(pack, w, images)).join('')
  return `<div class="eb-col" style="${colVars(column.cols)};${card};${blockStyle(column.spacing, column.design)}">${widgets}</div>`
}

const renderSection = (
  pack: LucidePack,
  section: SectionNode,
  images: Map<string, string>,
): string => {
  const cols = section.columns.map((c) => renderColumn(pack, c, images)).join('')
  return `<section class="eb-section" style="${blockStyle(section.spacing, section.design)}"><div class="eb-grid" style="gap:${section.gap}px">${cols}</div></section>`
}

const baseCss = (maxWidth: string): string => `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#262626;background:#f7f8fa;line-height:1.5}
img,svg,iframe{max-width:100%}
.eb-page{max-width:${maxWidth};margin:0 auto;padding:1.5rem 1rem 3rem;width:100%}
.eb-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));align-items:stretch}
.eb-col{min-width:0;grid-column:span var(--eb-base)/span var(--eb-base)}
@media(min-width:640px){.eb-col{grid-column:span var(--eb-sm,var(--eb-base))/span var(--eb-sm,var(--eb-base))}}
@media(min-width:768px){.eb-col{grid-column:span var(--eb-md,var(--eb-sm,var(--eb-base)))/span var(--eb-md,var(--eb-sm,var(--eb-base)))}}
@media(min-width:1024px){.eb-col{grid-column:span var(--eb-lg,var(--eb-md,var(--eb-sm,var(--eb-base))))/span var(--eb-lg,var(--eb-md,var(--eb-sm,var(--eb-base))))}}
@media(min-width:1280px){.eb-col{grid-column:span var(--eb-xl,var(--eb-lg,var(--eb-md,var(--eb-sm,var(--eb-base)))))/span var(--eb-xl,var(--eb-lg,var(--eb-md,var(--eb-sm,var(--eb-base)))))}}
.eb-acc summary::-webkit-details-marker,.eb-tog summary::-webkit-details-marker{display:none}
.eb-acc[open] .eb-acc-ico{transform:rotate(180deg);display:inline-flex}
.eb-acc-ico{display:inline-flex;transition:transform .15s ease}
.eb-tog-minus{display:none}
.eb-tog[open] .eb-tog-plus{display:none}
.eb-tog[open] .eb-tog-minus{display:inline-flex}
.eb-tog-plus{display:inline-flex}
.eb-tab.is-active{border-bottom-color:#064e3b!important;color:#064e3b!important}
.eb-panel[hidden]{display:none!important}
.eb-btn:hover{opacity:.92}
`.trim()

const tabsScript = `
document.querySelectorAll('.eb-tabs').forEach(function(root){
  var tabs=root.querySelectorAll('.eb-tab');
  var panels=root.querySelectorAll('.eb-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var id=tab.getAttribute('data-tab');
      tabs.forEach(function(t){t.classList.toggle('is-active',t===tab)});
      panels.forEach(function(p){p.hidden=p.getAttribute('data-panel')!==id});
    });
  });
});
document.querySelectorAll('.eb-acc-root').forEach(function(root){
  root.querySelectorAll('details.eb-acc').forEach(function(item){
    item.addEventListener('toggle',function(){
      if(!item.open) return;
      root.querySelectorAll('details.eb-acc').forEach(function(other){
        if(other!==item) other.open=false;
      });
    });
  });
});
`.trim()

const resolveMaxWidth = (maxWidth?: string): string => {
  if (maxWidth && maxWidth !== '100%') return maxWidth
  if (maxWidth === '100%') return '100%'
  return CANVAS_MAX.find((c) => c.id === 'xl')?.width ?? '1280px'
}

/** Build a self-contained HTML preview document from builder sections. */
export const buildPreviewHtml = async (
  sections: SectionNode[],
  options: ExportOptions = {},
): Promise<string> => {
  const pack = await loadLucide()
  const images = await resolveImages(sections)
  const body = sections.map((s) => renderSection(pack, s, images)).join('\n')
  const maxWidth = resolveMaxWidth(options.maxWidth)
  const title = escapeHtml(options.title ?? 'PageBuilder preview')
  const empty = !sections.length
    ? '<p style="text-align:center;color:#737373;padding:4rem 1rem">Prázdný dokument</p>'
    : body

  return `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${baseCss(maxWidth)}
</style>
</head>
<body>
<main class="eb-page">
${empty}
</main>
<script>
${tabsScript}
</script>
</body>
</html>`
}

/** Trigger browser download of the preview HTML file. */
export const downloadPreviewHtml = async (
  sections: SectionNode[],
  options: ExportOptions = {},
): Promise<void> => {
  const html = await buildPreviewHtml(sections, options)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `pagebuilder-preview-${new Date().toISOString().slice(0, 10)}.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
