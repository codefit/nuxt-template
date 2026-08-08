import { createId, createWidget } from './defaults'
import { createDesign } from './design'
import { createCols } from './grid'
import { COLUMN_PAD, SECTION_PAD, createSectionSpacing, createSpacing } from './spacing'
import type {
  AlertTone,
  ColumnNode,
  HeadingTag,
  ResponsiveCols,
  SectionNode,
  TextAlign,
  WidgetNode,
} from './types'

export type BlockGroup = 'product' | 'features' | 'content' | 'steps' | 'trust' | 'about'

export type BlockSkeleton =
  | 'hero'
  | 'split'
  | 'split-reverse'
  | 'cards-3'
  | 'cards-4'
  | 'grid-2x2'
  | 'stack'
  | 'tabs'
  | 'faq'
  | 'cta'
  | 'alerts'
  | 'badges'
  | 'tip'
  | 'lead'
  | 'body'
  | 'quote'
  | 'figure'
  | 'two-col'
  | 'author'
  | 'compare'
  | 'bars'
  | 'media-3'
  | 'duo'

export interface BlockMeta {
  id: string
  label: string
  code: string
  description: string
  group: BlockGroup
  skeleton: BlockSkeleton
}

export interface BlockDef extends BlockMeta {
  build: () => SectionNode[]
}

const pad = (n: number) => createSpacing(n)

const withSpacing = (widget: WidgetNode, top = 0, bottom = 8): WidgetNode => {
  widget.spacing = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top, right: 0, bottom, left: 0 },
  }
  return widget
}

const heading = (
  value: string,
  tag: HeadingTag = 'h3',
  align: TextAlign = 'left',
  color = 'text-slate-900',
): WidgetNode => {
  const w = createWidget('heading')
  w.data.text = value
  w.data.tag = tag
  w.data.align = align
  w.data.color = color
  return withSpacing(w, 0, 6)
}

const text = (
  value: string,
  align: TextAlign = 'left',
  color = 'text-slate-500',
  size: 'sm' | 'base' | 'lg' = 'sm',
): WidgetNode => {
  const w = createWidget('text')
  w.data.text = value
  w.data.align = align
  w.data.color = color
  w.data.size = size
  return withSpacing(w, 0, 6)
}

const icon = (
  name: string,
  size = 22,
  align: TextAlign = 'left',
  boxTone = 'sky',
): WidgetNode => {
  const w = createWidget('icon')
  w.data.name = name
  w.data.size = size
  w.data.align = align
  w.data.boxed = true
  w.data.boxTone = boxTone
  return withSpacing(w, 0, 12)
}

const image = (height = 280, radius = 16): WidgetNode => {
  const w = createWidget('image')
  w.data.height = height
  w.data.objectFit = 'cover'
  w.data.radius = radius
  return withSpacing(w, 0, 0)
}

const button = (
  label: string,
  variant: 'link' | 'soft' | 'solid' | 'outline' | 'ghost' = 'link',
): WidgetNode => {
  const w = createWidget('button')
  w.data.label = label
  w.data.variant = variant
  w.data.color = 'primary'
  w.data.align = 'left'
  w.data.block = false
  return withSpacing(w, 8, 0)
}

const divider = (): WidgetNode => withSpacing(createWidget('divider'), 8, 8)

const spacer = (height = 24): WidgetNode => {
  const w = createWidget('spacer')
  w.data.height = height
  return withSpacing(w, 0, 0)
}

const alert = (title: string, body: string, tone: AlertTone = 'info'): WidgetNode => {
  const w = createWidget('alert')
  w.data.title = title
  w.data.body = body
  w.data.tone = tone
  return withSpacing(w, 0, 8)
}

const stars = (value = 4.8, label = 'Hodnocení zákazníků'): WidgetNode => {
  const w = createWidget('star-rating')
  w.data.value = Math.round(value)
  w.data.max = 5
  w.data.label = label
  w.data.align = 'left'
  return withSpacing(w, 0, 8)
}

const iconList = (items: { icon: string; text: string }[]): WidgetNode => {
  const w = createWidget('icon-list')
  w.data.items = items.map((item) => ({
    id: createId(),
    icon: item.icon,
    text: item.text,
  }))
  return withSpacing(w, 0, 8)
}

const accordion = (items: { title: string; body: string }[]): WidgetNode => {
  const w = createWidget('accordion')
  w.data.items = items.map((item) => ({
    id: createId(),
    title: item.title,
    body: item.body,
  }))
  return withSpacing(w, 0, 0)
}

const tabs = (items: { title: string; body: string }[]): WidgetNode => {
  const w = createWidget('tabs')
  w.data.items = items.map((item) => ({
    id: createId(),
    title: item.title,
    body: item.body,
  }))
  return withSpacing(w, 0, 0)
}

const testimonials = (
  items: { quote: string; author: string; role: string }[],
): WidgetNode => {
  const w = createWidget('testimonials')
  w.data.items = items.map((item) => ({
    id: createId(),
    quote: item.quote,
    author: item.author,
    role: item.role,
  }))
  return withSpacing(w, 0, 0)
}

const progress = (label: string, value: number): WidgetNode => {
  const w = createWidget('progress')
  w.data.label = label
  w.data.value = value
  return withSpacing(w, 0, 8)
}

const column = (
  cols: ResponsiveCols,
  widgets: WidgetNode[],
  spacingPad = COLUMN_PAD,
  surface: ColumnNode['surface'] = 'plain',
): ColumnNode => ({
  id: createId(),
  cols: structuredClone(cols),
  spacing: pad(Math.max(spacingPad, surface === 'card' ? COLUMN_PAD : 16)),
  surface,
  design: createDesign(),
  widgets,
})

const section = (columns: ColumnNode[], gap = 24, spacingPad = SECTION_PAD): SectionNode => ({
  id: createId(),
  gap,
  spacing: createSectionSpacing(spacingPad),
  design: createDesign('', 16),
  columns,
})

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.'
const lead =
  'Stručný úvodní odstavec, který zákazníkovi řekne, proč je produkt relevantní právě teď.'
const body =
  'Delší popis vhodné vlastnosti, materiálu nebo použití. Upravte text přímo kliknutím — ideální pro detail produktu i článek.'

/* ── Features (existující) ── */

const buildFeatureSplit = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 6 }), [
      icon('i-lucide-sparkles', 22, 'left', 'violet'),
      heading('Free Tech Drive', 'h3'),
      text(lorem),
    ], 12),
    column(createCols(12, { md: 6 }), [image(300, 20)], 0),
  ], 24, 40),
]

const buildFeatureCards = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Built-In Advantages', 'h2', 'center'),
      text('Krátký podnadpis sekce výhod produktu.', 'center', 'text-slate-500', 'base'),
    ], 8),
  ], 8, 24),
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-palette', 22, 'left', 'violet'),
        heading('Modern Design', 'h4'),
        text(lorem),
        button('Learn More'),
      ], 4, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-badge-check', 22, 'left', 'mint'),
        heading('High Quality', 'h4'),
        text(lorem),
        button('Learn More'),
      ], 4, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-car', 22, 'left', 'peach'),
        heading('Free Test-Drive', 'h4'),
        text(lorem),
        button('Learn More'),
      ], 4, 'card'),
    ],
    20,
    16,
  ),
]

const buildFeatureAdvantages = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('A better way to keep your skills', 'h2', 'left'),
    ], 4),
  ], 8, 24),
  section(
    [
      column(createCols(12, { sm: 6 }), [
        icon('i-lucide-percent', 22, 'left', 'sky'),
        heading('Competitive rates', 'h5'),
        text(lorem),
      ], 8, 'card'),
      column(createCols(12, { sm: 6 }), [
        icon('i-lucide-shield-check', 22, 'left', 'mint'),
        heading('No hidden fees', 'h5'),
        text(lorem),
      ], 8, 'card'),
      column(createCols(12, { sm: 6 }), [
        icon('i-lucide-gauge', 22, 'left', 'indigo'),
        heading('Stable performance', 'h5'),
        text(lorem),
      ], 8, 'card'),
      column(createCols(12, { sm: 6 }), [
        icon('i-lucide-zap', 22, 'left', 'amber'),
        heading('Instant transfers', 'h5'),
        text(lorem),
      ], 8, 'card'),
    ],
    24,
    16,
  ),
]

const buildWhyChoose = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Why Choose Us?', 'h2', 'center'),
      text('Důvody, proč si vybrat právě tento produkt.', 'center'),
    ], 8),
  ], 8, 24),
  section(
    [
      column(createCols(12, { md: 8 }), [
        icon('i-lucide-palette', 22, 'left', 'sky'),
        heading('Perfect Design', 'h4'),
        text(lorem),
      ], 12, 'card'),
    ],
    16,
    8,
  ),
  section(
    [
      column(createCols(12, { md: 8 }), [
        icon('i-lucide-cpu', 22, 'left', 'slate'),
        heading('Free Tech-Drive', 'h4'),
        text(lorem),
      ], 12, 'card'),
    ],
    16,
    8,
  ),
  section(
    [
      column(createCols(12, { md: 8 }), [
        icon('i-lucide-badge-check', 22, 'left', 'teal'),
        heading('High Quality', 'h4'),
        text(lorem),
      ], 12, 'card'),
    ],
    16,
    24,
  ),
]

/* ── Produktový detail ── */

const buildProductHero = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 6 }), [
      text('Novinka · Skladové zboží', 'left', 'text-brand-700', 'sm'),
      heading('Název produktu, který prodává', 'h1'),
      stars(5, '4.9 · 128 hodnocení'),
      text(lead, 'left', 'text-slate-600', 'lg'),
      button('Přidat do košíku', 'solid'),
      button('Porovnat varianty', 'outline'),
    ], 12),
    column(createCols(12, { md: 6 }), [image(420, 20)], 0),
  ], 32, 40),
]

const buildProductTabs = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Detail produktu', 'h2'),
      text('Popis, specifikace a dodání v jedné přehledné sekci.', 'left', 'text-slate-500', 'base'),
      spacer(12),
      tabs([
        {
          title: 'Popis',
          body: 'Kompletní popis produktu: materiál, použití, kompatibilita a tipy pro výběr velikosti.',
        },
        {
          title: 'Specifikace',
          body: 'Rozměry, hmotnost, napájení, balení. Doplňte přesné parametry dle katalogu.',
        },
        {
          title: 'Dodání',
          body: 'Expedice do 24 h, doprava od 89 Kč, osobní odběr zdarma. Vrácení do 14 dnů.',
        },
      ]),
    ], 8),
  ], 8, 32),
]

const buildSpecsGrid = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Technické parametry', 'h2', 'center'),
      text('Klíčové údaje na první pohled.', 'center'),
    ], 8),
  ], 8, 24),
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-ruler', 22, 'left', 'sky'),
        heading('Rozměry', 'h5'),
        iconList([
          { icon: 'i-lucide-check', text: 'Výška: 42 cm' },
          { icon: 'i-lucide-check', text: 'Šířka: 28 cm' },
          { icon: 'i-lucide-check', text: 'Hloubka: 12 cm' },
        ]),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-cpu', 22, 'left', 'violet'),
        heading('Výkon', 'h5'),
        iconList([
          { icon: 'i-lucide-check', text: 'Výkon: 1200 W' },
          { icon: 'i-lucide-check', text: 'Hlučnost: 48 dB' },
          { icon: 'i-lucide-check', text: 'Spotřeba: A++' },
        ]),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-package', 22, 'left', 'peach'),
        heading('Balení', 'h5'),
        iconList([
          { icon: 'i-lucide-check', text: 'Hmotnost: 2,4 kg' },
          { icon: 'i-lucide-check', text: 'Záruka: 36 měsíců' },
          { icon: 'i-lucide-check', text: 'Příslušenství v balení' },
        ]),
      ], 8, 'card'),
    ],
    20,
    24,
  ),
]

const buildWhatsIncluded = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 5 }), [
      heading('Co je v balení', 'h2'),
      text('Přehled obsahu krabice — ideální proti reklamacím a návratům.', 'left', 'text-slate-500', 'base'),
      iconList([
        { icon: 'i-lucide-box', text: 'Hlavní jednotka' },
        { icon: 'i-lucide-cable', text: 'Napájecí kabel 1,5 m' },
        { icon: 'i-lucide-book-open', text: 'Návod CZ / SK' },
        { icon: 'i-lucide-wrench', text: 'Montážní sada' },
        { icon: 'i-lucide-shield', text: 'Záruční list' },
      ]),
    ], 12),
    column(createCols(12, { md: 7 }), [image(340, 18)], 0),
  ], 28, 36),
]

const buildForWhom = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Pro koho je produkt', 'h2', 'center'),
      text('Segmentace pomáhá zákazníkovi rozhodnout se rychleji.', 'center'),
    ], 8),
  ], 8, 20),
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-home', 22, 'center', 'mint'),
        heading('Domácnost', 'h4', 'center'),
        text('Každodenní použití, jednoduchá údržba, tichý provoz.', 'center'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-briefcase', 22, 'center', 'sky'),
        heading('Kancelář', 'h4', 'center'),
        text('Kompaktní rozměr, nízká spotřeba, spolehlivý výkon.', 'center'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-building-2', 22, 'center', 'indigo'),
        heading('Profi provoz', 'h4', 'center'),
        text('Vyšší zátěž, delší záruka, servisní síť po ČR.', 'center'),
      ], 8, 'card'),
    ],
    20,
    24,
  ),
]

const buildUseCases = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 4 }), [
      image(220, 14),
      heading('Scénář 1', 'h5'),
      text('Krátký popis typického použití produktu v praxi.'),
    ], 8, 'card'),
    column(createCols(12, { md: 4 }), [
      image(220, 14),
      heading('Scénář 2', 'h5'),
      text('Druhý use-case — např. sezónní nebo cestovní využití.'),
    ], 8, 'card'),
    column(createCols(12, { md: 4 }), [
      image(220, 14),
      heading('Scénář 3', 'h5'),
      text('Třetí situace, kde produkt šetří čas nebo náklady.'),
    ], 8, 'card'),
  ], 20, 32),
]

const buildMaterials = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 6 }), [image(360, 18)], 0),
    column(createCols(12, { md: 6 }), [
      heading('Materiály a zpracování', 'h2'),
      text(body, 'left', 'text-slate-600', 'base'),
      divider(),
      progress('Odolnost', 92),
      progress('Komfort', 86),
      progress('Udřžitelnost', 78),
    ], 16),
  ], 28, 36),
]

const buildCare = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Péče a údržba', 'h2'),
      text('Jednoduché tipy pro delší životnost produktu.', 'left', 'text-slate-500', 'base'),
    ], 4),
  ], 8, 16),
  section(
    [
      column(createCols(12, { sm: 6, md: 3 }), [
        icon('i-lucide-droplets', 20, 'center', 'sky'),
        heading('Čištění', 'h6', 'center'),
        text('Otřete vlhkým hadříkem, bez agresivní chemie.', 'center'),
      ], 6, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        icon('i-lucide-sun', 20, 'center', 'amber'),
        heading('Skladování', 'h6', 'center'),
        text('Suché místo, mimo přímé slunce a mráz.', 'center'),
      ], 6, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        icon('i-lucide-ban', 20, 'center', 'rose'),
        heading('Nevhodné', 'h6', 'center'),
        text('Myčka, vysokotlaký čistič, rozpouštědla.', 'center'),
      ], 6, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        icon('i-lucide-heart-handshake', 20, 'center', 'mint'),
        heading('Tip', 'h6', 'center'),
        text('Jednou ročně zkontrolujte spoje a těsnění.', 'center'),
      ], 6, 'card'),
    ],
    16,
    24,
  ),
]

const buildShipping = (): SectionNode[] => [
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-truck', 22, 'left', 'sky'),
        heading('Doprava', 'h5'),
        text('Expedice do 24 hodin · sledování zásilky.'),
      ], 10, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-undo-2', 22, 'left', 'mint'),
        heading('Vrácení 14 dnů', 'h5'),
        text('Bez udání důvodu, zpětný štítek na vyžádání.'),
      ], 10, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-shield-check', 22, 'left', 'violet'),
        heading('Záruka 36 měsíců', 'h5'),
        text('Autorizovaný servis a náhradní díly skladem.'),
      ], 10, 'card'),
    ],
    16,
    28,
  ),
]

const buildStockAlert = (): SectionNode[] => [
  section([
    column(createCols(12), [
      alert(
        'Skladem — expedujeme dnes',
        'Objednávky do 14:00 odesíláme ještě tentýž den. Počet kusů je omezený.',
        'success',
      ),
      alert(
        'Tip k výběru velikosti',
        'Nejste si jistí? Napište nám rozměry — poradíme variantu do 2 hodin.',
        'info',
      ),
    ], 4),
  ], 8, 24),
]

const buildCompareStrip = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Porovnání variant', 'h2', 'center'),
      text('Rychlý přehled rozdílů mezi řadami.', 'center'),
    ], 8),
  ], 8, 16),
  section(
    [
      column(createCols(12, { md: 4 }), [
        text('Základ', 'center', 'text-slate-400', 'sm'),
        heading('Lite', 'h3', 'center'),
        text('Pro lehké denní použití.', 'center'),
        divider(),
        iconList([
          { icon: 'i-lucide-check', text: 'Základní výbava' },
          { icon: 'i-lucide-check', text: 'Záruka 24 měsíců' },
          { icon: 'i-lucide-x', text: 'Bez prodloužené záruky' },
        ]),
        button('Vybrat Lite', 'outline'),
      ], 10, 'card'),
      column(createCols(12, { md: 4 }), [
        text('Nejčastější volba', 'center', 'text-brand-700', 'sm'),
        heading('Pro', 'h3', 'center'),
        text('Vyvážený výkon a výbava.', 'center'),
        divider(),
        iconList([
          { icon: 'i-lucide-check', text: 'Rozšířená výbava' },
          { icon: 'i-lucide-check', text: 'Záruka 36 měsíců' },
          { icon: 'i-lucide-check', text: 'Prioritní podpora' },
        ]),
        button('Vybrat Pro', 'solid'),
      ], 10, 'card'),
      column(createCols(12, { md: 4 }), [
        text('Maximum', 'center', 'text-slate-400', 'sm'),
        heading('Ultra', 'h3', 'center'),
        text('Pro náročný provoz.', 'center'),
        divider(),
        iconList([
          { icon: 'i-lucide-check', text: 'Plná výbava' },
          { icon: 'i-lucide-check', text: 'Záruka 60 měsíců' },
          { icon: 'i-lucide-check', text: 'On-site servis' },
        ]),
        button('Vybrat Ultra', 'outline'),
      ], 10, 'card'),
    ],
    20,
    28,
  ),
]

const buildRelated = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Související produkty', 'h2'),
      text('Doplňky a alternativy, které se často kupují spolu.', 'left', 'text-slate-500', 'base'),
    ], 4),
  ], 8, 16),
  section(
    [
      column(createCols(12, { md: 4 }), [
        image(180, 12),
        heading('Doplněk A', 'h5'),
        text('Krátký popisek · od 299 Kč'),
        button('Zobrazit', 'link'),
      ], 6, 'card'),
      column(createCols(12, { md: 4 }), [
        image(180, 12),
        heading('Doplněk B', 'h5'),
        text('Krátký popisek · od 449 Kč'),
        button('Zobrazit', 'link'),
      ], 6, 'card'),
      column(createCols(12, { md: 4 }), [
        image(180, 12),
        heading('Doplněk C', 'h5'),
        text('Krátký popisek · od 199 Kč'),
        button('Zobrazit', 'link'),
      ], 6, 'card'),
    ],
    16,
    24,
  ),
]

const buildFaq = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 4 }), [
      heading('Časté otázky', 'h2'),
      text('Odpovědi, které šetří support i nákupní košík.', 'left', 'text-slate-500', 'base'),
      button('Napsat na podporu', 'soft'),
    ], 12),
    column(createCols(12, { md: 8 }), [
      accordion([
        {
          title: 'Jaká je dodací lhůta?',
          body: 'Skladem odesíláme do 24 hodin. Při výrobě na míru 5–10 pracovních dní.',
        },
        {
          title: 'Lze produkt vrátit?',
          body: 'Ano, do 14 dnů od převzetí v původním stavu. Po domluvě zašleme zpětný štítek.',
        },
        {
          title: 'Je nutná montáž?',
          body: 'Základní montáž zvládnete sami podle návodu. Volitelně nabízíme instalaci.',
        },
        {
          title: 'Jak uplatnit záruku?',
          body: 'Stačí číslo objednávky a popis závady — vyřídíme online do 48 hodin.',
        },
      ]),
    ], 8),
  ], 28, 36),
]

const buildCtaBanner = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 8 }), [
      heading('Připraveni objednat?', 'h2'),
      text('Doprava zdarma od 1 500 Kč · platba kartou i na fakturu.', 'left', 'text-slate-600', 'base'),
    ], 8),
    column(createCols(12, { md: 4 }), [
      spacer(8),
      button('Do košíku', 'solid'),
      button('Poradit se', 'ghost'),
    ], 8),
  ], 16, 32),
]

/* ── Kroky ── */

const buildHowItWorks = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Jak to funguje', 'h2', 'center'),
      text('Tři jednoduché kroky od startu k výsledku.', 'center'),
    ], 8),
  ], 8, 24),
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-mouse-pointer-click', 22, 'center', 'violet'),
        heading('1. Vyberte', 'h4', 'center'),
        text('Zvolte variantu produktu podle potřeby.', 'center'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-settings-2', 22, 'center', 'sky'),
        heading('2. Nastavte', 'h4', 'center'),
        text('Upravte obsah a vzhled přímo v editoru.', 'center'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-rocket', 22, 'center', 'peach'),
        heading('3. Spusťte', 'h4', 'center'),
        text('Publikujte a sledujte výsledek v reálu.', 'center'),
      ], 8, 'card'),
    ],
    24,
    32,
  ),
]

const buildInstallSteps = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Instalace ve 4 krocích', 'h2'),
      text('Stručný montážní postup — nahrazuje dlouhý PDF návod v detailu.', 'left', 'text-slate-500', 'base'),
    ], 4),
  ], 8, 16),
  section(
    [
      column(createCols(12, { sm: 6, md: 3 }), [
        heading('01', 'h3', 'left', 'text-brand-700'),
        heading('Vybalení', 'h5'),
        text('Zkontrolujte kompletnost dle seznamu v balení.'),
      ], 8, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        heading('02', 'h3', 'left', 'text-brand-700'),
        heading('Umístění', 'h5'),
        text('Zvolte rovný, suchý a dobře větraný prostor.'),
      ], 8, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        heading('03', 'h3', 'left', 'text-brand-700'),
        heading('Montáž', 'h5'),
        text('Spojte díly podle čísel v návodu — bez speciálního nářadí.'),
      ], 8, 'card'),
      column(createCols(12, { sm: 6, md: 3 }), [
        heading('04', 'h3', 'left', 'text-brand-700'),
        heading('Kontrola', 'h5'),
        text('Zapněte, otestujte funkce a uložte záruční list.'),
      ], 8, 'card'),
    ],
    16,
    28,
  ),
]

/* ── Důvěra / sociální proof ── */

const buildReviews = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Co říkají zákazníci', 'h2', 'center'),
      stars(5, '4.8 průměr · 312 recenzí'),
    ], 8),
  ], 8, 20),
  section(
    [
      column(createCols(12, { md: 4 }), [
        testimonials([
          {
            quote: 'Dodání druhý den, balení perfektní. Funguje přesně jak popis.',
            author: 'Martin K.',
            role: 'Ověřený nákup',
          },
        ]),
      ], 4, 'card'),
      column(createCols(12, { md: 4 }), [
        testimonials([
          {
            quote: 'Konečně přehledný produkt — montáž zvládla i babička.',
            author: 'Eva S.',
            role: 'Ověřený nákup',
          },
        ]),
      ], 4, 'card'),
      column(createCols(12, { md: 4 }), [
        testimonials([
          {
            quote: 'Podpora odpověděla do hodiny a poslala náhradní díl zdarma.',
            author: 'Petr N.',
            role: 'Ověřený nákup',
          },
        ]),
      ], 4, 'card'),
    ],
    16,
    28,
  ),
]

const buildTrustBadges = (): SectionNode[] => [
  section(
    [
      column(createCols(6, { md: 3 }), [
        icon('i-lucide-badge-check', 22, 'center', 'mint'),
        heading('Ověřený e-shop', 'h6', 'center'),
        text('Heureka · Zboží.cz', 'center'),
      ], 6),
      column(createCols(6, { md: 3 }), [
        icon('i-lucide-lock', 22, 'center', 'sky'),
        heading('Bezpečná platba', 'h6', 'center'),
        text('3-D Secure · SSL', 'center'),
      ], 6),
      column(createCols(6, { md: 3 }), [
        icon('i-lucide-headphones', 22, 'center', 'violet'),
        heading('Podpora CZ', 'h6', 'center'),
        text('Po–Pá 8–17', 'center'),
      ], 6),
      column(createCols(6, { md: 3 }), [
        icon('i-lucide-recycle', 22, 'center', 'teal'),
        heading('Ekologie', 'h6', 'center'),
        text('Zpětný odběr', 'center'),
      ], 6),
    ],
    12,
    28,
  ),
]

const buildExpertTip = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 3 }), [
      icon('i-lucide-lightbulb', 26, 'center', 'amber'),
    ], 8),
    column(createCols(12, { md: 9 }), [
      text('Tip od specialisty', 'left', 'text-amber-700', 'sm'),
      heading('Jak vybrat správnou velikost', 'h3'),
      text(
        'Změřte prostor s rezervou 5 cm. U varianty Pro doporučujeme vyšší model při intenzivním denním provozu.',
        'left',
        'text-slate-600',
        'base',
      ),
    ], 8),
  ], 16, 28),
]

/* ── Články / editorial ── */

const buildArticleLead = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 10 }), [
      text('Průvodce · 8 min čtení', 'left', 'text-brand-700', 'sm'),
      heading('Jak vybrat produkt, který vydrží roky', 'h1'),
      text(
        'Praktický návod pro zákazníky i redakci — úvod článku s jasným příslibem hodnoty.',
        'left',
        'text-slate-600',
        'lg',
      ),
      divider(),
      text('Autor: Redakce · Aktualizováno 8. 8. 2026', 'left', 'text-slate-400', 'sm'),
    ], 8),
  ], 8, 36),
]

const buildArticleBody = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 8 }), [
      heading('Proč na tom záleží', 'h2'),
      text(body, 'left', 'text-slate-600', 'base'),
      text(
        'Další odstavec s praktickým příkladem. Editor může text libovolně zkrátit nebo rozšířit.',
        'left',
        'text-slate-600',
        'base',
      ),
      heading('Na co se zaměřit', 'h3'),
      iconList([
        { icon: 'i-lucide-check', text: 'Materiál a životnost' },
        { icon: 'i-lucide-check', text: 'Servisní dostupnost' },
        { icon: 'i-lucide-check', text: 'Celkové náklady vlastnictví' },
      ]),
    ], 12),
    column(createCols(12, { md: 4 }), [
      alert('Shrnutí', '3 body, které si z článku odnesete za 30 sekund.', 'info'),
      iconList([
        { icon: 'i-lucide-circle-check', text: 'Měřte prostor před nákupem' },
        { icon: 'i-lucide-circle-check', text: 'Porovnejte záruku, ne jen cenu' },
        { icon: 'i-lucide-circle-check', text: 'Ověřte příslušenství v balení' },
      ]),
    ], 8, 'card'),
  ], 28, 36),
]

const buildPullQuote = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 2 }), [], 0),
    column(createCols(12, { md: 8 }), [
      heading(
        '„Nejlepší produkt není ten nejlevnější — je to ten, který nebudete měnit za tři roky.“',
        'h3',
        'center',
        'text-slate-800',
      ),
      text('— Produktový specialista', 'center', 'text-slate-400', 'sm'),
    ], 16),
    column(createCols(12, { md: 2 }), [], 0),
  ], 8, 40),
]

const buildImageCaption = (): SectionNode[] => [
  section([
    column(createCols(12), [
      image(380, 16),
      spacer(8),
      text(
        'Obrázek: ukázka produktu v reálném prostředí. Popisek pomáhá SEO i přístupnosti.',
        'center',
        'text-slate-400',
        'sm',
      ),
    ], 4),
  ], 8, 28),
]

const buildTwoColStory = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 6 }), [
      heading('Příběh z praxe', 'h2'),
      text(body, 'left', 'text-slate-600', 'base'),
      text(lorem, 'left', 'text-slate-600', 'base'),
    ], 12),
    column(createCols(12, { md: 6 }), [
      heading('Co z toho plyne', 'h2'),
      text(body, 'left', 'text-slate-600', 'base'),
      button('Číst celý case study', 'soft'),
    ], 12),
  ], 28, 36),
]

const buildKeyTakeaways = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Klíčové body', 'h2', 'center'),
      text('Rychlé shrnutí na konec článku nebo do produktového popisu.', 'center'),
    ], 8),
  ], 8, 16),
  section(
    [
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-target', 22, 'left', 'rose'),
        heading('Cíl', 'h5'),
        text('Vyberte podle reálného použití, ne podle marketingu.'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-scale', 22, 'left', 'sky'),
        heading('Poměr cena/výkon', 'h5'),
        text('Spočítejte záruku, spotřebu a servis — ne jen ceník.'),
      ], 8, 'card'),
      column(createCols(12, { md: 4 }), [
        icon('i-lucide-handshake', 22, 'left', 'mint'),
        heading('Důvěra', 'h5'),
        text('Ověřené recenze a dostupná podpora rozhodují stejně jako parametry.'),
      ], 8, 'card'),
    ],
    16,
    28,
  ),
]

const buildAuthorBio = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 2 }), [image(96, 30)], 4),
    column(createCols(12, { md: 10 }), [
      heading('O autorovi', 'h4'),
      text(
        'Redaktor se specializací na produktové návody. Pomáhá převádět technické parametry do srozumitelného jazyka e-shopu.',
        'left',
        'text-slate-600',
        'base',
      ),
      button('Další články autora', 'link'),
    ], 8),
  ], 20, 32),
]

const buildRelatedPosts = (): SectionNode[] => [
  section([
    column(createCols(12), [
      heading('Související články', 'h2'),
    ], 4),
  ], 8, 12),
  section(
    [
      column(createCols(12, { md: 4 }), [
        image(160, 12),
        text('Návody', 'left', 'text-brand-700', 'sm'),
        heading('5 chyb při výběru', 'h5'),
        text('Krátký perex článku…'),
      ], 6, 'card'),
      column(createCols(12, { md: 4 }), [
        image(160, 12),
        text('Srovnání', 'left', 'text-brand-700', 'sm'),
        heading('Lite vs Pro vs Ultra', 'h5'),
        text('Krátký perex článku…'),
      ], 6, 'card'),
      column(createCols(12, { md: 4 }), [
        image(160, 12),
        text('Údržba', 'left', 'text-brand-700', 'sm'),
        heading('Jak prodloužit životnost', 'h5'),
        text('Krátký perex článku…'),
      ], 6, 'card'),
    ],
    16,
    28,
  ),
]

const buildCalloutTip = (): SectionNode[] => [
  section([
    column(createCols(12), [
      alert(
        'Redakční tip',
        'Vložte tento callout mezi odstavce článku — zvyšuje skenovatelnost a CTR na produkt.',
        'warning',
      ),
    ], 4),
  ], 8, 20),
]

const buildNewsletter = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 8 }), [
      heading('Tipy do e-mailu', 'h2'),
      text('Novinky, návody a slevy — max. 1× týdně, bez spamu.', 'left', 'text-slate-600', 'base'),
    ], 8),
    column(createCols(12, { md: 4 }), [
      spacer(12),
      button('Přihlásit odběr', 'solid'),
    ], 8),
  ], 16, 32),
]

/* ── About ── */

const buildAbout = (): SectionNode[] => [
  section([
    column(createCols(12, { md: 6 }), [
      heading('O nás', 'h2'),
      text(
        'Jsme tým, který staví přehledné produktové stránky. Každý blok je editovatelný po řádcích — nadpisy i texty kliknutím.',
        'left',
        'text-slate-500',
        'base',
      ),
      button('Kontaktujte nás', 'soft'),
    ], 12),
    column(createCols(12, { md: 6 }), [image(320, 20)], 0),
  ], 32, 40),
]

const buildProblemSolution = (): SectionNode[] => [
  section(
    [
      column(createCols(12, { md: 6 }), [
        text('Problém', 'left', 'text-rose-600', 'sm'),
        heading('Složité parametry, málo jistoty', 'h3'),
        text('Zákazník neví, co z katalogu opravdu potřebuje — a odchází ke konkurenci.'),
      ], 12, 'card'),
      column(createCols(12, { md: 6 }), [
        text('Řešení', 'left', 'text-emerald-600', 'sm'),
        heading('Srozumitelný obsah v blocích', 'h3'),
        text('Strukturovaný detail: benefity, FAQ, scénáře použití a jasné CTA.'),
      ], 12, 'card'),
    ],
    20,
    32,
  ),
]

export const BLOCKS: BlockDef[] = [
  /* Produkt */
  {
    id: 'pd-hero',
    code: 'PD01',
    label: 'Produktový hero',
    description: 'Název, rating, lead, CTA + foto',
    group: 'product',
    skeleton: 'hero',
    build: buildProductHero,
  },
  {
    id: 'pd-tabs',
    code: 'PD02',
    label: 'Záložky detailu',
    description: 'Popis · Specifikace · Dodání',
    group: 'product',
    skeleton: 'tabs',
    build: buildProductTabs,
  },
  {
    id: 'pd-specs',
    code: 'PD03',
    label: 'Technické parametry',
    description: '3 karty s icon listy',
    group: 'product',
    skeleton: 'cards-3',
    build: buildSpecsGrid,
  },
  {
    id: 'pd-box',
    code: 'PD04',
    label: 'Co je v balení',
    description: 'Seznam + obrázek',
    group: 'product',
    skeleton: 'split',
    build: buildWhatsIncluded,
  },
  {
    id: 'pd-whom',
    code: 'PD05',
    label: 'Pro koho',
    description: '3 segmenty zákazníků',
    group: 'product',
    skeleton: 'cards-3',
    build: buildForWhom,
  },
  {
    id: 'pd-usecases',
    code: 'PD06',
    label: 'Scénáře použití',
    description: '3 karty foto + text',
    group: 'product',
    skeleton: 'media-3',
    build: buildUseCases,
  },
  {
    id: 'pd-materials',
    code: 'PD07',
    label: 'Materiály',
    description: 'Foto + progress bary',
    group: 'product',
    skeleton: 'bars',
    build: buildMaterials,
  },
  {
    id: 'pd-care',
    code: 'PD08',
    label: 'Péče a údržba',
    description: '4 tipy v mřížce',
    group: 'product',
    skeleton: 'cards-4',
    build: buildCare,
  },
  {
    id: 'pd-ship',
    code: 'PD09',
    label: 'Doprava a záruka',
    description: '3 trust karty',
    group: 'product',
    skeleton: 'cards-3',
    build: buildShipping,
  },
  {
    id: 'pd-stock',
    code: 'PD10',
    label: 'Skladové alerty',
    description: 'Success + info callout',
    group: 'product',
    skeleton: 'alerts',
    build: buildStockAlert,
  },
  {
    id: 'pd-compare',
    code: 'PD11',
    label: 'Porovnání variant',
    description: 'Lite / Pro / Ultra',
    group: 'product',
    skeleton: 'compare',
    build: buildCompareStrip,
  },
  {
    id: 'pd-related',
    code: 'PD12',
    label: 'Související produkty',
    description: '3 produktové karty',
    group: 'product',
    skeleton: 'media-3',
    build: buildRelated,
  },
  {
    id: 'pd-faq',
    code: 'PD13',
    label: 'FAQ produktu',
    description: 'Intro + accordion',
    group: 'product',
    skeleton: 'faq',
    build: buildFaq,
  },
  {
    id: 'pd-cta',
    code: 'PD14',
    label: 'CTA banner',
    description: 'Objednávkový strip',
    group: 'product',
    skeleton: 'cta',
    build: buildCtaBanner,
  },

  /* Features */
  {
    id: 'fe-split',
    code: 'FE05',
    label: 'Feature + obrázek',
    description: 'Ikona, nadpis, text | obrázek',
    group: 'features',
    skeleton: 'split',
    build: buildFeatureSplit,
  },
  {
    id: 'fe-cards',
    code: 'FE06',
    label: '3 výhody (karty)',
    description: 'Centrovany nadpis + 3 sloupce',
    group: 'features',
    skeleton: 'cards-3',
    build: buildFeatureCards,
  },
  {
    id: 'fe-grid',
    code: 'FE07',
    label: '2×2 výhody',
    description: 'Nadpis + mřížka ikonových bodů',
    group: 'features',
    skeleton: 'grid-2x2',
    build: buildFeatureAdvantages,
  },
  {
    id: 'fe-why',
    code: 'FE08',
    label: 'Why choose us',
    description: 'Centrovany nadpis + ikonový seznam',
    group: 'features',
    skeleton: 'stack',
    build: buildWhyChoose,
  },
  {
    id: 'fe-problem',
    code: 'FE09',
    label: 'Problém → řešení',
    description: 'Dvě karty vedle sebe',
    group: 'features',
    skeleton: 'duo',
    build: buildProblemSolution,
  },

  /* Kroky */
  {
    id: 'how-it-works',
    code: 'HW01',
    label: 'Jak to funguje',
    description: '3 kroky s ikonami',
    group: 'steps',
    skeleton: 'cards-3',
    build: buildHowItWorks,
  },
  {
    id: 'hw-install',
    code: 'HW02',
    label: 'Instalace 4 kroky',
    description: 'Montážní postup v kartách',
    group: 'steps',
    skeleton: 'cards-4',
    build: buildInstallSteps,
  },

  /* Důvěra */
  {
    id: 'tr-reviews',
    code: 'TR01',
    label: 'Recenze',
    description: 'Rating + 3 testimonials',
    group: 'trust',
    skeleton: 'cards-3',
    build: buildReviews,
  },
  {
    id: 'tr-badges',
    code: 'TR02',
    label: 'Trust badges',
    description: '4 důvěryhodné ikony',
    group: 'trust',
    skeleton: 'badges',
    build: buildTrustBadges,
  },
  {
    id: 'tr-tip',
    code: 'TR03',
    label: 'Tip specialisty',
    description: 'Expert callout',
    group: 'trust',
    skeleton: 'tip',
    build: buildExpertTip,
  },

  /* Články */
  {
    id: 'ar-lead',
    code: 'AR01',
    label: 'Úvod článku',
    description: 'Kicker, H1, perex, meta',
    group: 'content',
    skeleton: 'lead',
    build: buildArticleLead,
  },
  {
    id: 'ar-body',
    code: 'AR02',
    label: 'Tělo + sidebar',
    description: '8/4 layout se shrnutím',
    group: 'content',
    skeleton: 'body',
    build: buildArticleBody,
  },
  {
    id: 'ar-quote',
    code: 'AR03',
    label: 'Citace',
    description: 'Pull quote na střed',
    group: 'content',
    skeleton: 'quote',
    build: buildPullQuote,
  },
  {
    id: 'ar-figure',
    code: 'AR04',
    label: 'Obrázek s popiskem',
    description: 'Figure + caption',
    group: 'content',
    skeleton: 'figure',
    build: buildImageCaption,
  },
  {
    id: 'ar-two',
    code: 'AR05',
    label: 'Dvousloupcový text',
    description: 'Příběh | závěr',
    group: 'content',
    skeleton: 'two-col',
    build: buildTwoColStory,
  },
  {
    id: 'ar-takeaways',
    code: 'AR06',
    label: 'Klíčové body',
    description: '3 takeaways karty',
    group: 'content',
    skeleton: 'cards-3',
    build: buildKeyTakeaways,
  },
  {
    id: 'ar-author',
    code: 'AR07',
    label: 'Autor článku',
    description: 'Bio box',
    group: 'content',
    skeleton: 'author',
    build: buildAuthorBio,
  },
  {
    id: 'ar-related',
    code: 'AR08',
    label: 'Související články',
    description: '3 teaser karty',
    group: 'content',
    skeleton: 'media-3',
    build: buildRelatedPosts,
  },
  {
    id: 'ar-callout',
    code: 'AR09',
    label: 'Redakční tip',
    description: 'Warning alert mezi textem',
    group: 'content',
    skeleton: 'alerts',
    build: buildCalloutTip,
  },
  {
    id: 'ar-news',
    code: 'AR10',
    label: 'Newsletter CTA',
    description: 'Odběr tipů',
    group: 'content',
    skeleton: 'cta',
    build: buildNewsletter,
  },

  /* O nás */
  {
    id: 'about',
    code: 'AB01',
    label: 'O nás',
    description: 'Text + obrázek',
    group: 'about',
    skeleton: 'split',
    build: buildAbout,
  },
]

export const blockGroups: Record<BlockGroup, string> = {
  product: 'Produkt',
  features: 'Features',
  steps: 'Jak to funguje',
  trust: 'Důvěra',
  content: 'Články',
  about: 'O nás',
}
