export type DashboardSectionId =
  | 'content'
  | 'app'
  | 'communication'
  | 'settings'

export interface DashboardNavLink {
  to: string
  icon: string
  label: string
  active: boolean
  placeholder?: boolean
}

export interface DashboardNavSection {
  id: DashboardSectionId
  icon: string
  label: string
  active: boolean
  children: DashboardNavLink[]
}

/**
 * Section-based dashboard navigation (rail hubs + sidebar children).
 */
export function useDashboardNav() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()

  const name = computed(() => String(route.name ?? ''))

  const isHome = computed(() => {
    const n = name.value
    return n === 'dashboard' || /^dashboard___/.test(n)
  })

  const sections = computed<DashboardNavSection[]>(() => {
    const contentChildren: DashboardNavLink[] = [
      {
        to: localePath('dashboard'),
        label: t('dashboard.nav.home'),
        icon: 'i-lucide-layout-dashboard',
        active: isHome.value,
      },
      {
        to: localePath('dashboard-articles'),
        label: t('dashboard.nav.articles'),
        icon: 'i-lucide-newspaper',
        active: name.value.startsWith('dashboard-articles'),
      },
      {
        to: '#',
        label: t('dashboard.nav.media'),
        icon: 'i-lucide-image',
        active: false,
        placeholder: true,
      },
    ]

    const appChildren: DashboardNavLink[] = [
      {
        to: '#',
        label: t('dashboard.nav.appModules'),
        icon: 'i-lucide-blocks',
        active: false,
        placeholder: true,
      },
    ]

    const communicationChildren: DashboardNavLink[] = [
      {
        to: localePath('dashboard-messages'),
        label: t('dashboard.nav.messages'),
        icon: 'i-lucide-mail',
        active: name.value.startsWith('dashboard-messages'),
      },
    ]

    const settingsChildren: DashboardNavLink[] = [
      {
        to: localePath('dashboard-languages'),
        label: t('dashboard.nav.languages'),
        icon: 'i-lucide-languages',
        active: name.value.startsWith('dashboard-languages'),
      },
      {
        to: '#',
        label: t('dashboard.nav.users'),
        icon: 'i-lucide-users',
        active: false,
        placeholder: true,
      },
      {
        to: '#',
        label: t('dashboard.nav.constants'),
        icon: 'i-lucide-sliders-horizontal',
        active: false,
        placeholder: true,
      },
    ]

    const match = (children: DashboardNavLink[]) =>
      children.some(child => child.active)

    return [
      {
        id: 'content',
        icon: 'i-lucide-files',
        label: t('dashboard.nav.sectionContent'),
        active: match(contentChildren),
        children: contentChildren,
      },
      {
        id: 'app',
        icon: 'i-lucide-app-window',
        label: t('dashboard.nav.sectionApp'),
        active: match(appChildren),
        children: appChildren,
      },
      {
        id: 'communication',
        icon: 'i-lucide-messages-square',
        label: t('dashboard.nav.sectionCommunication'),
        active: match(communicationChildren),
        children: communicationChildren,
      },
      {
        id: 'settings',
        icon: 'i-lucide-settings',
        label: t('dashboard.nav.sectionSettings'),
        active: match(settingsChildren),
        children: settingsChildren,
      },
    ]
  })

  const routeSectionId = computed<DashboardSectionId>(() => {
    const found = sections.value.find(section => section.active)
    return found?.id ?? 'content'
  })

  const selectedId = useState<DashboardSectionId>(
    'dashboard-nav-section',
    () => 'content',
  )

  watch(
    routeSectionId,
    (id) => {
      selectedId.value = id
    },
    { immediate: true },
  )

  const activeSection = computed(
    () =>
      sections.value.find(section => section.id === selectedId.value)
      ?? sections.value[0],
  )

  const links = computed(
    () => activeSection.value?.children ?? [],
  )

  const primary = computed(() =>
    links.value.filter(link => !link.placeholder),
  )

  const placeholders = computed(() =>
    links.value.filter(link => link.placeholder),
  )

  function selectSection(id: DashboardSectionId) {
    selectedId.value = id
  }

  return {
    sections,
    selectedId,
    activeSection,
    links,
    primary,
    placeholders,
    selectSection,
  }
}
