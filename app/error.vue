<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const status = computed(() => props.error.statusCode || 500)
const isMissing = computed(() => status.value === 404)
const scope = computed(() => (isMissing.value ? 'error.404' : 'error.default'))

usePageSeo(() => ({
  title: t(`${scope.value}.seoTitle`),
  description: t(`${scope.value}.description`),
  noindex: true,
}))

function go(name: string) {
  clearError({ redirect: localePath(name) })
}

function retry() {
  clearError({ redirect: localePath('index') })
}

const actions = computed(() => {
  if (isMissing.value) {
    return [
      {
        label: t('error.404.home'),
        icon: 'i-lucide-home',
        onClick: () => go('index'),
      },
      {
        label: t('error.404.contact'),
        icon: 'i-lucide-mail',
        color: 'neutral' as const,
        variant: 'outline' as const,
        onClick: () => go('common-contact'),
      },
    ]
  }

  return [
    {
      label: t('error.default.home'),
      icon: 'i-lucide-home',
      onClick: retry,
    },
    {
      label: t('error.default.retry'),
      icon: 'i-lucide-refresh-cw',
      color: 'neutral' as const,
      variant: 'outline' as const,
      onClick: retry,
    },
  ]
})

const hints = computed(() => [
  { name: 'articles', label: t('nav.articles'), icon: 'i-lucide-newspaper' },
  { name: 'common-gallery', label: t('nav.gallery'), icon: 'i-lucide-images' },
  { name: 'common-about', label: t('nav.about'), icon: 'i-lucide-info' },
  { name: 'common-contact', label: t('nav.contact'), icon: 'i-lucide-mail' },
])
</script>

<template>
  <UApp>
    <div class="site">
      <Header />
      <Main>
        <section class="flex min-h-[60vh] items-center justify-center py-12 md:py-16">
          <SiteContainer class="flex justify-center">
            <div class="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
              <UBadge
                :label="String(status)"
                size="lg"
                :color="isMissing ? 'neutral' : 'error'"
                variant="subtle"
                class="font-mono tracking-wider"
              />

              <UEmpty
                :icon="isMissing ? 'i-lucide-map-pin-off' : 'i-lucide-triangle-alert'"
                :title="t(`${scope}.title`)"
                :description="t(`${scope}.description`)"
                :actions="actions"
                variant="soft"
                size="xl"
                class="w-full"
              />

              <template v-if="isMissing">
                <USeparator class="w-full max-w-sm" />

                <div class="flex w-full flex-col items-center gap-4">
                  <p class="text-sm text-muted">
                    {{ t('error.404.hint') }}
                  </p>
                  <div class="flex flex-wrap justify-center gap-2">
                    <UButton
                      v-for="hint in hints"
                      :key="hint.name"
                      :label="hint.label"
                      :icon="hint.icon"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      @click="go(hint.name)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </SiteContainer>
        </section>
      </Main>
      <Footer />
    </div>
  </UApp>
</template>
