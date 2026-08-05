<script setup lang="ts">
import type {
  TableFilter,
  TableFilterOption,
  TableFilterValue,
  TableFilters,
} from '#shared/types/ui/data-table'
import { isDateRange, isFilterActive } from '~/utils/tableQuery'

const { t } = useI18n()

const props = defineProps<{
  filters: TableFilter[]
}>()

const filterValues = defineModel<TableFilters>('filterValues', {
  default: () => ({}),
})

// --- UI state ---------------------------------------------------------------

const open = ref(false)
const activeKey = ref<string | undefined>()
const openGroups = ref<Record<string, boolean>>({})

/** Edits stay local until Apply — avoids live API fetches while picking filters. */
const draft = ref<TableFilters>({})

const activeField = computed(() =>
  props.filters.find(field => field.key === activeKey.value) ?? props.filters[0],
)

const committedCount = computed(() =>
  props.filters.filter(field => isFilterActive(filterValues.value[field.key])).length,
)

const draftCount = computed(() =>
  props.filters.filter(field => isFilterActive(draft.value[field.key])).length,
)

watch(
  () => props.filters,
  (fields) => {
    if (!fields.length) {
      activeKey.value = undefined
      return
    }

    if (!fields.some(field => field.key === activeKey.value)) {
      activeKey.value = fields[0]?.key
    }
  },
  { immediate: true },
)

watch(open, (isOpen) => {
  if (isOpen) {
    draft.value = { ...filterValues.value }
  }
})

// --- Core set / clear -------------------------------------------------------

function isActive(key: string) {
  return isFilterActive(draft.value[key])
}

function setValue(key: string, value: TableFilterValue) {
  const next = { ...draft.value }

  if (!isFilterActive(value)) {
    delete next[key]
  }
  else {
    next[key] = value
  }

  draft.value = next
}

function clearAll() {
  draft.value = {}
}

function apply() {
  filterValues.value = { ...draft.value }
  open.value = false
}

// --- Per-type readers / writers ---------------------------------------------

function boolValue(key: string): boolean {
  const field = props.filters.find(entry => entry.key === key)
  const raw = draft.value[key]

  if (field?.trueValue !== undefined) {
    return raw === field.trueValue || raw === String(field.trueValue)
  }

  return Boolean(raw)
}

function setBool(key: string, checked: boolean) {
  const field = props.filters.find(entry => entry.key === key)
  const on = field?.trueValue ?? true

  setValue(key, checked ? on : undefined)
}

function dateValue(key: string): string {
  const raw = draft.value[key]
  return typeof raw === 'string' ? raw : ''
}

function rangeValue(key: string): { from: string, to: string } {
  const raw = draft.value[key]

  if (isDateRange(raw)) {
    return {
      from: raw.from ?? '',
      to: raw.to ?? '',
    }
  }

  return { from: '', to: '' }
}

function setRange(key: string, part: 'from' | 'to', value: string) {
  const current = rangeValue(key)
  const next = {
    from: part === 'from' ? value : current.from,
    to: part === 'to' ? value : current.to,
  }

  setValue(key, {
    ...(next.from ? { from: next.from } : {}),
    ...(next.to ? { to: next.to } : {}),
  })
}

function selectedValues(key: string): string[] {
  const raw = draft.value[key]

  if (Array.isArray(raw)) {
    return raw
  }

  if (typeof raw === 'string' && raw) {
    return [raw]
  }

  return []
}

function selectValue(key: string): string | null {
  const raw = draft.value[key]
  return typeof raw === 'string' && raw ? raw : null
}

function selectItems(field: TableFilter) {
  // Reka Select forbids empty-string item values (reserved to clear + show placeholder).
  return [
    {
      label: field.placeholder ?? t('table.filterUnset'),
      value: null,
    },
    ...(field.options ?? []).map(option => ({
      label: option.label,
      value: option.value,
    })),
  ]
}

function setSelect(key: string, value: unknown) {
  if (value == null || value === '') {
    setValue(key, undefined)
    return
  }

  setValue(key, String(value))
}

function isCheckboxSelect(field: TableFilter) {
  return Boolean(
    field.multiple
    || field.options?.some(option => option.children?.length),
  )
}

function isChecked(field: TableFilter, value: string) {
  return selectedValues(field.key).includes(value)
}

function toggleOption(field: TableFilter, value: string) {
  if (field.multiple) {
    const current = selectedValues(field.key)
    const next = current.includes(value)
      ? current.filter(entry => entry !== value)
      : [...current, value]

    setValue(field.key, next)
    return
  }

  const current = selectedValues(field.key)
  setValue(field.key, current[0] === value ? undefined : value)
}

// --- Grouped select options -------------------------------------------------

function groupSelected(field: TableFilter, option: TableFilterOption) {
  const children = option.children ?? []

  if (!children.length) {
    return false
  }

  return children.every(child => isChecked(field, child.value))
}

function groupIndeterminate(field: TableFilter, option: TableFilterOption) {
  const children = option.children ?? []

  if (!children.length) {
    return false
  }

  const count = children.filter(child => isChecked(field, child.value)).length
  return count > 0 && count < children.length
}

function toggleGroup(field: TableFilter, option: TableFilterOption) {
  const children = option.children ?? []

  if (!children.length) {
    return
  }

  const all = groupSelected(field, option)
  const values = children.map(child => child.value)

  if (!field.multiple) {
    setValue(field.key, all ? undefined : values[0])
    return
  }

  const current = new Set(selectedValues(field.key))

  if (all) {
    for (const value of values) {
      current.delete(value)
    }
  }
  else {
    for (const value of values) {
      current.add(value)
    }
  }

  setValue(field.key, [...current])
}

function groupOpen(key: string, option: TableFilterOption) {
  const id = `${key}:${option.value}`

  if (openGroups.value[id] === undefined) {
    return true
  }

  return openGroups.value[id]
}

function toggleOpen(key: string, option: TableFilterOption) {
  const id = `${key}:${option.value}`
  openGroups.value = {
    ...openGroups.value,
    [id]: !groupOpen(key, option),
  }
}
</script>

<template>
  <UModal
    v-if="filters.length"
    v-model:open="open"
    :title="$t('table.filters')"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full cursor-pointer',
    }"
    :ui="{
      content: 'sm:max-w-2xl',
      header: 'min-h-0',
      body: 'p-0 sm:p-0',
      footer: 'justify-between gap-2',
    }"
  >
    <UButton
      color="neutral"
      variant="outline"
      size="sm"
      icon="i-lucide-list-filter"
      :label="$t('table.filters')"
      class="h-9 shrink-0"
    >
      <template
        v-if="committedCount"
        #trailing
      >
        <UBadge
          :label="String(committedCount)"
          color="primary"
          variant="solid"
          size="sm"
          class="min-w-5 justify-center rounded-full px-1.5"
        />
      </template>
    </UButton>

    <template #body>
      <div class="flex min-h-96 max-h-[min(70vh,36rem)] overflow-hidden">
        <nav class="flex w-48 shrink-0 flex-col gap-1 overflow-y-auto border-r border-default bg-elevated/40 p-4 sm:px-5 sm:py-5">
          <button
            v-for="field in filters"
            :key="field.key"
            type="button"
            class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors"
            :class="activeField?.key === field.key
              ? 'bg-default font-medium text-highlighted shadow-sm'
              : 'text-muted hover:bg-default/70 hover:text-default'"
            @click="activeKey = field.key"
          >
            <UIcon
              v-if="field.icon"
              :name="field.icon"
              class="size-4 shrink-0"
            />
            <span class="min-w-0 flex-1 truncate">{{ field.label }}</span>
            <UIcon
              v-if="isActive(field.key)"
              name="i-lucide-check"
              class="size-3.5 shrink-0 text-primary"
            />
          </button>
        </nav>

        <div class="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <template v-if="activeField?.type === 'boolean'">
            <UCheckbox
              :model-value="boolValue(activeField.key)"
              :label="activeField.label"
              @update:model-value="setBool(activeField.key, Boolean($event))"
            />
          </template>

          <template v-else-if="activeField?.type === 'date'">
            <UFormField :label="activeField.label">
              <UInput
                type="date"
                class="w-full"
                :model-value="dateValue(activeField.key)"
                @update:model-value="setValue(activeField.key, String($event ?? '') || undefined)"
              />
            </UFormField>
          </template>

          <template v-else-if="activeField?.type === 'date-range'">
            <div class="grid grid-cols-2 gap-3">
              <UFormField :label="$t('table.dateFrom')">
                <UInput
                  type="date"
                  class="w-full"
                  :model-value="rangeValue(activeField.key).from"
                  @update:model-value="setRange(activeField.key, 'from', String($event ?? ''))"
                />
              </UFormField>
              <UFormField :label="$t('table.dateTo')">
                <UInput
                  type="date"
                  class="w-full"
                  :model-value="rangeValue(activeField.key).to"
                  @update:model-value="setRange(activeField.key, 'to', String($event ?? ''))"
                />
              </UFormField>
            </div>
          </template>

          <template v-else-if="activeField?.type === 'select' && !isCheckboxSelect(activeField)">
            <UFormField :label="activeField.label">
              <USelect
                class="w-full"
                value-key="value"
                :placeholder="activeField.placeholder ?? $t('table.filterUnset')"
                :items="selectItems(activeField)"
                :model-value="selectValue(activeField.key)"
                @update:model-value="setSelect(activeField.key, $event)"
              />
            </UFormField>
          </template>

          <template v-else-if="activeField?.type === 'select'">
            <div class="flex flex-col gap-1">
              <template
                v-for="option in activeField.options ?? []"
                :key="option.value"
              >
                <div v-if="option.children?.length">
                  <div class="flex items-center gap-2 py-1.5">
                    <UCheckbox
                      :model-value="groupSelected(activeField, option)"
                      :indeterminate="groupIndeterminate(activeField, option)"
                      @update:model-value="toggleGroup(activeField, option)"
                    />
                    <button
                      type="button"
                      class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-sm font-medium text-highlighted"
                      @click="toggleOpen(activeField.key, option)"
                    >
                      <span class="truncate">{{ option.label }}</span>
                      <span
                        v-if="option.count != null"
                        class="text-muted"
                      >{{ option.count }}</span>
                      <UIcon
                        :name="groupOpen(activeField.key, option)
                          ? 'i-lucide-chevron-down'
                          : 'i-lucide-chevron-right'"
                        class="ml-auto size-4 shrink-0 text-muted"
                      />
                    </button>
                  </div>

                  <div
                    v-if="groupOpen(activeField.key, option)"
                    class="ml-6 flex flex-col gap-1 border-l border-default pl-3"
                  >
                    <label
                      v-for="child in option.children"
                      :key="child.value"
                      class="flex cursor-pointer items-center gap-2 rounded-md py-1.5 text-sm hover:bg-elevated/60"
                    >
                      <UCheckbox
                        :model-value="isChecked(activeField, child.value)"
                        @update:model-value="toggleOption(activeField, child.value)"
                      />
                      <span class="min-w-0 flex-1 truncate">{{ child.label }}</span>
                      <span
                        v-if="child.count != null"
                        class="text-muted"
                      >{{ child.count }}</span>
                    </label>
                  </div>
                </div>

                <label
                  v-else
                  class="flex cursor-pointer items-center gap-2 rounded-md py-1.5 text-sm hover:bg-elevated/60"
                >
                  <UCheckbox
                    :model-value="isChecked(activeField, option.value)"
                    @update:model-value="toggleOption(activeField, option.value)"
                  />
                  <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
                  <span
                    v-if="option.count != null"
                    class="text-muted"
                  >{{ option.count }}</span>
                </label>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        :label="$t('table.clearFilters')"
        color="neutral"
        variant="outline"
        :disabled="!draftCount"
        @click="clearAll"
      />
      <UButton
        :label="$t('table.applyFilters')"
        color="primary"
        @click="apply"
      />
    </template>
  </UModal>
</template>
