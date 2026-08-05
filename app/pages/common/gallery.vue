<script setup lang="ts">
import { galleryItems } from '#shared/content/gallery'

const { t } = useI18n()

usePageSeo({
  title: t('gallery.seoTitle'),
  description: t('gallery.seoDescription'),
})

const visible = ref(false)
const index = ref(0)

const imgs = computed(() =>
  galleryItems.map(item => ({
    src: item.src,
    title: t(`gallery.items.${item.id}`),
  })),
)

function show(i: number) {
  index.value = i
  visible.value = true
}

function hide() {
  visible.value = false
}
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('gallery.eyebrow')"
      :title="t('gallery.title')"
      :lead="t('gallery.lead')"
    />

    <section class="py-12 sm:py-16">
      <SiteContainer>
        <ul class="gallery">
          <li
            v-for="(item, i) in galleryItems"
            :key="item.id"
            class="gallery__item"
          >
            <button
              type="button"
              class="gallery__trigger"
              :aria-label="t('gallery.open', { title: t(`gallery.items.${item.id}`) })"
              @click="show(i)"
            >
              <img
                class="gallery__image"
                :src="item.thumb"
                :alt="t(`gallery.items.${item.id}`)"
                width="600"
                height="400"
                loading="lazy"
                decoding="async"
              >
            </button>
          </li>
        </ul>

        <ClientOnly>
          <VueEasyLightbox
            :visible="visible"
            :imgs="imgs"
            :index="index"
            @hide="hide"
          />
        </ClientOnly>
      </SiteContainer>
    </section>
  </div>
</template>
