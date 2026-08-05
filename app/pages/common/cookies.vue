<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()
const localePath = useLocalePath()
const { legal } = site

usePageSeo({
  title: t('cookies.seoTitle'),
  description: t('cookies.seoDescription'),
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('legal.eyebrow')"
      :title="t('cookies.title')"
      :lead="t('legal.effective', { date: legal.effective })"
    />

    <section class="py-10 sm:py-12">
      <SiteContainer>
        <div class="prose">
          <p>
            {{ t('cookies.intro', { name: site.name, company: legal.company }) }}
          </p>

          <h2>{{ t('cookies.h1') }}</h2>
          <p>{{ t('cookies.p1') }}</p>

          <h2>{{ t('cookies.h2') }}</h2>
          <ul>
            <li>
              <strong>{{ t('cookies.necessary') }}</strong>
              {{ t('cookies.necessaryText') }}
            </li>
            <li>
              <strong>{{ t('cookies.analytics') }}</strong>
              {{ t('cookies.analyticsText') }}
            </li>
            <li>
              <strong>{{ t('cookies.marketing') }}</strong>
              {{ t('cookies.marketingText') }}
            </li>
          </ul>

          <h2>{{ t('cookies.h3') }}</h2>
          <p>{{ t('cookies.p3') }}</p>

          <h2>{{ t('cookies.h4') }}</h2>
          <p>
            {{ t('cookies.p4') }}
            <a :href="`mailto:${legal.email}`">{{ legal.email }}</a>.
            {{ t('cookies.p4more') }}
            <NuxtLink :to="localePath('common-gdpr')">
              {{ t('cookies.gdprLink') }}
            </NuxtLink>.
          </p>

          <p>
            <em>{{ t('cookies.note') }}</em>
          </p>
        </div>
      </SiteContainer>
    </section>
  </div>
</template>
