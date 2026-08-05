export interface DashboardNavItem {
  to: string
  label: string
  icon: string
  active: boolean
  placeholder?: boolean
}

/**
 * Shared dashboard navigation (rail + sidebar).
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

  const links = computed<DashboardNavItem[]>(() => [
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
      to: localePath('dashboard-messages'),
      label: t('dashboard.nav.messages'),
      icon: 'i-lucide-mail',
      active: name.value.startsWith('dashboard-messages'),
    },
    {
      to: '#',
      label: t('dashboard.nav.media'),
      icon: 'i-lucide-image',
      active: false,
      placeholder: true,
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
      label: t('dashboard.nav.settings'),
      icon: 'i-lucide-settings',
      active: false,
      placeholder: true,
    },
  ])

  const rail = computed(() =>
    links.value.filter(link => !link.placeholder || link.icon),
  )

  const primary = computed(() =>
    links.value.filter(link => !link.placeholder),
  )

  const placeholders = computed(() =>
    links.value.filter(link => link.placeholder),
  )

  return {
    links,
    rail,
    primary,
    placeholders,
  }
}
