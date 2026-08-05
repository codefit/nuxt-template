<script setup lang="ts">
import { site } from '#shared/config/site'

const { t } = useI18n()

usePageSeo({
  title: site.name,
  description: t('site.description'),
})
</script>

<template>
   <div>
      <PageHeader
        :eyebrow="t('home.hero.eyebrow')"
        :title="t('home.hero.title')"
        :lead="t('home.hero.lead')"
      />
   </div>
</template>
