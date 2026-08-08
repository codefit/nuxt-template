<script setup lang="ts">
import { site } from '#shared/config/site'
import { authErrorMessage, authInputUi, authSubmitClass } from '~/utils/authForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const { loggedIn, fetch: refreshSession } = useUserSession()
const route = useRoute()
const { login: trackLogin } = useDataLayer()

usePageSeo(() => ({
  title: t('auth.login.seoTitle'),
  description: t('auth.login.seoDescription'),
  noindex: true,
}))

watch(
  loggedIn,
  (value) => {
    if (value) {
      navigateTo(localePath('dashboard'))
    }
  },
  { immediate: true },
)

const form = reactive({
  email: '',
  password: '',
})
const pending = ref(false)
const error = ref('')

function redirectTarget() {
  const raw = route.query.redirect
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw
  }
  return localePath('dashboard')
}

async function submit() {
  error.value = ''
  pending.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    })
    await refreshSession()
    trackLogin('email')
    await navigateTo(redirectTarget())
  }
  catch (err: unknown) {
    error.value = authErrorMessage(err, t('auth.login.error'))
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthCard :title="t('auth.login.title')">
    <template #lead>
      {{ t('auth.login.lead', { site: site.name }) }}
    </template>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <p class="text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {{ t('auth.login.hint') }}
      </p>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
        :ui="{ root: 'rounded-2xl' }"
      />

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {{ t('auth.fields.email') }}
        </label>
        <UInput
          v-model="form.email"
          type="email"
          autocomplete="email"
          size="xl"
          variant="soft"
          :placeholder="t('auth.fields.emailPlaceholder')"
          required
          class="w-full"
          :ui="authInputUi"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-3">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ t('auth.fields.password') }}
          </label>
          <NuxtLink
            :to="localePath('dashboard-forgot-password')"
            class="text-sm text-neutral-400 underline-offset-2 hover:text-neutral-700 hover:underline dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            {{ t('auth.login.forgot') }}
          </NuxtLink>
        </div>
        <AuthPasswordField
          v-model="form.password"
          :placeholder="t('auth.fields.passwordPlaceholder')"
          autocomplete="current-password"
        />
      </div>

      <UButton
        type="submit"
        color="neutral"
        size="xl"
        block
        :loading="pending"
        :label="t('auth.login.submit')"
        :class="authSubmitClass"
      />

      <p class="pt-1 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <NuxtLink
          :to="localePath('index')"
          class="inline-flex items-center gap-1.5 font-medium text-neutral-800 underline-offset-2 hover:underline dark:text-neutral-200"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-4"
          />
          {{ t('auth.login.backToSite') }}
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>
