/** Dev-only: set > 0 to keep NuxtLoadingIndicator visible while navigating. */
const DELAY_MS = 500

export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.dev || DELAY_MS <= 0) {
    return
  }

  //await new Promise(resolve => setTimeout(resolve, DELAY_MS))
})
