import type { PluginMeta } from './types'
import { LAYOUTS } from './grid'

export { LAYOUTS }

export const PLUGINS: PluginMeta[] = [
  { id: 'heading', label: 'Nadpis', icon: 'i-lucide-heading', description: 'Inline editovatelný nadpis', group: 'basic' },
  { id: 'text', label: 'Text', icon: 'i-lucide-type', description: 'Inline odstavec', group: 'basic' },
  { id: 'button', label: 'Tlačítko', icon: 'i-lucide-rectangle-ellipsis', description: 'CTA odkaz / tlačítko', group: 'basic' },
  { id: 'icon', label: 'Ikona', icon: 'i-lucide-smile', description: 'Lucide ikona', group: 'basic' },
  { id: 'image', label: 'Obrázek', icon: 'i-lucide-image', description: 'Lokální náhled (session)', group: 'media' },
  { id: 'divider', label: 'Oddělovač', icon: 'i-lucide-minus', description: 'Horizontální čára', group: 'basic' },
  { id: 'spacer', label: 'Mezera', icon: 'i-lucide-unfold-vertical', description: 'Vertikální spacer', group: 'basic' },
  { id: 'maps', label: 'Google Maps', icon: 'i-lucide-map-pin', description: 'Embed mapa', group: 'media' },
  { id: 'icon-list', label: 'Icon List', icon: 'i-lucide-list', description: 'Seznam s ikonami', group: 'content' },
  { id: 'social', label: 'Social Icons', icon: 'i-lucide-share-2', description: 'Sociální odkazy', group: 'content' },
  { id: 'progress', label: 'Progress Bar', icon: 'i-lucide-loader', description: 'Průběh / procenta', group: 'feedback' },
  { id: 'testimonials', label: 'Testimonials', icon: 'i-lucide-quote', description: 'Citace zákazníků', group: 'content' },
  { id: 'accordion', label: 'Accordion', icon: 'i-lucide-panel-top-open', description: 'Sbalitelné panely', group: 'content' },
  { id: 'toggle', label: 'Toggle', icon: 'i-lucide-chevrons-down-up', description: 'Nezávislé panely', group: 'content' },
  { id: 'tabs', label: 'Tabs', icon: 'i-lucide-layout-panel-top', description: 'Záložky', group: 'content' },
  { id: 'alert', label: 'Alert', icon: 'i-lucide-triangle-alert', description: 'Upozornění', group: 'feedback' },
  { id: 'star-rating', label: 'Star Rating', icon: 'i-lucide-star', description: 'Hodnocení hvězdami', group: 'feedback' },
]

export const pluginMeta = (id: PluginMeta['id']) =>
  PLUGINS.find((p) => p.id === id)!
