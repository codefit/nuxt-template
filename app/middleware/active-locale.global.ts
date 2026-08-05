/**
 * Inactive locale prefixes (e.g. /en) are not real URLs.
 * - /en           → 404 in default-locale UI
 * - /en/known     → redirect to default-locale path (/about → /o-nas)
 * - /en/unknown   → 404 in default-locale UI
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const languages = await ensureActiveLanguages()
  if (languages.length === 0) {
    return
  }

  const { $i18n } = useNuxtApp()
  const locale = $i18n.locale.value
  if (languages.some(row => row.code === locale)) {
    return
  }

  const fallback = (
    languages.find(row => row.isDefault)?.code
    ?? languages[0]!.code
  ) as typeof $i18n.locale.value

  await $i18n.loadLocaleMessages(fallback)
  $i18n.setLocaleCookie(fallback)
  $i18n.locale.value = fallback

  const prefix = `/${locale}`
  const isRoot = to.path === prefix || to.path === `${prefix}/`
  const routeName = String(to.name ?? '').split('___')[0] ?? ''
  const isUnknown = !to.name || routeName === 'slug'

  if (isRoot || isUnknown) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  const switchLocalePath = useSwitchLocalePath()
  const target = switchLocalePath(fallback)

  if (!target || target === to.fullPath || target.startsWith(`${prefix}/`) || target === prefix) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  return navigateTo(target, { replace: true, redirectCode: 302 })
})
