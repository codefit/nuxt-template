<script setup lang="ts">
import { site } from '#shared/config/site'
import { authErrorMessage, authInputUi, authSubmitClass } from '~/utils/authForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { loggedIn, fetch: refreshSession } = useUserSession()
const { signUp: trackSignUp } = useDataLayer()

usePageSeo(() => ({
  title: t('auth.register.seoTitle'),
  description: t('auth.register.seoDescription'),
  noindex: true,
}))

const allowRegister = computed(() => Boolean(config.public.authAllowRegister))

watch(
  loggedIn,
  (value) => {
    if (value) {
      navigateTo(localePath('dashboard'))
    }
  },
  { immediate: true },
)

if (!allowRegister.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
}

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})
const pending = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  pending.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { ...form },
    })
    await refreshSession()
    trackSignUp('email')
    await navigateTo(localePath('dashboard'))
  }
  catch (err: unknown) {
    error.value = authErrorMessage(err, t('auth.register.error'))
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthCard :title="t('auth.register.title')">
    <form
      class="flex flex-col gap-3.5"
      @submit.prevent="submit"
    >
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
        :ui="{ root: 'rounded-2xl' }"
      />

      <div class="grid grid-cols-2 gap-2.5">
        <UInput
          v-model="form.firstName"
          autocomplete="given-name"
          size="lg"
          variant="soft"
          :placeholder="t('auth.fields.firstName')"
          required
          class="w-full"
          :ui="authInputUi"
        />
        <UInput
          v-model="form.lastName"
          autocomplete="family-name"
          size="lg"
          variant="soft"
          :placeholder="t('auth.fields.lastName')"
          required
          class="w-full"
          :ui="authInputUi"
        />
      </div>

      <UInput
        v-model="form.email"
        type="email"
        autocomplete="email"
        size="lg"
        variant="soft"
        :placeholder="t('auth.fields.email')"
        required
        class="w-full"
        :ui="authInputUi"
      />

      <AuthPasswordField
        v-model="form.password"
        :placeholder="t('auth.fields.password')"
        autocomplete="new-password"
      />

      <UButton
        type="submit"
        color="neutral"
        size="lg"
        block
        :loading="pending"
        :label="t('auth.register.submit')"
        :class="authSubmitClass"
      />

      <i18n-t
        keypath="auth.register.legal"
        tag="p"
        class="mt-1 text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"
      >
        <template #brand>
          {{ site.name }}
        </template>
        <template #privacy>
          <NuxtLink
            :to="localePath('common-gdpr')"
            class="underline underline-offset-2"
          >
            {{ t('auth.register.privacy') }}
          </NuxtLink>
        </template>
        <template #terms>
          <NuxtLink
            :to="localePath('common-obchodni-podminky')"
            class="underline underline-offset-2"
          >
            {{ t('auth.register.terms') }}
          </NuxtLink>
        </template>
      </i18n-t>

      <p class="text-center text-sm text-neutral-500 dark:text-neutral-400">
        {{ t('auth.register.haveAccount') }}
        <NuxtLink
          :to="localePath('dashboard-login')"
          class="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
        >
          {{ t('auth.register.loginLink') }}
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>
