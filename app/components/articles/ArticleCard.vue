<script setup lang="ts">
import type { ArticleListItem } from '#shared/types/dto/article'

interface Props {
  article: ArticleListItem
  index?: number
  badge?: string
  position?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
})

const { absolute } = useSiteUrl()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const pageUrl = computed(() =>
  absolute(localePath({ name: 'articles-slug', params: { slug: props.article.slug } })),
)

const publishedAt = computed(
  () => props.article.publishedAt ?? props.article.createdAt,
)

const badgeLabel = computed(() => props.badge ?? t('articles.tag'))

const mediaTone = computed(() =>
  props.index % 2 === 0 ? 'bg-brand-200' : 'bg-accent-100',
)

const asListItem = computed(() => props.position != null && props.position >= 1)
</script>

<template>
  <div
    class="h-full"
    :itemprop="asListItem ? 'itemListElement' : undefined"
    :itemscope="asListItem ? true : undefined"
    :itemtype="asListItem ? 'https://schema.org/ListItem' : undefined"
  >
    <meta
      v-if="asListItem"
      itemprop="position"
      :content="String(position)"
    >

    <article
      class="h-full"
      :itemprop="asListItem ? 'item' : undefined"
      itemscope
      itemtype="https://schema.org/Article"
    >
      <meta
        itemprop="description"
        :content="article.description"
      >
      <link
        itemprop="mainEntityOfPage"
        :href="pageUrl"
      >

      <NuxtLink
        :to="localePath({ name: 'articles-slug', params: { slug: article.slug } })"
        class="group flex h-full flex-col overflow-hidden rounded-3xl border border-default bg-default transition hover:border-brand-300"
      >
        <div
          class="aspect-[16/9]"
          :class="mediaTone"
        >
          <div class="flex size-full items-center justify-center">
            <UIcon
              name="i-lucide-newspaper"
              class="size-12 text-brand-700/40"
            />
          </div>
        </div>

        <div class="flex flex-1 flex-col space-y-3 p-6">
          <UBadge
            :label="badgeLabel"
            color="secondary"
            variant="subtle"
            class="w-fit"
          />

          <h3
            class="text-lg font-bold text-highlighted group-hover:text-brand-700 dark:group-hover:text-brand-300"
            itemprop="headline"
          >
            {{ article.title }}
          </h3>

          <div class="mt-auto flex items-center justify-between text-sm text-muted">
            <time
              itemprop="datePublished"
              :datetime="publishedAt"
            >
              {{ formatDate(publishedAt, locale) }}
            </time>
            <span
              v-if="article.author"
              itemprop="author"
              itemscope
              itemtype="https://schema.org/Person"
              class="sr-only"
            >
              <span itemprop="name">{{ article.author }}</span>
            </span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-5 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </NuxtLink>
    </article>
  </div>
</template>
