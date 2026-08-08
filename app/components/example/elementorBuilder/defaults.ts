import type { PluginId, WidgetDataMap, WidgetNode } from './types'
import { createSpacing } from './spacing'

const uid = () => crypto.randomUUID()

export const createId = uid

export const defaultData = <K extends PluginId>(plugin: K): WidgetDataMap[K] => {
  const map: WidgetDataMap = {
    heading: {
      text: 'Nadpis sekce',
      tag: 'h2',
      align: 'left',
      color: 'text-slate-900',
    },
    text: {
      text: 'Napište text…',
      align: 'left',
      color: 'text-slate-500',
      size: 'base',
    },
    button: {
      label: 'Klikněte zde',
      href: '#',
      color: 'primary',
      variant: 'solid',
      align: 'left',
      block: false,
    },
    icon: {
      name: 'i-lucide-star',
      size: 22,
      align: 'left',
      color: 'text-sky-700',
      boxed: true,
      boxTone: 'sky',
    },
    image: {
      src: '',
      alt: '',
      objectFit: 'cover',
      objectPosition: 'center',
      height: 240,
      radius: 12,
    },
    maps: { query: 'Praha, Czech Republic', height: 280, zoom: 14 },
    'icon-list': {
      items: [
        { id: uid(), icon: 'i-lucide-check', text: 'První položka' },
        { id: uid(), icon: 'i-lucide-check', text: 'Druhá položka' },
        { id: uid(), icon: 'i-lucide-check', text: 'Třetí položka' },
      ],
    },
    social: {
      size: 28,
      items: [
        { id: uid(), icon: 'i-lucide-facebook', href: '#', label: 'Facebook' },
        { id: uid(), icon: 'i-lucide-instagram', href: '#', label: 'Instagram' },
        { id: uid(), icon: 'i-lucide-linkedin', href: '#', label: 'LinkedIn' },
        { id: uid(), icon: 'i-lucide-youtube', href: '#', label: 'YouTube' },
      ],
    },
    divider: { style: 'solid', weight: 1, width: 100, color: '#d4d4d8' },
    spacer: { height: 40 },
    progress: { label: 'Dovednost', value: 75, color: '#064e3b' },
    testimonials: {
      items: [
        {
          id: uid(),
          quote: 'Skvělá práce a rychlá komunikace.',
          author: 'Jana N.',
          role: 'Klient',
        },
      ],
    },
    accordion: {
      items: [
        { id: uid(), title: 'Sekce 1', body: 'Obsah první sekce.' },
        { id: uid(), title: 'Sekce 2', body: 'Obsah druhé sekce.' },
      ],
    },
    toggle: {
      items: [
        { id: uid(), title: 'Toggle 1', body: 'Obsah toggle 1.' },
        { id: uid(), title: 'Toggle 2', body: 'Obsah toggle 2.' },
      ],
    },
    tabs: {
      items: [
        { id: uid(), title: 'Tab 1', body: 'Obsah první záložky.' },
        { id: uid(), title: 'Tab 2', body: 'Obsah druhé záložky.' },
        { id: uid(), title: 'Tab 3', body: 'Obsah třetí záložky.' },
      ],
    },
    alert: {
      title: 'Upozornění',
      body: 'Toto je informační zpráva.',
      tone: 'info',
    },
    'star-rating': { value: 4, max: 5, label: 'Hodnocení', align: 'left' },
  }

  return structuredClone(map[plugin]) as WidgetDataMap[K]
}

export const createWidget = <K extends PluginId>(plugin: K): Extract<WidgetNode, { plugin: K }> =>
  ({
    id: uid(),
    plugin,
    data: defaultData(plugin),
    spacing: createSpacing(),
  }) as Extract<WidgetNode, { plugin: K }>
