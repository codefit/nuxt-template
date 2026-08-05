<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()
const localePath = useLocalePath()
const { legal } = site

usePageSeo({
  title: t('gdpr.seoTitle'),
  description: t('gdpr.seoDescription'),
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('legal.eyebrow')"
      :title="t('gdpr.title')"
      :lead="t('legal.effective', { date: legal.effective })"
    />

    <section class="py-10 sm:py-12">
      <SiteContainer>
        <div class="prose">
          <p>
            {{ t('gdpr.intro', {
              company: legal.company,
              ico: legal.ico,
              address: legal.address,
              email: legal.email,
            }) }}
          </p>

          <h2>{{ t('gdpr.h1') }}</h2>
          <p>
            {{ t('gdpr.p1') }}
            <NuxtLink :to="localePath('common-cookies')">
              {{ t('gdpr.cookiesLink') }}
            </NuxtLink>{{ t('gdpr.p1end') }}
          </p>

          <h2>{{ t('gdpr.h2') }}</h2>
          <ul>
            <li>{{ t('gdpr.li1') }}</li>
            <li>{{ t('gdpr.li2') }}</li>
            <li>{{ t('gdpr.li3') }}</li>
          </ul>

          <h2>{{ t('gdpr.h3') }}</h2>
          <p>{{ t('gdpr.p3') }}</p>

          <h2>{{ t('gdpr.h4') }}</h2>
          <p>{{ t('gdpr.p4') }}</p>

          <h2>{{ t('gdpr.h5') }}</h2>
          <p>{{ t('gdpr.p5') }}</p>

          <h2>{{ t('gdpr.h6') }}</h2>
          <p>
            {{ t('gdpr.p6') }}
            <a :href="`mailto:${legal.email}`">{{ legal.email }}</a>.
          </p>

          <p>
            <em>{{ t('gdpr.note') }}</em>
          </p>
        </div>
      </SiteContainer>
    </section>
  </div>
</template>
