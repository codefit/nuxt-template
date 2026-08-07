/**
 * Gate all /dashboard routes except auth screens.
 * Register stays reachable only when NUXT_PUBLIC_AUTH_ALLOW_REGISTER=true
 * (page itself 404s when disabled).
 */
export default defineNuxtRouteMiddleware((to) => {
  const path = to.path.replace(/\/$/, '') || '/'
  const isDashboard = /(?:^|\/)dashboard(?:\/|$)/.test(path)
  if (!isDashboard) {
    return
  }

  const isAuthScreen = /(?:^|\/)dashboard\/(login|register|forgot-password|reset-password)$/.test(path)
  if (isAuthScreen) {
    return
  }

  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    const localePath = useLocalePath()
    return navigateTo({
      path: localePath('dashboard-login'),
      query: { redirect: to.fullPath },
    })
  }
})
