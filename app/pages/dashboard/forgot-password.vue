<script setup lang="ts">
import { authErrorMessage, authInputUi, authSubmitClass } from '~/utils/authForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const { loggedIn } = useUserSession()

usePageSeo(() => ({
  title: t('auth.forgot.seoTitle'),
  description: t('auth.forgot.seoDescription'),
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

const email = ref('')
const pending = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  error.value = ''
  pending.value = true

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    sent.value = true
  }
  catch (err: unknown) {
    error.value = authErrorMessage(err, t('auth.forgot.error'))
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthCard :title="t('auth.forgot.title')">
    <div
      v-if="sent"
      class="flex flex-col gap-5 text-center"
    >
      <p class="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {{ t('auth.forgot.sent') }}
      </p>
      <UButton
        :to="localePath('dashboard-login')"
        color="neutral"
        size="lg"
        block
        :label="t('auth.forgot.backLogin')"
        :class="authSubmitClass"
      />
    </div>

    <form
      v-else
      class="flex flex-col gap-3.5"
      @submit.prevent="submit"
    >
      <p class="mb-0.5 text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {{ t('auth.forgot.lead') }}
      </p>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
        :ui="{ root: 'rounded-2xl' }"
      />

      <UInput
        v-model="email"
        type="email"
        autocomplete="email"
        size="xl"
        variant="soft"
        :placeholder="t('auth.fields.email')"
        required
        class="w-full"
        :ui="authInputUi"
      />

      <UButton
        type="submit"
        color="neutral"
        size="xl"
        block
        :loading="pending"
        :label="t('auth.forgot.submit')"
        :class="authSubmitClass"
      />

      <p class="mt-1 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <NuxtLink
          :to="localePath('dashboard-login')"
          class="font-medium text-neutral-900 underline underline-offset-2 dark:text-white"
        >
          {{ t('auth.forgot.backLogin') }}
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>
