<script setup lang="ts">
import { PUBLIC_ARTICLE_LIMIT } from '#shared/types/resource'

const { t } = useI18n()
const route = useRoute()

const page = computed(() => {
  const value = Number(route.query.page)

  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
})

const LIST_HASH = '#articles'

function paginationTo(target: number) {
  const query = { ...route.query }

  if (target <= 1) {
    delete query.page
  }
  else {
    query.page = String(target)
  }

  return { path: route.path, query, hash: LIST_HASH }
}

const { data: list, status } = await useArticlesList({
  page,
  limit: PUBLIC_ARTICLE_LIMIT,
  withAuthor: true,
})

const items = computed(() => list.value?.items ?? [])
const total = computed(() => list.value?.meta.total ?? 0)
const pending = computed(() => status.value === 'pending')

watch(page, (_next, prev) => {
  if (!import.meta.client || prev === undefined) {
    return
  }

  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

usePageSeo({
  title: t('articles.seoTitle'),
  description: t('articles.seoDescription'),
})
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('articles.eyebrow')"
      :title="t('articles.title')"
      :lead="t('articles.lead')"
    />

    <section
      id="articles"
      class="scroll-mt-24 py-12 sm:py-16"
    >
      <SiteContainer
        itemscope
        itemtype="https://schema.org/ItemList"
      >
        <meta
          itemprop="name"
          :content="t('articles.title')"
        >
        <meta
          itemprop="numberOfItems"
          :content="String(total)"
        >

        <div
          v-if="items.length"
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ArticleCard
            v-for="(article, index) in items"
            :key="article.slug"
            :article="article"
            :index="index"
            :position="(page - 1) * PUBLIC_ARTICLE_LIMIT + index + 1"
          />
        </div>

        <div
          v-else-if="pending"
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <USkeleton
            v-for="n in PUBLIC_ARTICLE_LIMIT"
            :key="n"
            class="aspect-[4/5] w-full rounded-3xl"
          />
        </div>

        <UEmpty
          v-else
          :title="t('articles.empty')"
          icon="i-lucide-newspaper"
          class="py-16"
        />

        <div
          v-if="total > PUBLIC_ARTICLE_LIMIT"
          class="mt-10 flex justify-center"
        >
          <UPagination
            :page="page"
            :total="total"
            :items-per-page="PUBLIC_ARTICLE_LIMIT"
            :sibling-count="1"
            :to="paginationTo"
            show-edges
            size="md"
            :aria-label="t('articles.pagination')"
          />
        </div>
      </SiteContainer>
    </section>
  </div>
</template>
