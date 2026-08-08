<script setup lang="ts">
import type {
  ConstantDetail,
  ConstantFormInput,
  ConstantGroupKey,
} from '#shared/types/dto/constant'
import {
  CONSTANT_GROUPS,
  ConstantType,
} from '#shared/types/dto/constant'
import type { FormMode } from '#shared/types/ui/form'

interface Props {
  id?: number | string
  mode: FormMode
  initial?: Partial<ConstantFormInput>
  pending?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [payload: ConstantDetail]
  cancel: []
}>()

const { t } = useI18n()
const toast = useToast()

const loading = ref(props.mode === 'edit')
const saving = ref(false)
const loadError = ref('')
const keyLocked = computed(() => props.mode === 'edit')

const form = reactive({
  group: (props.initial?.group ?? 'general') as ConstantGroupKey,
  key: props.initial?.key ?? '',
  type: props.initial?.type ?? ConstantType.TEXT,
  value: props.initial?.value ?? '',
  label: props.initial?.label ?? '',
  description: props.initial?.description ?? '',
  isActive: props.initial?.isActive ?? true,
  isPrivate: props.initial?.isPrivate ?? false,
})

const validation = useValidation(form, {
  label: {
    rules: [{ type: 'required', message: t('dashboard.form.required') }],
  },
  key: {
    rules: [{ type: 'required', message: t('dashboard.form.required') }],
  },
})

const groupOptions = computed(() =>
  CONSTANT_GROUPS.map(group => ({
    value: group,
    label: t(`dashboard.constants.groups.${group}`),
  })),
)

const typeOptions = computed(() => [
  {
    value: ConstantType.TEXT,
    label: t('dashboard.constants.typeText'),
  },
])

const submitLabel = computed(() =>
  props.mode === 'edit'
    ? t('dashboard.form.save')
    : t('dashboard.form.create'),
)

function applyDetail(detail: ConstantDetail) {
  form.group = detail.group
  form.key = detail.key
  form.type = detail.type
  form.value = detail.value
  form.label = detail.label
  form.description = detail.description ?? ''
  form.isActive = detail.isActive
  form.isPrivate = detail.isPrivate
}

async function load() {
  if (props.mode !== 'edit') {
    loading.value = false
    return
  }

  if (!props.id) {
    loadError.value = t('dashboard.constants.loadFailed')
    loading.value = false
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const detail = await $fetch<ConstantDetail>(`/api/constants/${props.id}`)
    applyDetail(detail)
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    loadError.value = err?.data?.message || err?.message || t('dashboard.constants.loadFailed')
  }
  finally {
    loading.value = false
  }
}

async function save() {
  if (saving.value) {
    return
  }

  const labelOk = validation.validateField('label', true)
  const keyOk = keyLocked.value || validation.validateField('key', true)

  if (!labelOk || !keyOk) {
    toast.add({ title: t('dashboard.form.validationFailed'), color: 'error' })
    return
  }

  saving.value = true
  try {
    const body: ConstantFormInput = {
      group: form.group,
      key: form.key.trim(),
      type: form.type,
      value: form.value,
      label: form.label.trim(),
      description: form.description.trim() || null,
      isActive: form.isActive,
      isPrivate: form.isPrivate,
    }

    const saved = props.mode === 'edit' && props.id
      ? await $fetch<ConstantDetail>(`/api/constants/${props.id}`, {
          method: 'PATCH',
          body: {
            group: body.group,
            type: body.type,
            value: body.value,
            label: body.label,
            description: body.description,
            isActive: body.isActive,
            isPrivate: body.isPrivate,
          },
        })
      : await $fetch<ConstantDetail>('/api/constants', {
          method: 'POST',
          body,
        })

    toast.add({
      title: props.mode === 'edit'
        ? t('dashboard.constants.toastUpdated')
        : t('dashboard.constants.toastCreated'),
      color: 'success',
    })
    emit('submit', saved)
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    toast.add({
      title: err?.data?.message || err?.message || t('dashboard.form.saveFailed'),
      color: 'error',
    })
  }
  finally {
    saving.value = false
  }
}

function onKeyBlur() {
  if (!keyLocked.value) {
    validation.validateField('key', true)
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="loading"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin text-muted"
      />
    </div>

    <UAlert
      v-else-if="loadError"
      color="error"
      variant="subtle"
      :title="loadError"
    />

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect
          v-model="form.group"
          :label="t('dashboard.constants.fieldGroup')"
          name="group"
          required
          :options="groupOptions"
        />

        <FormSelect
          v-model="form.type"
          :label="t('dashboard.constants.fieldType')"
          name="type"
          required
          :options="typeOptions"
        />

        <div class="flex flex-col gap-1 sm:col-span-2">
          <FormInput
            v-model="form.key"
            :label="t('dashboard.constants.fieldKey')"
            name="key"
            required
            :disabled="keyLocked"
            v-bind="validation.fieldUi('key')"
            @blur="onKeyBlur"
          />
          <p
            v-if="keyLocked"
            class="text-sm text-muted"
          >
            {{ t('dashboard.constants.keyHint') }}
          </p>
        </div>

        <FormInput
          v-model="form.label"
          class="sm:col-span-2"
          :label="t('dashboard.constants.fieldLabel')"
          name="label"
          required
          v-bind="validation.fieldUi('label')"
          @blur="validation.validateField('label', true)"
        />

        <FormTextarea
          v-model="form.value"
          class="sm:col-span-2"
          :label="t('dashboard.constants.fieldValue')"
          name="value"
          :rows="3"
        />

        <FormTextarea
          v-model="form.description"
          class="sm:col-span-2"
          :label="t('dashboard.constants.fieldDescription')"
          name="description"
          :rows="2"
        />

        <FormCheckbox
          v-model="form.isActive"
          :label="t('dashboard.constants.fieldActive')"
          name="isActive"
        />

        <FormCheckbox
          v-model="form.isPrivate"
          :label="t('dashboard.constants.fieldPrivate')"
          name="isPrivate"
          :description="t('dashboard.constants.privateHint')"
        />
      </div>

      <div class="flex justify-end gap-2 border-t border-default pt-4">
        <UButton
          :label="t('dashboard.form.cancel')"
          color="neutral"
          variant="outline"
          :disabled="saving || pending"
          @click="emit('cancel')"
        />
        <UButton
          :label="submitLabel"
          :loading="saving"
          :disabled="saving || pending"
          @click="save"
        />
      </div>
    </template>
  </div>
</template>
