<script setup lang="ts">
import type { AuthorDetail, AuthorFormInput } from '#shared/types/dto/author'
import type { FormMode } from '#shared/types/ui/form'

interface Props {
  id?: number | string
  mode: FormMode
  initial?: Partial<AuthorFormInput>
  pending?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [payload: AuthorDetail]
  cancel: []
}>()

const { t } = useI18n()
const toast = useToast()
const saving = ref(false)

const form = reactive({
  name: props.initial?.name ?? '',
  email: props.initial?.email ?? '',
  phone: props.initial?.phone ?? '',
})

const validation = useValidation(form, {
  name: {
    rules: [{ type: 'required', message: t('dashboard.form.required') }],
  },
  email: {
    format: 'email',
    rules: [{ type: 'email', message: t('dashboard.authors.invalidEmail') }],
  },
  phone: {
    format: 'phone',
    rules: [{ type: 'phone', message: t('dashboard.authors.invalidPhone') }],
  },
})

async function save() {
  if (saving.value) {
    return
  }

  const nameOk = validation.validateField('name', true)
  // email / phone optional — validate only when filled
  const emailOk = !form.email.trim() || validation.validateField('email', true)
  const phoneOk = !form.phone.trim() || validation.validateField('phone', true)

  if (!nameOk || !emailOk || !phoneOk) {
    toast.add({ title: t('dashboard.form.validationFailed'), color: 'error' })
    return
  }

  // Apply formatters
  validation.blur('email')
  validation.blur('phone')

  saving.value = true
  try {
    const body: AuthorFormInput = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
    }

    const saved = await $fetch<AuthorDetail>('/api/authors', {
      method: 'POST',
      body,
    })

    toast.add({ title: t('dashboard.authors.toastCreated'), color: 'success' })
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormInput
        v-model="form.name"
        class="sm:col-span-2"
        :label="t('dashboard.authors.fieldName')"
        name="name"
        required
        v-bind="validation.fieldUi('name')"
        @blur="validation.validateField('name', true)"
      />

      <FormInput
        v-model="form.email"
        :label="t('dashboard.authors.fieldEmail')"
        name="email"
        type="email"
        v-bind="validation.fieldUi('email')"
        @blur="validation.blur('email')"
      />

      <FormInput
        v-model="form.phone"
        :label="t('dashboard.authors.fieldPhone')"
        name="phone"
        type="tel"
        v-bind="validation.fieldUi('phone')"
        @blur="validation.blur('phone')"
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
        :label="t('dashboard.form.create')"
        :loading="saving"
        :disabled="saving || pending"
        @click="save"
      />
    </div>
  </div>
</template>
