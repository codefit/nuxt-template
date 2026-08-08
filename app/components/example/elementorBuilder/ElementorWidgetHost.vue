<script setup lang="ts">
import type { WidgetNode } from './types'
import EbHeading from './widgets/EbHeading.vue'
import EbText from './widgets/EbText.vue'
import EbButton from './widgets/EbButton.vue'
import EbIcon from './widgets/EbIcon.vue'
import EbImage from './widgets/EbImage.vue'
import EbMaps from './widgets/EbMaps.vue'
import EbIconList from './widgets/EbIconList.vue'
import EbSocial from './widgets/EbSocial.vue'
import EbDivider from './widgets/EbDivider.vue'
import EbSpacer from './widgets/EbSpacer.vue'
import EbProgress from './widgets/EbProgress.vue'
import EbTestimonials from './widgets/EbTestimonials.vue'
import EbAccordion from './widgets/EbAccordion.vue'
import EbToggle from './widgets/EbToggle.vue'
import EbTabs from './widgets/EbTabs.vue'
import EbAlert from './widgets/EbAlert.vue'
import EbStarRating from './widgets/EbStarRating.vue'

interface Props {
  preview?: boolean
}

defineProps<Props>()
const widget = defineModel<WidgetNode>({ required: true })
</script>

<template>
  <EbHeading
    v-if="widget.plugin === 'heading'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbText
    v-else-if="widget.plugin === 'text'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbButton
    v-else-if="widget.plugin === 'button'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbIcon
    v-else-if="widget.plugin === 'icon'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbImage
    v-else-if="widget.plugin === 'image'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbMaps
    v-else-if="widget.plugin === 'maps'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbIconList
    v-else-if="widget.plugin === 'icon-list'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbSocial
    v-else-if="widget.plugin === 'social'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbDivider
    v-else-if="widget.plugin === 'divider'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbSpacer
    v-else-if="widget.plugin === 'spacer'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbProgress
    v-else-if="widget.plugin === 'progress'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbTestimonials
    v-else-if="widget.plugin === 'testimonials'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbAccordion
    v-else-if="widget.plugin === 'accordion'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbToggle
    v-else-if="widget.plugin === 'toggle'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbTabs
    v-else-if="widget.plugin === 'tabs'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbAlert
    v-else-if="widget.plugin === 'alert'"
    v-model="widget.data"
    :preview="preview"
  />
  <EbStarRating
    v-else-if="widget.plugin === 'star-rating'"
    v-model="widget.data"
    :preview="preview"
  />
</template>
