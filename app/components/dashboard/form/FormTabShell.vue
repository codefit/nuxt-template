<script setup lang="ts">
import type { FormTabItem } from '#shared/types/ui/form'

interface Props {
  tabs: FormTabItem[]
}

const props = defineProps<Props>()
const active = defineModel<string>({ required: true })

const slots = useSlots()

function select(id: string) {
  active.value = id
}
</script>

<template>
  <div class="-mx-4 -mt-4 flex min-h-0 flex-1 sm:-mx-6 sm:-mt-6">
    <nav
      v-if="tabs.length > 1"
      class="flex w-14 shrink-0 flex-col items-center gap-2 border-e border-default bg-elevated/50 py-4"
      :aria-label="$t('dashboard.form.tabsNav')"
    >
      <UTooltip
        v-for="tab in tabs"
        :key="tab.id"
        :text="tab.label"
        :content="{ side: 'left' }"
      >
        <UButton
          :icon="tab.icon"
          :color="active === tab.id ? 'primary' : 'neutral'"
          :variant="active === tab.id ? 'soft' : 'ghost'"
          size="md"
          square
          :ui="{
            base: 'rounded-full',
            leadingIcon: 'size-5',
          }"
          :aria-label="tab.label"
          :aria-current="active === tab.id ? 'page' : undefined"
          @click="select(tab.id)"
        />
      </UTooltip>
    </nav>

    <div class="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-5">
      <template
        v-for="tab in tabs"
        :key="tab.id"
      >
        <div
          v-show="active === tab.id"
          class="flex flex-col gap-6"
        >
          <slot
            v-if="slots[tab.id]"
            :name="tab.id"
          />
        </div>
      </template>
    </div>
  </div>
</template>
