<script setup lang="ts">
import { authErrorMessage, authSubmitClass } from '~/utils/authForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { loggedIn } = useUserSession()

usePageSeo(() => ({
  title: t('auth.reset.seoTitle'),
  description: t('auth.reset.seoDescription'),
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

const token = computed(() => String(route.query.token || ''))
const password = ref('')
const pending = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  if (!token.value) {
    error.value = t('auth.reset.missingToken')
    return
  }

  pending.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: password.value,
      },
    })
    done.value = true
  }
  catch (err: unknown) {
    error.value = authErrorMessage(err, t('auth.reset.error'))
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthCard :title="t('auth.reset.title')">
    <div
      v-if="done"
      class="flex flex-col gap-5 text-center"
    >
      <p class="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {{ t('auth.reset.done') }}
      </p>
      <UButton
        :to="localePath('dashboard-login')"
        color="neutral"
        size="lg"
        block
        :label="t('auth.reset.backLogin')"
        :class="authSubmitClass"
      />
    </div>

    <form
      v-else
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

      <AuthPasswordField
        v-model="password"
        :placeholder="t('auth.fields.newPassword')"
        autocomplete="new-password"
      />

      <UButton
        type="submit"
        color="neutral"
        size="lg"
        block
        :loading="pending"
        :label="t('auth.reset.submit')"
        :class="authSubmitClass"
      />
    </form>
  </AuthCard>
</template>
