import type { RecaptchaAction } from '#shared/types/recaptcha'

interface Grecaptcha {
  ready: (cb: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

function loadScript(siteKey: string): Promise<void> {
  if (!import.meta.client) {
    return Promise.reject(new Error('reCAPTCHA is client-only'))
  }

  if (window.grecaptcha) {
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => resolve())
    })
  }

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-recaptcha="v3"]',
  )

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        window.grecaptcha?.ready(() => resolve())
      }, { once: true })
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA load failed')), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.dataset.recaptcha = 'v3'
    script.addEventListener('load', () => {
      window.grecaptcha?.ready(() => resolve())
    }, { once: true })
    script.addEventListener('error', () => reject(new Error('reCAPTCHA load failed')), { once: true })
    document.head.appendChild(script)
  })
}

export function useRecaptcha() {
  const config = useRuntimeConfig()
  const siteKey = computed(() => String(config.public.recaptchaSiteKey || '').trim())
  const enabled = computed(() => siteKey.value.length > 0)

  async function preload(): Promise<void> {
    if (!import.meta.client || !enabled.value) {
      return
    }
    await loadScript(siteKey.value)
  }

  async function execute(action: RecaptchaAction): Promise<string> {
    if (!enabled.value) {
      throw new Error('Missing reCAPTCHA site key')
    }

    await loadScript(siteKey.value)
    const token = await window.grecaptcha!.execute(siteKey.value, { action })
    if (!token) {
      throw new Error('Empty reCAPTCHA token')
    }
    return token
  }

  return { enabled, siteKey, preload, execute }
}
