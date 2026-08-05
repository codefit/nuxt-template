<script setup lang="ts">
import type { ArticleDetail } from '#shared/types/article'
import { useArticleLd } from '~/composables/jsonLd/useArticleLd'
import { provideLocaleSlugMap } from '~/composables/useEntitySlugSwitch'

const route = useRoute()
const { absolute } = useSiteUrl()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => String(route.params.slug || ''))

const { data: article, error } = await useAsyncData(
  computed(() => `article-${locale.value}-${slug.value}`),
  () => $fetch<ArticleDetail>(`/api/articles/${encodeURIComponent(slug.value)}`, {
    query: { locale: locale.value, with: 'author' },
  }),
  { watch: [slug, locale] },
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
</script>

<template>
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
</template>
