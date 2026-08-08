export type PluginId =
  | 'heading'
  | 'text'
  | 'button'
  | 'button-group'
  | 'icon'
  | 'image'
  | 'video'
  | 'maps'
  | 'icon-list'
  | 'social'
  | 'divider'
  | 'spacer'
  | 'progress'
  | 'testimonials'
  | 'accordion'
  | 'toggle'
  | 'tabs'
  | 'alert'
  | 'star-rating'

export type Selection =
  | { kind: 'section'; sectionId: string }
  | { kind: 'column'; sectionId: string; columnId: string }
  | { kind: 'widget'; sectionId: string; columnId: string; widgetId: string }
  | null

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TextAlign = 'left' | 'center' | 'right'
export type AlertTone = 'info' | 'success' | 'warning' | 'error'
export type ButtonColor = 'primary' | 'neutral' | 'error'
export type ButtonVariant = 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
export type ObjectPosition = 'center' | 'top' | 'bottom' | 'left' | 'right'
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type CanvasMaxId = 'sm' | 'md' | 'lg' | 'xl' | '1400' | '2xl' | 'full'

/** Mobile-first Tailwind col-span config (12-col grid). */
export interface ResponsiveCols {
  base: ColSpan
  sm?: ColSpan
  md?: ColSpan
  lg?: ColSpan
  xl?: ColSpan
}

export interface BoxSides {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Spacing {
  margin: BoxSides
  padding: BoxSides
}

export interface HeadingData {
  text: string
  tag: HeadingTag
  align: TextAlign
  /** Full Tailwind text-* class */
  color: string
}

export interface TextData {
  text: string
  align: TextAlign
  color: string
  size: 'sm' | 'base' | 'lg'
}

export interface ButtonData {
  label: string
  href: string
  color: ButtonColor
  variant: ButtonVariant
  align: TextAlign
  block: boolean
}

export interface ButtonGroupItem {
  id: string
  label: string
  href: string
  color: ButtonColor
  variant: ButtonVariant
}

export interface ButtonGroupData {
  items: ButtonGroupItem[]
  align: TextAlign
  /** Gap between buttons in px */
  gap: number
}

export interface IconData {
  name: string
  size: number
  align: TextAlign
  color: string
  /** Soft pastel chip behind icon (category-card style) */
  boxed: boolean
  boxTone: string
}

export interface ImageData {
  /** blob: URL — session only, never uploaded */
  src: string
  alt: string
  objectFit: ObjectFit
  objectPosition: ObjectPosition
  /** Frame height in px; width is always 100% of column */
  height: number
  /** Border radius 0–30 px */
  radius: number
}

export interface VideoData {
  /** blob: URL — session only, never uploaded */
  src: string
  /** Frame height in px; width is always 100% of column */
  height: number
  /** Border radius 0–30 px */
  radius: number
  objectFit: ObjectFit
  controls: boolean
  autoplay: boolean
  muted: boolean
  loop: boolean
}

export interface MapsData {
  query: string
  height: number
  zoom: number
}

export interface IconListItem {
  id: string
  icon: string
  text: string
}

export interface IconListData {
  items: IconListItem[]
}

export interface SocialItem {
  id: string
  icon: string
  href: string
  label: string
}

export interface SocialData {
  items: SocialItem[]
  size: number
}

export interface DividerData {
  style: 'solid' | 'dashed' | 'dotted'
  weight: number
  width: number
  color: string
}

export interface SpacerData {
  height: number
}

export interface ProgressData {
  label: string
  value: number
  color: string
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
}

export interface TestimonialsData {
  items: TestimonialItem[]
}

export interface AccordionItem {
  id: string
  title: string
  body: string
}

export interface AccordionData {
  items: AccordionItem[]
}

export interface ToggleItem {
  id: string
  title: string
  body: string
}

export interface ToggleData {
  items: ToggleItem[]
}

export interface TabItem {
  id: string
  title: string
  body: string
}

export interface TabsData {
  items: TabItem[]
}

export interface AlertData {
  title: string
  body: string
  tone: AlertTone
}

export interface StarRatingData {
  value: number
  max: number
  label: string
  align: TextAlign
}

export type WidgetDataMap = {
  heading: HeadingData
  text: TextData
  button: ButtonData
  'button-group': ButtonGroupData
  icon: IconData
  image: ImageData
  video: VideoData
  maps: MapsData
  'icon-list': IconListData
  social: SocialData
  divider: DividerData
  spacer: SpacerData
  progress: ProgressData
  testimonials: TestimonialsData
  accordion: AccordionData
  toggle: ToggleData
  tabs: TabsData
  alert: AlertData
  'star-rating': StarRatingData
}

export type WidgetNode = {
  [K in PluginId]: {
    id: string
    plugin: K
    data: WidgetDataMap[K]
    spacing: Spacing
  }
}[PluginId]

/** Shared block chrome (section / column). */
export interface BlockDesign {
  /** Hex color, empty = none */
  background: string
  radius: number
}

export interface ColumnNode {
  id: string
  cols: ResponsiveCols
  spacing: Spacing
  /** Card surface like category tiles */
  surface: 'plain' | 'card'
  /** Background + radius for the column block */
  design: BlockDesign
  widgets: WidgetNode[]
}

export interface SectionNode {
  id: string
  gap: number
  spacing: Spacing
  /** Background + radius for the whole section */
  design: BlockDesign
  columns: ColumnNode[]
}

export interface LayoutPreset {
  id: string
  label: string
  cols: ResponsiveCols[]
}

export interface PluginMeta {
  id: PluginId
  label: string
  icon: string
  description: string
  group: 'basic' | 'media' | 'content' | 'feedback'
}

export type DragPayload =
  | { type: 'preset'; cols: ResponsiveCols[] }
  | { type: 'plugin'; plugin: PluginId }
  | { type: 'section'; sectionId: string }
  | { type: 'column'; sectionId: string; columnId: string }
