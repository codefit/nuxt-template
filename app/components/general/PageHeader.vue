<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  lead?: string
  /** schema.org itemprop on the H1 (e.g. headline) */
  titleProp?: string
  /** schema.org itemprop on the lead */
  leadProp?: string
}

defineProps<Props>()
</script>

<template>
  <header class="border-b border-default/60 py-10 sm:py-12">
    <SiteContainer>
      <p
        v-if="eyebrow"
        class="mb-3 text-sm font-semibold tracking-wide text-muted uppercase"
      >
        {{ eyebrow }}
      </p>
      <h1
        class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
        :itemprop="titleProp"
      >
        {{ title }}
      </h1>
      <p
        v-if="lead"
        class="mt-3 max-w-2xl text-muted"
        :itemprop="leadProp"
      >
        {{ lead }}
      </p>
    </SiteContainer>
  </header>
</template>
