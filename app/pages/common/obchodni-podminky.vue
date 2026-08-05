<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()
const { legal } = site

usePageSeo({
  title: t('terms.seoTitle'),
  description: t('terms.seoDescription'),
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('legal.eyebrow')"
      :title="t('terms.title')"
      :lead="t('legal.effective', { date: legal.effective })"
    />

    <section class="py-10 sm:py-12">
      <SiteContainer>
        <div class="prose">
          <p>
            {{ t('terms.intro', {
              company: legal.company,
              ico: legal.ico,
              address: legal.address,
            }) }}
          </p>

          <h2>{{ t('terms.h1') }}</h2>
          <p>{{ t('terms.p1') }}</p>

          <h2>{{ t('terms.h2') }}</h2>
          <p>{{ t('terms.p2') }}</p>

          <h2>{{ t('terms.h3') }}</h2>
          <p>{{ t('terms.p3') }}</p>

          <h2>{{ t('terms.h4') }}</h2>
          <p>{{ t('terms.p4') }}</p>

          <h2>{{ t('terms.h5') }}</h2>
          <p>{{ t('terms.p5') }}</p>

          <h2>{{ t('terms.h6') }}</h2>
          <p>
            {{ t('terms.p6', { email: legal.email, phone: legal.phone }) }}
          </p>

          <h2>{{ t('terms.h7') }}</h2>
          <p>{{ t('terms.p7') }}</p>

          <p>
            <em>{{ t('terms.note') }}</em>
          </p>
        </div>
      </SiteContainer>
    </section>
  </div>
</template>
