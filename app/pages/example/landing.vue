<script setup lang="ts">
/**
 * Isolated product landing example — full-viewport toggles, no site chrome.
 */
import { AnimatePresence, motion, useAnimate } from 'motion-v'

definePageMeta({
  layout: 'landing',
  pageTransition: false,
})

useHead({
  title: 'CeraVe Hydratační čisticí pěnící olej — landing example',
})

const productUrl = 'https://www.dervit.cz/zbozi/cerave-cistici-penici-olej-473ml'

const easeOut = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
}

const heroGroup = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
}

const softSpring = { type: 'spring' as const, stiffness: 420, damping: 28 }

/** Brand splash covers first paint; content animates only after reveal. */
const splash = ref(true)
const ready = ref(false)
const [splashScope, runSplash] = useAnimate()

const show = computed(() => (ready.value ? 'visible' : 'hidden'))

async function playSplash() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const root = splashScope.value
  if (reduce || !root) {
    splash.value = false
    ready.value = true
    return
  }

  // Fade logo in
  await runSplash(
    '[data-splash-logo]',
    { opacity: [0, 1], y: [12, 0] },
    { duration: 0.7, ease: easeOut },
  )

  // Short calm beat
  await runSplash(root, { opacity: 1 }, { delay: 0.4, duration: 0.01 })

  // Soft dissolve out
  await Promise.all([
    runSplash(
      '[data-splash-logo]',
      { opacity: 0, y: -8 },
      { duration: 0.45, ease: easeOut },
    ),
    runSplash(
      root,
      { opacity: 0 },
      { duration: 0.5, ease: easeOut, delay: 0.05 },
    ),
  ])
  splash.value = false
  ready.value = true
}

type SectionId = 'intro' | 'benefits' | 'actives' | 'usage'

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
    eyebrow: 'CeraVe · 473 ml',
    title: 'Hydratační čisticí pěnící olej pro suchou a citlivou pokožku.',
    lead: 'Pěnící olejová formule vyvinutá ve spolupráci s dermatology. Jemně čistí, hydratuje a zklidňuje pokožku, aniž by narušila ochrannou kožní bariéru.',
    points: [
      'Pro normální až velmi suchou pokožku',
      'Vhodné i pro atopickou pokožku a kojence',
      'Bez mýdla, bez parfemace, hypoalergenní',
    ],
    cta: 'Prozkoumat výhody',
    panel: '/images/example/Claid-AI-756dc01a6a814482a495751b51d39413.webp',
    tone: 'from-sky-200/35 via-transparent to-blue-100/30',
  },
  {
    id: 'benefits',
    label: 'Výhody',
    eyebrow: 'Proč CeraVe',
    title: 'Čistí a hydratuje v jednom kroku — bez mastných reziduí.',
    lead: 'Unikátní pěnící olejová formule kombinuje relipidační oleje s ceramidy. Čistí nečistoty a zároveň pomáhá pokožce doplnit hydrataci.',
    points: [
      'Šetrné čištění bez vysoušení',
      'Hydratace a výživa během mytí',
      'Zklidňuje podráždění a zarudnutí',
      'Nekomedogenní, vyvážené pH',
    ],
    cta: 'Aktivní složky',
    panel: '/images/example/Claid-AI-5b8e179ee67b4bcabfe2d8ab35c94e1b.webp',
    tone: 'from-cyan-100/40 via-transparent to-sky-200/25',
  },
  {
    id: 'actives',
    label: 'Složky',
    eyebrow: 'Aktivní péče',
    title: 'Tři esenciální ceramidy, skvalen a kyselina hyaluronová.',
    lead: 'Klíčové složky obnovují kožní bariéru, dodávají lipidy a podporují hydrataci. Formule obsahuje ceramidy 1, 3 a 6-II spolu s relipidačními oleji.',
    points: [
      'Ceramidy NP, AP a EOP — obnova bariéry',
      'Skvalen a triglyceridy — relipidace',
      'Kyselina hyaluronová a niacinamid',
    ],
    cta: 'Jak aplikovat',
    panel: '/images/example/Claid-AI-7b698b6158a34e129d1f7d6b2b8c59d5.webp',
    tone: 'from-blue-100/35 via-transparent to-teal-100/30',
  },
  {
    id: 'usage',
    label: 'Aplikace',
    eyebrow: 'Doporučené použití',
    title: 'Vmasírujte do navlhčené pokožky a opláchněte.',
    lead: 'Přípravek naneste na navlhčenou pokožku obličeje nebo těla, jemně vmasírujte a důkladně opláchněte vodou. Vyhněte se kontaktu s očima.',
    points: [
      'Používejte ráno i večer dle potřeby',
      'Vhodné na obličej i tělo',
      'Při kontaktu s očima ihned vypláchněte',
    ],
    cta: 'Zpět na úvod',
    panel: '/images/example/Claid-AI-3d86bf2580d1474cad5b69d8376fdff0.webp',
    tone: 'from-slate-200/30 via-transparent to-sky-100/35',
  },
]

const active = ref<SectionId>('intro')

/** Presentation: auto-cycle sections. Flip to false to pause. */
const autoplay = ref(true)
const autoMs = 4000

const current = computed(() =>
  sections.find(section => section.id === active.value) ?? sections[0],
)

const nextId = computed<SectionId>(() => {
  const index = sections.findIndex(section => section.id === active.value)
  return sections[(index + 1) % sections.length]!.id
})

let autoTimer: ReturnType<typeof setInterval> | undefined

function stopAuto() {
  if (!autoTimer) {
    return
  }
  clearInterval(autoTimer)
  autoTimer = undefined
}

function startAuto() {
  stopAuto()
  if (!autoplay.value || import.meta.server) {
    return
  }
  autoTimer = setInterval(() => {
    active.value = nextId.value
  }, autoMs)
}

function select(id: SectionId) {
  active.value = id
  startAuto()
}

function goNext() {
  active.value = nextId.value
  startAuto()
}

function onVisibility() {
  if (document.hidden) {
    stopAuto()
    return
  }
  startAuto()
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
    id: 'oil',
    label: 'Čisticí olej',
    price: '340 Kč',
    image: '/images/example/Claid-AI-756dc01a6a814482a495751b51d39413.webp',
    section: 'intro',
  },
  {
    id: 'hydrate',
    label: 'Hydratace',
    price: '473 ml',
    image: '/images/example/Claid-AI-5b8e179ee67b4bcabfe2d8ab35c94e1b.webp',
    section: 'benefits',
  },
  {
    id: 'ceramides',
    label: '3 ceramidy',
    price: '473 ml',
    image: '/images/example/Claid-AI-7b698b6158a34e129d1f7d6b2b8c59d5.webp',
    section: 'actives',
  },
  {
    id: 'routine',
    label: 'Aplikace',
    price: '473 ml',
    image: '/images/example/Claid-AI-3d86bf2580d1474cad5b69d8376fdff0.webp',
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

watch(autoplay, (on) => {
  if (on) {
    startAuto()
    return
  }
  stopAuto()
})

onMounted(async () => {
  media = window.matchMedia('(min-width: 1024px)')
  syncDesktop()
  media.addEventListener('change', syncDesktop)

  viewportEl = stackViewport.value ?? undefined
  viewportEl?.addEventListener('wheel', onStackWheel, { passive: false })

  syncTracks()
  window.addEventListener('resize', syncTracks)
  document.addEventListener('visibilitychange', onVisibility)

  await playSplash()
  startAuto()
})

onUnmounted(() => {
  stopAuto()
  media?.removeEventListener('change', syncDesktop)
  viewportEl?.removeEventListener('wheel', onStackWheel)
  window.removeEventListener('resize', syncTracks)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div class="relative mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col gap-6 px-5 py-5 sm:px-8 lg:h-dvh lg:flex-row lg:gap-8 lg:overflow-hidden lg:px-10 lg:py-8">
    <!-- Brand splash — soft dissolve into page -->
    <div
      v-if="splash"
      ref="splashScope"
      data-splash-root
      class="fixed inset-0 z-[80] flex items-center justify-center bg-[#f3f3f1]"
      aria-hidden="true"
    >
      <img
        data-splash-logo
        src="/images/example/cerave.svg"
        alt=""
        class="h-16 w-auto sm:h-20"
        style="opacity: 0; transform: translateY(12px)"
      >
    </div>

    <!-- Copy — below visual on mobile, left on desktop -->
    <section class="order-2 flex min-h-0 flex-1 flex-col lg:order-1 lg:max-w-[42%]">
      <header class="flex shrink-0 items-start justify-between gap-4">
        <motion.p
          class="text-lg font-extrabold tracking-tight"
          :initial="{ opacity: 0, y: -12 }"
          :animate="ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }"
          :transition="{ duration: 0.55, ease: easeOut }"
        >
          <img
            src="/images/example/cerave.svg"
            alt="CeraVe"
            class="h-14"
          >
        </motion.p>
        <motion.div
          class="shrink-0"
          :initial="{ opacity: 0, x: 12 }"
          :animate="ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }"
          :transition="{ duration: 0.5, delay: ready ? 0.08 : 0, ease: easeOut }"
        >
          <NuxtLink href="https://www.cerave.cz/" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/example/dermatology.png"
              alt="Doporučováno Dermatology"
              class="h-16 w-16 object-contain sm:h-20 sm:w-20"
            >
          </NuxtLink>
          
        </motion.div>
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
            <AnimatePresence mode="wait">
              <!-- Slide: nadpis + popis + tlačítka -->
              <motion.div
                v-if="slide.id === 'hero'"
                :key="`hero-${current.id}`"
                class="max-w-xl"
                :variants="heroGroup"
                initial="hidden"
                :animate="show"
                exit="exit"
              >
                <motion.p
                  class="mb-3 text-sm font-medium text-neutral-500"
                  :variants="fadeUp"
                >
                  {{ current.eyebrow }}
                </motion.p>

                <motion.h1
                  class="line-clamp-2 min-h-[2.2em] text-3xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 sm:text-4xl xl:text-5xl"
                  :variants="fadeUp"
                >
                  {{ current.title }}
                </motion.h1>

                <motion.p
                  class="mt-5 line-clamp-3 min-h-[4.875em] max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base"
                  :variants="fadeUp"
                >
                  {{ current.lead }}
                </motion.p>

                <motion.div
                  class="mt-8 flex flex-nowrap items-center gap-3 overflow-x-auto hide-scroll"
                  :variants="fadeUp"
                >
                  <motion.button
                    type="button"
                    class="shrink-0 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white"
                    :whileHover="{ scale: 1.03, backgroundColor: '#262626' }"
                    :whilePress="{ scale: 0.97 }"
                    :transition="softSpring"
                    @click="goNext"
                  >
                    {{ current.cta }}
                  </motion.button>
                  <motion.a
                    :href="productUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-800 ring-1 ring-black/8"
                    :whileHover="{ scale: 1.03, backgroundColor: '#fafafa' }"
                    :whilePress="{ scale: 0.97 }"
                    :transition="softSpring"
                  >
                    340 Kč · 473 ml
                  </motion.a>
                </motion.div>

                <motion.button
                  type="button"
                  class="mt-6 hidden text-sm font-semibold text-neutral-900 underline decoration-neutral-900/35 underline-offset-4 lg:inline-flex"
                  :variants="fadeUp"
                  :whileHover="{ opacity: 0.7 }"
                  @click="goStack(1)"
                >
                  Klíčové vlastnosti a varianty
                </motion.button>
              </motion.div>

              <!-- Slide: vlastnosti + varianty -->
              <motion.div
                v-else-if="slide.id === 'offers'"
                :key="`offers-${current.id}`"
                class="flex max-w-xl flex-col gap-8"
                :initial="{ opacity: 0, y: 20 }"
                :animate="ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }"
                :exit="{ opacity: 0, y: -12 }"
                :transition="{ duration: 0.4, ease: easeOut }"
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
                    <motion.li
                      v-for="(point, index) in current.points"
                      :key="point"
                      data-point
                      class="flex w-[78%] shrink-0 snap-start items-start gap-3 rounded-2xl bg-white/70 px-4 py-3.5 text-sm text-neutral-700 ring-1 ring-black/5 sm:w-[58%] lg:w-[calc((100%-1.5rem)/2.5)]"
                      :initial="{ opacity: 0, y: 14 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :transition="{ duration: 0.4, delay: index * 0.05, ease: easeOut }"
                      :whileHover="{ y: -2, backgroundColor: 'rgba(255,255,255,0.92)' }"
                    >
                      <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0070ce]/15 text-sm font-bold text-[#0070ce]">
                        +
                      </span>
                      <span class="line-clamp-3 leading-snug">{{ point }}</span>
                    </motion.li>
                  </ul>
                </div>

                <div>
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Náhledy produktu
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
                    aria-label="Náhledy produktu"
                    @scroll.passive="onTrackScroll"
                  >
                    <motion.button
                      v-for="(item, index) in variants"
                      :key="item.id"
                      type="button"
                      data-card
                      class="group relative h-36 w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-2xl text-left shadow-sm ring-1 ring-black/5 sm:h-40 sm:w-40"
                      :class="active === item.section ? 'ring-2 ring-[#0070ce]' : ''"
                      :initial="{ opacity: 0, scale: 0.94 }"
                      :animate="{ opacity: 1, scale: 1 }"
                      :transition="{ duration: 0.4, delay: 0.08 + index * 0.05, ease: easeOut }"
                      :whileHover="{ y: -4 }"
                      :whilePress="{ scale: 0.97 }"
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
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          class="pointer-events-none absolute end-0 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-1.5 lg:pointer-events-auto lg:flex"
          aria-label="Navigace panelů"
          :initial="{ opacity: 0, x: 12 }"
          :animate="ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }"
          :transition="{ duration: 0.45, delay: ready ? 0.2 : 0, ease: easeOut }"
        >
          <motion.button
            type="button"
            class="flex size-7 items-center justify-center rounded-full text-neutral-800"
            :class="canPrev
              ? 'bg-white ring-1 ring-black/8'
              : 'cursor-not-allowed bg-white/50 text-neutral-400 opacity-35 ring-1 ring-black/5'"
            :disabled="!canPrev"
            aria-label="Předchozí panel"
            :whileHover="canPrev ? { scale: 1.08, backgroundColor: '#fafafa' } : undefined"
            :whilePress="canPrev ? { scale: 0.94 } : undefined"
            :transition="softSpring"
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
          </motion.button>

          <div class="relative flex flex-col items-center gap-2 py-1">
            <button
              v-for="(slide, index) in stackSlides"
              :key="slide.id"
              type="button"
              class="relative z-10 size-2 rounded-full"
              :class="stackPage === index ? 'bg-transparent' : 'bg-neutral-300 hover:bg-neutral-500'"
              :aria-label="slide.label"
              @click="goStack(index)"
            >
              <motion.span
                v-if="stackPage === index"
                layoutId="stack-dot"
                class="absolute inset-0 rounded-full bg-neutral-900"
                :transition="{ type: 'spring', stiffness: 420, damping: 30 }"
              />
            </button>
          </div>

          <motion.button
            type="button"
            class="flex size-7 items-center justify-center rounded-full text-neutral-800"
            :class="canNext
              ? 'bg-white ring-1 ring-black/8'
              : 'cursor-not-allowed bg-white/50 text-neutral-400 opacity-35 ring-1 ring-black/5'"
            :disabled="!canNext"
            aria-label="Další panel"
            :whileHover="canNext ? { scale: 1.08, backgroundColor: '#fafafa' } : undefined"
            :whilePress="canNext ? { scale: 0.94 } : undefined"
            :transition="softSpring"
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
          </motion.button>
        </motion.div>
      </div>

      <motion.nav
        class="flex shrink-0 flex-wrap gap-2"
        aria-label="Sekce produktu"
        :initial="{ opacity: 0, y: 14 }"
        :animate="ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }"
        :transition="{ duration: 0.45, delay: ready ? 0.15 : 0, ease: easeOut }"
      >
        <motion.button
          v-for="(section, index) in sections"
          :key="section.id"
          type="button"
          class="relative rounded-full px-3.5 py-2 text-xs font-semibold"
          :class="active === section.id
            ? 'text-white'
            : 'bg-white/80 text-neutral-600 ring-1 ring-black/5'"
          :initial="{ opacity: 0, y: 10 }"
          :animate="ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }"
          :transition="{ duration: 0.4, delay: ready ? 0.18 + index * 0.05 : 0, ease: easeOut }"
          :whileHover="active === section.id ? undefined : { scale: 1.04, backgroundColor: '#ffffff' }"
          :whilePress="{ scale: 0.96 }"
          @click="select(section.id)"
        >
          <motion.span
            v-if="active === section.id"
            layoutId="section-pill"
            class="absolute inset-0 rounded-full bg-neutral-950"
            :transition="{ type: 'spring', stiffness: 380, damping: 32 }"
          />
          <span class="relative z-10">{{ section.label }}</span>
        </motion.button>
      </motion.nav>
    </section>

    <!-- Visual panel — first on mobile, right on desktop -->
    <motion.section
      class="landing-stage relative order-1 min-h-[420px] flex-1 lg:order-2 lg:min-h-0"
      :initial="{ opacity: 0 }"
      :animate="ready ? { opacity: 1 } : { opacity: 0 }"
      :transition="{ duration: 0.65, ease: easeOut }"
    >
      <div class="landing-panel absolute inset-0 bg-[#deded9]">
        <motion.div
          v-for="section in sections"
          :key="section.id"
          class="landing-panel-media absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url('${section.panel}')` }"
          :aria-hidden="active !== section.id"
          :initial="false"
          :animate="active === section.id
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 1.045 }"
          :transition="{ duration: 0.75, ease: easeOut }"
        />

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-br"
          :class="current.tone"
        />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

        <motion.div
          class="absolute bottom-5 left-5 z-10 rounded-[30px] bg-white/95 px-4 py-4 shadow-xl backdrop-blur sm:bottom-6 sm:left-6 lg:px-6"
          :initial="{ opacity: 0, y: 24 }"
          :animate="ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }"
          :transition="{ duration: 0.55, delay: ready ? 0.2 : 0, ease: easeOut }"
        >
          <p class="text-sm font-bold text-neutral-900">
            Hodnocení produktu
          </p>
          <div
            class="mt-1.5 flex items-center gap-0.5"
            aria-hidden="true"
          >
            <svg
              v-for="n in 5"
              :key="n"
              viewBox="0 0 20 20"
              class="size-4 fill-amber-400"
            >
              <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.52L10 14.27l-4.94 2.46.94-5.52-4-3.9 5.53-.8L10 1.5z" />
            </svg>
          </div>
          <p class="mt-1.5 text-xs text-neutral-500">
            Bez parfemace · hypoalergenní
          </p>
        </motion.div>
      </div>

      <motion.div
        class="landing-cutout landing-cutout--tl"
        aria-label="Sociální sítě"
        :initial="{ opacity: 0 }"
        :animate="ready ? { opacity: 1 } : { opacity: 0 }"
        :transition="{ duration: 0.5, delay: ready ? 0.28 : 0, ease: easeOut }"
      >
        <motion.a
          v-for="item in socials"
          :key="item.label"
          :href="item.href"
          :aria-label="item.label"
          class="relative z-[1] flex size-11 items-center justify-center rounded-xl bg-[#85c369] text-white"
          target="_blank"
          rel="noopener noreferrer"
          :whileHover="{ scale: 1.06, backgroundColor: '#262626', transition: softSpring }"
          :whilePress="{ scale: 0.96, transition: softSpring }"
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
        </motion.a>
      </motion.div>

      <motion.div
        class="landing-cutout landing-cutout--br"
        :initial="{ opacity: 0 }"
        :animate="ready ? { opacity: 1 } : { opacity: 0 }"
        :transition="{ duration: 0.5, delay: ready ? 0.32 : 0, ease: easeOut }"
      >
        <motion.a
          :href="productUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="relative z-[1] rounded-xl bg-[#0070ce] px-6 py-3.5 text-sm font-bold text-white sm:rounded-full"
          aria-label="Zobrazit produkt"
          :whileHover="{ scale: 1.03, backgroundColor: '#005bab', transition: softSpring }"
          :whilePress="{ scale: 0.97, transition: softSpring }"
        >
          <span class="hidden sm:inline">Zobrazit produkt&nbsp;</span>
          <span aria-hidden="true">&#x21e2;</span>
        </motion.a>
      </motion.div>
    </motion.section>
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

.landing-panel-media {
  opacity: 0;
  z-index: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.landing-panel-media[aria-hidden='false'] {
  z-index: 1;
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
  padding: 0 0.85rem 0.85rem 0;
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
  padding: 0.85rem 0 0 0.85rem;
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
