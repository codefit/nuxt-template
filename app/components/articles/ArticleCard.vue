<script setup lang="ts">
import type { ArticleListItem } from '#shared/types/dto/article'
import { Entity } from '#shared/types/dto/entity'
import { MediaCollection } from '#shared/types/media/collection'
import { ImageRole } from '#shared/types/media/imageRole'
import { ImageSurface } from '#shared/types/media/imageSurface'

interface Props {
  article: ArticleListItem
  badge?: string
  position?: number
}

const props = defineProps<Props>()

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

/** Listing always sizes as PREVIEW (even when src falls back to detail IMAGE file). */
const hasCover = computed(() => Boolean(props.article.image))

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
        <div class="aspect-[16/9] overflow-hidden">
          <MediaImg
            v-if="hasCover"
            :src="article.image"
            :entity="Entity.ARTICLE"
            :collection="MediaCollection.PREVIEW"
            :role="ImageRole.PREVIEW"
            :surface="ImageSurface.CLIENT"
            :alt="article.title"
            img-class="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div
            v-else
            class="flex size-full items-center justify-center bg-elevated text-muted"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-image"
              class="size-12"
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
