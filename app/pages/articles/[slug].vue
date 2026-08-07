<script setup lang="ts">
import type { ArticleDetail } from '#shared/types/dto/article'
import { Entity } from '#shared/types/dto/entity'
import { MediaCollection } from '#shared/types/media/collection'
import { ImageRole } from '#shared/types/media/imageRole'
import { ImageSurface } from '#shared/types/media/imageSurface'
import { useArticleLd } from '~/composables/jsonLd/useArticleLd'
import { provideLocaleSlugMap } from '~/composables/useEntitySlugSwitch'

const route = useRoute()
const { absolute } = useSiteUrl()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug || ''))

const { data: article, error } = await useAsyncData(
  () => `article-${locale.value}-${slug.value}`,
  () => $fetch<ArticleDetail>(`/api/articles/${encodeURIComponent(slug.value)}`, {
    query: { locale: locale.value, with: 'author' },
  }),
)

if (error.value || !article.value) {
  throw createError({
    statusCode: 404,
    message: t('articles.notFound'),
  })
}

provideLocaleSlugMap(computed(() => article.value?.slugMap ?? null))

usePageSeo(() => {
  const item = article.value

  return {
    title: item?.title ?? t('articles.seoTitle'),
    description: item?.description,
    image: item?.image,
    type: 'article',
    publishedTime: item?.publishedAt,
    modifiedTime: item?.modifiedAt || item?.publishedAt,
  }
})

useArticleLd(article)

const pageUrl = computed(() => {
  if (!article.value) {
    return ''
  }

  return absolute(
    localePath({ name: 'articles-slug', params: { slug: article.value.slug } }),
  )
})

const imageUrl = computed(() =>
  article.value?.image ? absolute(article.value.image) : '',
)

/** Cover first, then ordered gallery — hero swipe when more than one. */
const slides = computed(() => {
  const item = article.value
  if (!item) {
    return []
  }

  const result: {
    src: string
    alt: string
    collection: typeof MediaCollection.IMAGE | typeof MediaCollection.GALLERY
  }[] = []

  if (item.image) {
    result.push({
      src: item.image,
      alt: item.title,
      collection: MediaCollection.IMAGE,
    })
  }

  for (const src of item.gallery ?? []) {
    result.push({
      src,
      alt: item.title,
      collection: MediaCollection.GALLERY,
    })
  }

  return result
})
</script>

<template>
  <div>
    <article
      v-if="article"
      class="article"
      itemscope
      itemtype="https://schema.org/Article"
    >
      <PageHeader
        :eyebrow="t('articles.eyebrowDetail')"
        :title="article.title"
        :lead="article.description"
        title-prop="headline"
        lead-prop="description"
      />

      <link
        itemprop="mainEntityOfPage"
        :href="pageUrl"
      >
      <meta
        v-if="imageUrl"
        itemprop="image"
        :content="imageUrl"
      >

      <section class="py-10 sm:py-12">
        <SiteContainer>
          <p class="article__meta">
            <time
              itemprop="datePublished"
              :datetime="article.publishedAt"
            >
              {{ formatDate(article.publishedAt, locale) }}
            </time>
            <meta
              v-if="article.modifiedAt"
              itemprop="dateModified"
              :content="article.modifiedAt"
            >
            <span
              v-if="article.author"
              itemprop="author"
              itemscope
              itemtype="https://schema.org/Person"
            >
              <span itemprop="name">{{ article.author }}</span>
            </span>
          </p>

          <MediaSwiper
            v-if="slides.length"
            class="mb-8 overflow-hidden rounded-2xl"
            :items="slides"
            :entity="Entity.ARTICLE"
            :role="ImageRole.DETAIL"
            :surface="ImageSurface.CLIENT"
            :autoplay="slides.length > 1"
            img-class="aspect-[16/9] w-full object-cover"
          />
          <div
            v-else
            class="mb-8 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-elevated text-muted"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-image"
              class="size-12"
            />
          </div>

          <div
            class="prose"
            itemprop="articleBody"
            v-html="article.body"
          />

          <p class="mt-8 font-semibold">
            <NuxtLink :to="localePath('articles')">
              {{ t('articles.back') }}
            </NuxtLink>
          </p>
        </SiteContainer>
      </section>
    </article>
  </div>
</template>
