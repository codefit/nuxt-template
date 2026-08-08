<script setup lang="ts">
type SelectItem = string | number | { label: string; value: string | number }

interface Props {
  label: string
  items: SelectItem[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const model = defineModel<string | number>({ required: true })

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const options = computed(() =>
  props.items.map((item) =>
    typeof item === 'object'
      ? item
      : { label: String(item), value: item },
  ),
)
</script>

<template>
  <div class="w-full space-y-1.5">
    <label class="block text-xs font-semibold text-neutral-500">
      {{ label }}
    </label>
    <USelect
      v-model="model"
      :items="options"
      value-key="value"
      :size="size"
      color="neutral"
      variant="soft"
      class="w-full"
      :ui="{
        base: 'w-full justify-between rounded-xl',
        trailingIcon: 'text-neutral-400',
      }"
    />
  </div>
</template>
