<script setup lang="ts">
import {
  flattenRouteParams,
  routeBaseName,
  useLocaleSwitchParams,
} from '~/composables/useLocaleSwitch'

const route = useRoute()
const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const switchParams = useLocaleSwitchParams()
const switchLocalePath = useSwitchLocalePath()

const open = ref(false)
const languages = useActiveLanguages()

const i18nCodes = computed(() => {
  return new Set<string>(
    locales.value.map(item => (typeof item === 'string' ? item : item.code)),
  )
})

const items = computed(() => {
  const codes = i18nCodes.value
  const overrides = switchParams.value
  const baseName = routeBaseName(route.name)
  const currentParams = flattenRouteParams(
    route.params as Record<string, string | string[]>,
  )

  return languages.value
    .filter(item => codes.has(item.code))
    .map((item) => {
      const code = item.code as typeof locale.value
      const params = overrides?.[item.code]
      const to = baseName && params
        ? localePath(
            {
              name: baseName,
              params: { ...currentParams, ...params },
            },
            code,
          )
        : switchLocalePath(code)

      return {
        code: item.code,
        name: item.name,
        flag: item.icon,
        to,
      }
    })
})

const current = computed(() => {
  return items.value.find(item => item.code === locale.value) ?? items.value[0]
})

watch(() => route.fullPath, () => {
  open.value = false
})
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'end', side: 'bottom', sideOffset: 6 }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      trailing-icon="i-lucide-chevron-down"
      class="gap-1.5 px-2"
      :aria-label="t('locale.label')"
      :aria-expanded="open"
      :title="current?.name || t('locale.label')"
    >
      <FormLocaleFlag
        v-if="current"
        :code="current.code"
        :name="current.name"
        :icon="current.flag"
      />
      <span class="text-xs font-semibold tracking-wide uppercase">
        {{ current?.code }}
      </span>
    </UButton>

    <template #content>
      <div
        class="flex min-w-36 flex-col gap-0.5 p-1"
        role="listbox"
        :aria-label="t('locale.label')"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.code"
          class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-elevated"
          :class="{
            'bg-elevated font-medium': item.code === locale,
            'opacity-80': item.code !== locale,
          }"
          role="option"
          :aria-selected="item.code === locale"
          :to="item.to"
          :hreflang="item.code"
          @click="open = false"
        >
          <FormLocaleFlag
            :code="item.code"
            :name="item.name"
            :icon="item.flag"
          />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </div>
    </template>
  </UPopover>
</template>
