<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: t('dashboard.home.seoTitle'),
  description: t('dashboard.home.seoDescription'),
})

const cards = computed(() => [
  {
    key: 'assistant',
    title: t('dashboard.home.cardAssistantTitle'),
    body: t('dashboard.home.cardAssistantBody'),
    items: null as string[] | null,
    dark: true,
  },
  {
    key: 'tasks',
    title: t('dashboard.home.cardTasksTitle'),
    body: null as string | null,
    items: [
      t('dashboard.home.task1'),
      t('dashboard.home.task2'),
      t('dashboard.home.task3'),
    ],
    dark: false,
  },
  {
    key: 'prompt',
    title: t('dashboard.home.cardPromptTitle'),
    body: t('dashboard.home.cardPromptBody'),
    items: null as string[] | null,
    dark: false,
  },
])

const actions = computed(() => [
  {
    label: t('dashboard.home.actionArticles'),
    icon: 'i-lucide-newspaper',
    to: localePath('dashboard-articles'),
    color: 'primary' as const,
  },
  {
    label: t('dashboard.home.actionMessages'),
    icon: 'i-lucide-mail',
    to: localePath('dashboard-messages'),
    color: 'info' as const,
  },
  {
    label: t('dashboard.home.actionMedia'),
    icon: 'i-lucide-image',
    placeholder: true,
    color: 'warning' as const,
  },
  {
    label: t('dashboard.home.actionUsers'),
    icon: 'i-lucide-users',
    placeholder: true,
    color: 'success' as const,
  },
])
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
    <section class="flex flex-col items-center gap-3 pt-4 text-center sm:pt-8">
      <div class="flex size-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/25">
        <UIcon
          name="i-lucide-sparkles"
          class="size-7 text-primary"
        />
      </div>
      <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        {{ t('dashboard.home.greeting') }}
      </h2>
      <p class="max-w-md text-muted">
        {{ t('dashboard.home.lead') }}
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <article
        v-for="card in cards"
        :key="card.key"
        class="rounded-3xl p-5 ring-1 ring-default"
        :class="card.dark
          ? 'bg-inverted text-inverted'
          : 'bg-default'"
      >
        <h3
          class="mb-3 text-sm font-semibold"
          :class="card.dark ? 'text-inverted' : 'text-highlighted'"
        >
          {{ card.title }}
        </h3>

        <p
          v-if="card.body"
          class="text-sm leading-relaxed opacity-80"
        >
          {{ card.body }}
        </p>

        <ul
          v-if="card.items"
          class="space-y-2.5"
        >
          <li
            v-for="item in card.items"
            :key="item"
            class="flex items-start gap-2.5 text-sm text-muted"
          >
            <span class="mt-0.5 size-4 shrink-0 rounded border border-default" />
            <span>{{ item }}</span>
          </li>
        </ul>

        <UButton
          v-if="card.key === 'tasks'"
          :label="t('dashboard.home.viewAll')"
          color="neutral"
          variant="link"
          size="sm"
          class="mt-3 px-0"
          disabled
        />
      </article>
    </section>

    <section class="flex flex-wrap justify-center gap-2 sm:gap-3">
      <UButton
        v-for="action in actions"
        :key="action.label"
        :to="action.placeholder ? undefined : action.to"
        :label="action.label"
        :icon="action.icon"
        :color="action.color"
        variant="soft"
        size="md"
        class="rounded-full"
        :disabled="action.placeholder"
      />
    </section>

    <section class="mx-auto w-full max-w-2xl">
      <div class="rounded-3xl bg-default p-3 shadow-sm ring-1 ring-default sm:p-4">
        <UInput
          :placeholder="t('dashboard.home.searchPlaceholder')"
          icon="i-lucide-search"
          size="xl"
          class="w-full"
          disabled
        />
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <UButton
            :label="t('dashboard.home.selectSource')"
            icon="i-lucide-database"
            color="neutral"
            variant="ghost"
            size="xs"
            class="rounded-lg"
            disabled
          />
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-paperclip"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              class="rounded-lg"
              :aria-label="t('dashboard.home.attach')"
              disabled
            />
            <UButton
              icon="i-lucide-mic"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              class="rounded-lg"
              :aria-label="t('dashboard.home.voice')"
              disabled
            />
            <UButton
              icon="i-lucide-arrow-up"
              color="primary"
              size="sm"
              square
              class="rounded-xl"
              :aria-label="t('dashboard.home.send')"
              disabled
            />
          </div>
        </div>
      </div>
      <p class="mt-3 text-center text-xs text-muted">
        {{ t('dashboard.home.disclaimer') }}
      </p>
    </section>
  </div>
</template>
