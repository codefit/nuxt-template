/**
 * Localized nav / footer links (route names + i18n labels).
 */
export function useSiteNav() {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const nav = computed(() => [
    { to: localePath('index'), label: t('nav.home') },
    { to: localePath('articles'), label: t('nav.articles') },
    { to: localePath('common-gallery'), label: t('nav.gallery') },
    { to: localePath('common-about'), label: t('nav.about') },
    { to: localePath('common-contact'), label: t('nav.contact') },
  ])

  const footer = computed(() => [
    { to: localePath('articles'), label: t('nav.articles') },
    { to: localePath('common-gallery'), label: t('nav.gallery') },
    { to: localePath('common-contact'), label: t('nav.contact') },
    { to: localePath('common-gdpr'), label: t('nav.gdpr') },
    { to: localePath('common-obchodni-podminky'), label: t('nav.terms') },
    { to: localePath('common-cookies'), label: t('nav.cookies') },
    { to: localePath('dashboard'), label: t('nav.dashboard') },
  ])

  return {
    nav,
    footer,
  }
}
