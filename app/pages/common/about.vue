<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: t('about.seoTitle'),
  description: t('about.seoDescription'),
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('about.eyebrow')"
      :title="t('about.title')"
      :lead="t('about.lead')"
    />

    <section class="py-12 sm:py-16">
      <SiteContainer class="space-y-4">
        <p class="max-w-2xl text-muted">
          {{ t('about.body') }}
        </p>
        <p>
          <UButton
            :to="localePath('common-contact')"
            :label="t('about.toContact')"
            color="primary"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            class="px-0"
          />
        </p>
      </SiteContainer>
    </section>
  </div>
</template>
