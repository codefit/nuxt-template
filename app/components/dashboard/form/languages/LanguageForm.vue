<script setup lang="ts">
import type { LanguageAdminDetail, LanguageFormInput } from '#shared/types/dto/language'
import type { FormMode } from '#shared/types/ui/form'

interface Props {
  id?: number | string
  mode: FormMode
  initial?: Partial<LanguageFormInput>
  pending?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [payload: LanguageAdminDetail]
  cancel: []
}>()

const { t } = useI18n()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const loadError = ref('')
const code = ref('')

const form = reactive({
  name: props.initial?.name ?? '',
  icon: props.initial?.icon ?? '',
  isActive: props.initial?.isActive ?? true,
  isDefault: props.initial?.isDefault ?? false,
})

const validation = useValidation(form, {
  name: {
    rules: [{ type: 'required', message: t('dashboard.form.required') }],
  },
})

async function load() {
  if (props.mode !== 'edit' || !props.id) {
    loadError.value = t('dashboard.languages.loadFailed')
    loading.value = false
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const detail = await $fetch<LanguageAdminDetail>(`/api/languages/${props.id}`)
    code.value = detail.code
    form.name = detail.name
    form.icon = detail.icon ?? ''
    form.isActive = detail.isActive
    form.isDefault = detail.isDefault
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    loadError.value = err?.data?.message || err?.message || t('dashboard.languages.loadFailed')
  }
  finally {
    loading.value = false
  }
}

async function save() {
  if (saving.value || props.mode !== 'edit' || !props.id) {
    return
  }

  if (!validation.validateField('name', true)) {
    toast.add({ title: t('dashboard.form.validationFailed'), color: 'error' })
    return
  }

  saving.value = true
  try {
    const body: LanguageFormInput = {
      name: form.name.trim(),
      icon: form.icon.trim() || null,
      isActive: form.isDefault ? true : form.isActive,
      isDefault: form.isDefault,
    }

    const saved = await $fetch<LanguageAdminDetail>(`/api/languages/${props.id}`, {
      method: 'PATCH',
      body,
    })

    toast.add({ title: t('dashboard.languages.toastUpdated'), color: 'success' })
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

watch(
  () => form.isDefault,
  (value) => {
    if (value) {
      form.isActive = true
    }
  },
)

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
      <FormInput
        v-model="code"
        :label="t('dashboard.languages.fieldCode')"
        name="code"
        disabled
      />
      <p class="text-sm text-muted -mt-2">
        {{ t('dashboard.languages.codeHint') }}
      </p>

      <FormInput
        v-model="form.name"
        :label="t('dashboard.languages.fieldName')"
        name="name"
        required
        v-bind="validation.fieldUi('name')"
        @blur="validation.validateField('name', true)"
      />

      <FormInput
        v-model="form.icon"
        :label="t('dashboard.languages.fieldIcon')"
        name="icon"
      />
      <p class="text-sm text-muted -mt-2">
        {{ t('dashboard.languages.iconHint') }}
      </p>

      <div
        v-if="form.icon"
        class="flex items-center gap-2"
      >
        <img
          :src="form.icon"
          alt=""
          class="size-6 rounded-sm object-contain"
        >
        <span class="text-sm text-muted">{{ form.icon }}</span>
      </div>

      <FormCheckbox
        v-model="form.isActive"
        :label="t('dashboard.languages.fieldActive')"
        name="isActive"
        :disabled="form.isDefault"
        :description="form.isDefault ? t('dashboard.languages.defaultActiveHint') : undefined"
      />

      <FormCheckbox
        v-model="form.isDefault"
        :label="t('dashboard.languages.fieldDefault')"
        name="isDefault"
        :description="t('dashboard.languages.defaultHint')"
      />

      <div class="flex justify-end gap-2 border-t border-default pt-4">
        <UButton
          :label="t('dashboard.form.cancel')"
          color="neutral"
          variant="outline"
          :disabled="saving || pending"
          @click="emit('cancel')"
        />
        <UButton
          :label="t('dashboard.form.save')"
          :loading="saving"
          :disabled="saving || pending"
          @click="save"
        />
      </div>
    </template>
  </div>
</template>
