<script setup lang="ts">
/**
 * Isolated product landing example — full-viewport toggles, no site chrome.
 */
definePageMeta({
  layout: 'landing',
  pageTransition: false,
})

useHead({
  title: 'Vichy Capital Soleil — landing example',
})

type SectionId = 'intro' | 'benefits' | 'actives' | 'usage' | 'details'

interface Section {
  id: SectionId
  label: string
  eyebrow: string
  title: string
  lead: string
  points: string[]
  cta: string
  panel: string
  tone: string
}

/** Vertical stack panels — add entries to extend the left-column swiper. */
type StackId = 'hero' | 'offers'

interface StackSlide {
  id: StackId
  label: string
}

const stackSlides: StackSlide[] = [
  { id: 'hero', label: 'Text' },
  { id: 'offers', label: 'Vlastnosti' },
]

const sections: Section[] = [
  {
    id: 'intro',
    label: 'Úvod',
    eyebrow: 'Capital Soleil · SPF 30',
    title: 'Ochranný sprej s beta-karotenem pro sjednocené opálení.',
    lead: 'Ultralehký ochranný sprej s betakarotenem a mineralizující termální vodou Vichy. Velmi lehká textura podobná vodě, snadno se roztírá a nezanechává bílé stopy.',
    points: [
      'SPF 30 — vysoká UV ochrana',
      '200 ml sprej na celé tělo',
      'Hypoalergenní, testováno na citlivé pleti',
    ],
    cta: 'Prozkoumat výhody',
    panel: '/images/example/hero-1.avif',
    tone: 'from-amber-200/40 via-transparent to-sky-200/30',
  },
  {
    id: 'benefits',
    label: 'Výhody',
    eyebrow: 'Proč Capital Soleil',
    title: 'Bronzový tón, svěžest a ochrana v jednom gestu.',
    lead: 'Složení je obohaceno o betakaroten pro podporu sjednoceného tónu pleti a zvýraznění opálení. Koriguje a předchází známkám stárnutí způsobených slunečním zářením.',
    points: [
      'Zvýraznění bronzového tónu díky betakarotenu',
      'Odolný vůči vodě a potu',
      'Příjemná parfemace',
      'Působí proti vráskám, ztrátě elasticity a jasu',
    ],
    cta: 'Aktivní složky',
    panel: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80',
    tone: 'from-orange-200/35 via-transparent to-yellow-100/40',
  },
  {
    id: 'actives',
    label: 'Složky',
    eyebrow: 'Aktivní péče',
    title: 'Betakaroten, vitamin E a termální voda Vichy.',
    lead: 'Klíčové aktivní složky podporují jednotný tón opálení, chrání před volnými radikály a doplňují péči mineralizující termální vodou vulkanického původu.',
    points: [
      'Betakaroten — zvýrazňuje a sjednocuje tón opálení',
      'Vitamin E — antioxidant proti volným radikálům',
      'Termální voda Vichy vulkanického původu',
    ],
    cta: 'Jak aplikovat',
    panel: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80',
    tone: 'from-lime-200/30 via-transparent to-amber-100/35',
  },
  {
    id: 'usage',
    label: 'Aplikace',
    eyebrow: 'Doporučené použití',
    title: 'Protřepejte, naneste dostatečné množství, opakujte.',
    lead: 'Pro optimální ochranu před sluneční expozicí důkladně protřepejte a aplikujte systematicky otáčivým pohybem na celé tělo. Ochrana se snižuje při nedostatečném protřepání.',
    points: [
      'Opakujte zejména při potu, koupání nebo osušení',
      'Na obličej nestříkejte přímo — nejdřív do dlaní',
      'Vyhněte se okolí očí',
    ],
    cta: 'Detaily produktu',
    panel: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80',
    tone: 'from-sky-200/35 via-transparent to-stone-100/40',
  },
  {
    id: 'details',
    label: 'Detaily',
    eyebrow: 'Informace o produktu',
    title: 'Vichy Capital Soleil · 200 ml · Francie.',
    lead: 'Ochranný sprej s beta-karotenem SPF 30. Forma: sprej. Určeno pro citlivou pokožku. Země původu Francie, výrobce L\'Oréal Česká republika s.r.o.',
    points: [
      'Kód výrobku 370720 · EAN 3337875585217',
      'Balení obsahuje 200 ml',
      'Hodnocení zákazníků 94 % (6 hodnocení)',
    ],
    cta: 'Zpět na úvod',
    panel: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1400&q=80',
    tone: 'from-yellow-200/40 via-transparent to-orange-100/30',
  },
]

const active = ref<SectionId>('intro')

const current = computed(() =>
  sections.find(section => section.id === active.value) ?? sections[0],
)

const nextId = computed<SectionId>(() => {
  const index = sections.findIndex(section => section.id === active.value)
  return sections[(index + 1) % sections.length]!.id
})

function select(id: SectionId) {
  active.value = id
}

function goNext() {
  active.value = nextId.value
}

const pillPos: Record<SectionId, string> = {
  intro: 'left-[22%] top-[14%]',
  benefits: 'right-[14%] top-[22%]',
  actives: 'left-[20%] top-[42%]',
  usage: 'right-[12%] top-[52%]',
  details: 'left-[24%] bottom-[30%]',
}

const socials = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5z',
    extra: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
] as const

interface Variant {
  id: string
  label: string
  price: string
  image: string
  section: SectionId
}

const variants: Variant[] = [
  {
    id: 'spf30',
    label: 'Sprej SPF 30',
    price: '699 Kč',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    section: 'intro',
  },
  {
    id: 'spf50',
    label: 'Krém SPF 50+',
    price: '699 Kč',
    image: 'https://images.unsplash.com/photo-1570172619604-71de189aa7ea?auto=format&fit=crop&w=600&q=80',
    section: 'benefits',
  },
  {
    id: 'spots',
    label: 'Proti skvrnám',
    price: '699 Kč',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    section: 'actives',
  },
  {
    id: 'water',
    label: 'Solar Water',
    price: '649 Kč',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    section: 'usage',
  },
]

const stackViewport = useTemplateRef<HTMLElement>('stackViewport')

const stackPage = ref(0)
const stackBusy = ref(false)
const isDesktop = ref(false)

const canPrev = computed(() => stackPage.value > 0)
const canNext = computed(() => stackPage.value < stackSlides.length - 1)

const stackStyle = computed(() => {
  if (!isDesktop.value) {
    return undefined
  }
  return {
    transform: `translate3d(0, ${-stackPage.value * 100}%, 0)`,
  }
})

function goStack(page: number) {
  if (!isDesktop.value) {
    return
  }

  const next = Math.max(0, Math.min(page, stackSlides.length - 1))
  if (next === stackPage.value) {
    return
  }

  stackPage.value = next
  stackBusy.value = true
}

function stepStack(dir: 1 | -1) {
  if (stackBusy.value) {
    return
  }
  goStack(stackPage.value + dir)
}

function onStackTransitionEnd(event: TransitionEvent) {
  if (event.propertyName !== 'transform') {
    return
  }
  stackBusy.value = false
}

function onStackWheel(event: WheelEvent) {
  if (!isDesktop.value || stackBusy.value) {
    return
  }
  if (Math.abs(event.deltaY) < 12) {
    return
  }
  event.preventDefault()
  stepStack(event.deltaY > 0 ? 1 : -1)
}

const pointsNav = reactive({ canPrev: false, canNext: false })
const variantsNav = reactive({ canPrev: false, canNext: false })

const arrowClass = (on: boolean) =>
  on
    ? 'bg-white text-neutral-800 ring-1 ring-black/8 hover:bg-neutral-50'
    : 'cursor-not-allowed bg-white/50 text-neutral-400 opacity-35 ring-1 ring-black/5'

function trackEdge(el: HTMLElement | null | undefined) {
  if (!el) {
    return { canPrev: false, canNext: false }
  }
  const max = el.scrollWidth - el.clientWidth
  if (max <= 2) {
    return { canPrev: false, canNext: false }
  }
  return {
    canPrev: el.scrollLeft > 2,
    canNext: el.scrollLeft < max - 2,
  }
}

function syncTracks() {
  const root = stackViewport.value
  Object.assign(pointsNav, trackEdge(root?.querySelector('[data-points-track]')))
  Object.assign(variantsNav, trackEdge(root?.querySelector('[data-variants-track]')))
}

function scrollTrack(root: ParentNode | null | undefined, trackSel: string, cardSel: string, dir: 1 | -1) {
  const el = root?.querySelector<HTMLElement>(trackSel)
  if (!el) {
    return
  }
  const card = el.querySelector<HTMLElement>(cardSel)
  const step = card ? card.offsetWidth + 12 : 180
  const left = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + dir * step))

  // iOS often ignores smooth scrollTo on overflow rows — assign left directly.
  if (!isDesktop.value) {
    el.scrollLeft = left
    syncTracks()
    return
  }

  el.scrollTo({ left, behavior: 'smooth' })
}

function scrollBy(dir: 1 | -1) {
  scrollTrack(stackViewport.value, '[data-variants-track]', '[data-card]', dir)
}

function scrollPoints(dir: 1 | -1) {
  scrollTrack(stackViewport.value, '[data-points-track]', '[data-point]', dir)
}

function onTrackScroll(event: Event) {
  const el = event.currentTarget
  if (!(el instanceof HTMLElement)) {
    return
  }
  if (el.hasAttribute('data-points-track')) {
    Object.assign(pointsNav, trackEdge(el))
    return
  }
  if (el.hasAttribute('data-variants-track')) {
    Object.assign(variantsNav, trackEdge(el))
  }
}

let media: MediaQueryList | undefined
let viewportEl: HTMLElement | undefined

function syncDesktop() {
  isDesktop.value = media?.matches ?? false
  if (!isDesktop.value) {
    stackBusy.value = false
  }
}

watch(active, async () => {
  if (stackPage.value === 0) {
    stackBusy.value = false
  }
  else {
    goStack(0)
  }
  await nextTick()
  syncTracks()
})

watch(stackPage, async () => {
  await nextTick()
  syncTracks()
})

onMounted(() => {
  media = window.matchMedia('(min-width: 1024px)')
  syncDesktop()
  media.addEventListener('change', syncDesktop)

  viewportEl = stackViewport.value ?? undefined
  viewportEl?.addEventListener('wheel', onStackWheel, { passive: false })

  syncTracks()
  window.addEventListener('resize', syncTracks)
})

onUnmounted(() => {
  media?.removeEventListener('change', syncDesktop)
  viewportEl?.removeEventListener('wheel', onStackWheel)
  window.removeEventListener('resize', syncTracks)
})
</script>

<template>
  <div class="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col gap-6 px-5 py-5 sm:px-8 lg:h-dvh lg:flex-row lg:gap-8 lg:overflow-hidden lg:px-10 lg:py-8">
    <!-- Copy — below visual on mobile, left on desktop -->
    <section class="order-2 flex min-h-0 flex-1 flex-col lg:order-1 lg:max-w-[42%] lg:py-4">
      <header class="flex shrink-0 items-center justify-between gap-4">
        <p class="text-lg font-extrabold tracking-tight">
          VICHY<span class="text-amber-500">+</span>
        </p>
        <p class="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-black/5">
          Example landing
        </p>
      </header>

      <!-- Vertical section swiper — same transform transition for arrows, dots, wheel -->
      <div
        ref="stackViewport"
        class="relative my-8 min-h-0 flex-1 lg:my-4 lg:overflow-hidden lg:pr-12"
      >
        <div
          class="flex flex-col gap-12 lg:h-full lg:gap-0 lg:transition-transform lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
          :style="stackStyle"
          @transitionend="onStackTransitionEnd"
        >
          <div
            v-for="slide in stackSlides"
            :id="`stack-${slide.id}`"
            :key="slide.id"
            class="flex min-h-0 flex-col justify-center lg:h-full lg:shrink-0"
          >
            <Transition
              mode="out-in"
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="translate-y-3 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-2 opacity-0"
            >
              <!-- Slide: nadpis + popis + tlačítka -->
              <div
                v-if="slide.id === 'hero'"
                :key="`hero-${current.id}`"
                class="max-w-xl"
              >
                <p class="mb-3 text-sm font-medium text-neutral-500">
                  {{ current.eyebrow }}
                </p>

                <h1 class="line-clamp-2 min-h-[2.2em] text-3xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 sm:text-4xl xl:text-5xl">
                  {{ current.title }}
                </h1>

                <p class="mt-5 line-clamp-3 min-h-[4.875em] max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {{ current.lead }}
                </p>

                <div class="mt-8 flex flex-nowrap items-center gap-3 overflow-x-auto hide-scroll">
                  <button
                    type="button"
                    class="shrink-0 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    @click="goNext"
                  >
                    {{ current.cta }}
                  </button>
                  <a
                    href="https://www.lekarna.cz/vichy-ideal-soleil-eau-prot-bronz-spf-30-200-ml/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-800 ring-1 ring-black/8 transition hover:bg-neutral-50"
                  >
                    699 Kč · 200 ml
                  </a>
                </div>

                <button
                  type="button"
                  class="mt-6 hidden text-sm font-semibold text-neutral-900 underline decoration-neutral-900/35 underline-offset-4 transition hover:decoration-neutral-900 lg:inline-flex"
                  @click="goStack(1)"
                >
                  Klíčové vlastnosti a varianty
                </button>
              </div>

              <!-- Slide: vlastnosti + varianty -->
              <div
                v-else-if="slide.id === 'offers'"
                :key="`offers-${current.id}`"
                class="flex max-w-xl flex-col gap-8"
              >
                <div>
                  <div class="mb-2.5 flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Klíčové vlastnosti
                    </p>
                    <div class="flex gap-1.5">
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full transition"
                        :class="arrowClass(pointsNav.canPrev)"
                        :disabled="!pointsNav.canPrev"
                        aria-label="Předchozí vlastnost"
                        @click="scrollPoints(-1)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          class="size-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full transition"
                        :class="arrowClass(pointsNav.canNext)"
                        :disabled="!pointsNav.canNext"
                        aria-label="Další vlastnost"
                        @click="scrollPoints(1)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          class="size-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <ul
                    data-points-track
                    class="hide-scroll flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Klíčové vlastnosti"
                    @scroll.passive="onTrackScroll"
                  >
                    <li
                      v-for="point in current.points"
                      :key="point"
                      data-point
                      class="flex w-[78%] shrink-0 snap-start items-start gap-3 rounded-2xl bg-white/70 px-4 py-3.5 text-sm text-neutral-700 ring-1 ring-black/5 sm:w-[58%] lg:w-[calc((100%-1.5rem)/2.5)]"
                    >
                      <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-sm font-bold text-neutral-900">
                        +
                      </span>
                      <span class="line-clamp-3 leading-snug">{{ point }}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Varianty produktu
                    </p>
                    <div class="flex gap-1.5">
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full transition"
                        :class="arrowClass(variantsNav.canPrev)"
                        :disabled="!variantsNav.canPrev"
                        aria-label="Předchozí"
                        @click="scrollBy(-1)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          class="size-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-full transition"
                        :class="arrowClass(variantsNav.canNext)"
                        :disabled="!variantsNav.canNext"
                        aria-label="Další"
                        @click="scrollBy(1)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          class="size-4"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    data-variants-track
                    class="hide-scroll flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Varianty produktu"
                    @scroll.passive="onTrackScroll"
                  >
                    <button
                      v-for="item in variants"
                      :key="item.id"
                      type="button"
                      data-card
                      class="group relative h-36 w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-2xl text-left shadow-sm ring-1 ring-black/5 transition hover:ring-amber-300/80 sm:h-40 sm:w-40"
                      :class="active === item.section ? 'ring-2 ring-amber-400' : ''"
                      @click="select(item.section)"
                    >
                      <img
                        :src="item.image"
                        :alt="item.label"
                        class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                        <div>
                          <p class="text-sm font-semibold text-white">
                            {{ item.label }}
                          </p>
                          <p class="text-[11px] text-white/80">
                            {{ item.price }}
                          </p>
                        </div>
                        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md">
                          <svg
                            viewBox="0 0 24 24"
                            class="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            aria-hidden="true"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div
          class="pointer-events-none absolute end-0 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-1.5 lg:pointer-events-auto lg:flex"
          aria-label="Navigace panelů"
        >
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-full text-neutral-800 transition"
            :class="canPrev
              ? 'bg-white ring-1 ring-black/8 hover:bg-neutral-50'
              : 'cursor-not-allowed bg-white/50 text-neutral-400 opacity-35 ring-1 ring-black/5'"
            :disabled="!canPrev"
            aria-label="Předchozí panel"
            @click="stepStack(-1)"
          >
            <svg
              viewBox="0 0 24 24"
              class="size-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>

          <div class="flex flex-col items-center gap-2 py-1">
            <button
              v-for="(slide, index) in stackSlides"
              :key="slide.id"
              type="button"
              class="size-2 rounded-full transition"
              :class="stackPage === index ? 'scale-125 bg-neutral-900' : 'bg-neutral-300 hover:bg-neutral-500'"
              :aria-label="slide.label"
              @click="goStack(index)"
            />
          </div>

          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-full text-neutral-800 transition"
            :class="canNext
              ? 'bg-white ring-1 ring-black/8 hover:bg-neutral-50'
              : 'cursor-not-allowed bg-white/50 text-neutral-400 opacity-35 ring-1 ring-black/5'"
            :disabled="!canNext"
            aria-label="Další panel"
            @click="stepStack(1)"
          >
            <svg
              viewBox="0 0 24 24"
              class="size-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        class="flex shrink-0 flex-wrap gap-2"
        aria-label="Sekce produktu"
      >
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="rounded-full px-3.5 py-2 text-xs font-semibold transition"
          :class="active === section.id
            ? 'bg-neutral-950 text-white'
            : 'bg-white/80 text-neutral-600 ring-1 ring-black/5 hover:bg-white'"
          @click="select(section.id)"
        >
          {{ section.label }}
        </button>
      </nav>
    </section>

    <!-- Visual panel — first on mobile, right on desktop -->
    <section class="landing-stage relative order-1 min-h-[420px] flex-1 lg:order-2 lg:min-h-0">
      <div class="landing-panel absolute inset-0 bg-[#deded9]">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="scale-105 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-[1.02] opacity-0"
        >
          <div
            :key="current.id"
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url('${current.panel}')` }"
          />
        </Transition>

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br"
          :class="current.tone"
        />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="absolute z-30 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition duration-300"
          :class="[
            pillPos[section.id],
            active === section.id
              ? 'scale-105 bg-amber-300 text-neutral-950'
              : 'bg-white/90 text-neutral-800 hover:bg-white',
          ]"
          @click="select(section.id)"
        >
          <span
            class="flex size-5 items-center justify-center rounded-full text-[11px] font-bold"
            :class="active === section.id ? 'bg-neutral-950 text-amber-300' : 'bg-amber-300 text-neutral-950'"
          >
            {{ active === section.id ? '✓' : '+' }}
          </span>
          {{ section.label }}
        </button>

        <div class="absolute bottom-[22%] left-[12%] z-10 max-w-[220px] rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur">
          <p class="text-sm font-bold text-neutral-900">
            4.9 · hodnocení
          </p>
          <p class="mt-1 text-xs text-neutral-500">
            94 % spokojenost · 6 recenzí
          </p>
          <div class="mt-3 flex -space-x-2">
            <span
              v-for="n in 4"
              :key="n"
              class="size-7 rounded-full bg-gradient-to-br ring-2 ring-white"
              :class="{
                'from-amber-200 to-orange-400': n === 1,
                'from-sky-200 to-blue-400': n === 2,
                'from-lime-200 to-emerald-400': n === 3,
                'from-rose-200 to-pink-400': n === 4,
              }"
            />
          </div>
        </div>
      </div>

      <div
        class="landing-cutout landing-cutout--tl"
        aria-label="Sociální sítě"
      >
        <a
          v-for="item in socials"
          :key="item.label"
          :href="item.href"
          :aria-label="item.label"
          class="relative z-[1] flex size-11 items-center justify-center rounded-xl bg-[#2f2f2f] text-white transition hover:bg-neutral-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="item.path" />
            <path
              v-if="'extra' in item && item.extra"
              :d="item.extra"
            />
          </svg>
        </a>
      </div>

      <div class="landing-cutout landing-cutout--br">
        <button
          type="button"
          class="relative z-[1] rounded-full bg-amber-300 px-6 py-3.5 text-sm font-bold text-neutral-950 transition hover:bg-amber-200"
          @click="goNext"
        >
          Další sekce
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll::-webkit-scrollbar {
  display: none;
}

.landing-stage {
  --c: #f3f3f1;
  --r: 1.25rem;
  --or: 2.75rem;
  position: relative;
  border-radius: var(--or);
  background: var(--c);
}

.landing-panel {
  border-radius: var(--or);
  overflow: hidden;
}

.landing-cutout {
  position: absolute;
  z-index: 20;
  display: flex;
  background: var(--c);
}

.landing-cutout::before,
.landing-cutout::after {
  content: '';
  position: absolute;
  width: var(--r);
  height: var(--r);
  pointer-events: none;
}

.landing-cutout--tl {
  top: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem;
  border-bottom-right-radius: var(--r);
}

.landing-cutout--tl::before {
  top: 0;
  left: 100%;
  background: radial-gradient(
    circle at 100% 100%,
    transparent var(--r),
    var(--c) calc(var(--r) + 0.5px)
  );
}

.landing-cutout--tl::after {
  top: 100%;
  left: 0;
  background: radial-gradient(
    circle at 100% 100%,
    transparent var(--r),
    var(--c) calc(var(--r) + 0.5px)
  );
}

.landing-cutout--br {
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  padding: 0.85rem;
  border-top-left-radius: var(--r);
}

.landing-cutout--br::before {
  right: 0;
  bottom: 100%;
  background: radial-gradient(
    circle at 0 0,
    transparent var(--r),
    var(--c) calc(var(--r) + 0.5px)
  );
}

.landing-cutout--br::after {
  right: 100%;
  bottom: 0;
  background: radial-gradient(
    circle at 0 0,
    transparent var(--r),
    var(--c) calc(var(--r) + 0.5px)
  );
}

@media (min-width: 1024px) {
  .landing-stage {
    --r: 1.5rem;
    --or: 3.25rem;
  }

  .landing-cutout--tl {
    padding: 0 1rem 1rem 0;
  }

  .landing-cutout--br {
    padding: 1rem 0 0 1rem;
  }
}
</style>
