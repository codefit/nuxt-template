<script setup lang="ts">
import type {
  ArticleAdminDetail,
  ArticleFormInput,
  ArticleLocaleInput,
  ArticleTranslations,
} from '#shared/types/dto/article'
import type { AuthorDetail, AuthorOption } from '#shared/types/dto/author'
import type { FormMode } from '#shared/types/ui/form'
import type { LanguageOption } from '#shared/types/dto/language'
import { slugify } from '#shared/utils/slug'
import {
  emptyLocale,
  localeComplete,
  localeFilled,
  pruneTranslations,
} from '#shared/utils/translations'

interface Props {
  id?: number | string
  mode: FormMode
  initial?: Partial<ArticleFormInput>
  pending?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [payload: ArticleAdminDetail | { id: number }]
  cancel: []
}>()

const { t } = useI18n()
const toast = useToast()
const { open: openForm } = useFormSlideover()

const loading = ref(true)
const saving = ref(false)
const loadError = ref('')
const languages = ref<LanguageOption[]>([])
const authors = ref<AuthorOption[]>([])
const authorId = ref<string | null | undefined>()
const activeLang = ref('')
const defaultCode = ref('cs')
const slugManual = ref<Record<string, boolean>>({})

const form = reactive<{
  isPublished: boolean
  publishedAt: string | null
  translations: ArticleTranslations
  media: ArticleFormInput['media']
}>({
  isPublished: false,
  publishedAt: null,
  translations: {},
  media: [],
})

const authorOptions = computed(() =>
  authors.value.map(author => ({
    label: author.email ? `${author.name} (${author.email})` : author.name,
    value: String(author.id),
  })),
)

const localeKeys = [
  'title',
  'slug',
  'excerpt',
  'body',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
] as const

const validation = useValidation(form, {})

const current = computed(() => {
  const code = activeLang.value
  if (!form.translations[code]) {
    form.translations[code] = emptyLocale()
  }
  return form.translations[code]!
})

const activeLocale = computed(() => {
  const lang = languages.value.find(item => item.code === activeLang.value)
  if (!lang) {
    return null
  }
  return {
    code: lang.code,
    name: lang.name,
    icon: lang.icon,
  }
})

function fieldPath(key: keyof ArticleLocaleInput) {
  return `translations.${activeLang.value}.${key}`
}

function toDateInput(iso: string | null | undefined): string {
  if (!iso) {
    return ''
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function fromDateInput(value: string): string | null {
  const raw = value.trim()
  if (!raw) {
    return null
  }

  const date = new Date(`${raw}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

const publishedAtDate = computed({
  get: () => toDateInput(form.publishedAt),
  set: (value: string) => {
    form.publishedAt = fromDateInput(value)
  },
})

function fieldState(key: keyof ArticleLocaleInput) {
  const path = fieldPath(key)
  const state = validation.states[path]
  return {
    error: state?.touched ? state.error ?? undefined : undefined,
    valid: Boolean(state?.touched && state.valid),
  }
}

function validateLocale(code: string, isDefault: boolean): boolean {
  const locale = form.translations[code] ?? emptyLocale()
  const filled = localeFilled(locale)

  if (!isDefault && !filled) {
    for (const key of localeKeys) {
      const path = `translations.${code}.${key}`
      validation.states[path] = { error: null, valid: false, touched: false }
    }
    return true
  }

  let ok = true
  for (const key of localeKeys) {
    if (key === 'metaKeywords') {
      const path = `translations.${code}.${key}`
      validation.states[path] = {
        error: null,
        valid: String(locale[key] ?? '').trim() !== '',
        touched: true,
      }
      continue
    }
    const path = `translations.${code}.${key}`
    const empty = String(locale[key] ?? '').trim() === ''
    validation.states[path] = {
      error: empty ? t('dashboard.form.required') : null,
      valid: !empty,
      touched: true,
    }
    if (empty) {
      ok = false
    }
  }

  if (!isDefault && filled && !localeComplete(locale)) {
    return false
  }

  return ok
}

function validateAllLocales(): boolean {
  let ok = true
  for (const lang of languages.value) {
    if (!validateLocale(lang.code, lang.isDefault || lang.code === defaultCode.value)) {
      ok = false
      if (activeLang.value !== lang.code) {
        activeLang.value = lang.code
      }
      break
    }
  }
  return ok
}

function onTitleBlur() {
  const code = activeLang.value
  if (!slugManual.value[code] && current.value.title.trim()) {
    current.value.slug = slugify(current.value.title)
  }
  validation.states[fieldPath('title')] = {
    error: current.value.title.trim() ? null : t('dashboard.form.required'),
    valid: current.value.title.trim() !== '',
    touched: true,
  }
  validation.states[fieldPath('slug')] = {
    error: current.value.slug.trim() ? null : t('dashboard.form.required'),
    valid: current.value.slug.trim() !== '',
    touched: true,
  }
}

function onSlugInput() {
  slugManual.value[activeLang.value] = true
}

async function loadAuthors() {
  authors.value = await $fetch<AuthorOption[]>('/api/authors')
}

async function openCreateAuthor() {
  if (saving.value) {
    return
  }

  const result = await openForm<AuthorDetail>({
    type: 'author',
    mode: 'create',
    title: t('dashboard.authors.createTitle'),
  })

  if (!result?.ok || !result.data) {
    return
  }

  await loadAuthors()
  authorId.value = String(result.data.id)
}

async function loadLanguages() {
  languages.value = await $fetch<LanguageOption[]>('/api/languages/options')
  const def = languages.value.find(item => item.isDefault) ?? languages.value[0]
  defaultCode.value = def?.code ?? 'cs'
  activeLang.value = defaultCode.value

  for (const lang of languages.value) {
    if (!form.translations[lang.code]) {
      form.translations[lang.code] = emptyLocale()
    }
  }
}

async function loadDetail() {
  if (!props.id || props.mode === 'create') {
    return
  }

  const detail = await $fetch<ArticleAdminDetail>(`/api/articles/id/${props.id}`)
  form.isPublished = detail.isPublished
  form.publishedAt = detail.publishedAt
  authorId.value = detail.authorId != null ? String(detail.authorId) : undefined

  for (const lang of languages.value) {
    form.translations[lang.code] = detail.translations[lang.code]
      ? { ...emptyLocale(), ...detail.translations[lang.code] }
      : emptyLocale()
  }

  if (props.mode === 'copy') {
    form.isPublished = false
    form.publishedAt = null
    for (const code of Object.keys(form.translations)) {
      const locale = form.translations[code]!
      if (localeFilled(locale)) {
        locale.title = `${locale.title} (copy)`
        locale.slug = ''
        slugManual.value[code] = false
      }
    }
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadLanguages(), loadAuthors()])
    if (props.initial) {
      if (props.initial.isPublished != null) {
        form.isPublished = props.initial.isPublished
      }
      if (props.initial.publishedAt !== undefined) {
        form.publishedAt = props.initial.publishedAt
      }
      if (props.initial.authorId != null) {
        authorId.value = String(props.initial.authorId)
      }
      if (props.initial.translations) {
        Object.assign(form.translations, props.initial.translations)
      }
      if (props.initial.media) {
        form.media = props.initial.media
      }
    }
    await loadDetail()
  }
  catch (error) {
    loadError.value = error instanceof Error ? error.message : String(error)
  }
  finally {
    loading.value = false
  }
})

async function save() {
  if (saving.value) {
    return
  }

  if (!validateAllLocales()) {
    toast.add({
      title: t('dashboard.form.validationFailed'),
      color: 'error',
    })
    return
  }

  saving.value = true
  try {
    const body: ArticleFormInput = {
      isPublished: form.isPublished,
      publishedAt: form.publishedAt,
      authorId: authorId.value ? Number(authorId.value) : null,
      translations: pruneTranslations(form.translations, defaultCode.value),
      media: form.media,
    }

    let saved: ArticleAdminDetail
    if (props.mode === 'edit' && props.id) {
      saved = await $fetch<ArticleAdminDetail>(`/api/articles/id/${props.id}`, {
        method: 'PATCH',
        body,
      })
      toast.add({ title: t('dashboard.articles.toastUpdated'), color: 'success' })
    }
    else {
      saved = await $fetch<ArticleAdminDetail>('/api/articles', {
        method: 'POST',
        body,
      })
      toast.add({ title: t('dashboard.articles.toastCreated'), color: 'success' })
    }

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
  <div class="flex flex-col gap-6">
    <UAlert
      v-if="loadError"
      color="error"
      variant="subtle"
      :title="loadError"
    />

    <div
      v-else-if="loading"
      class="flex justify-center py-10"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin text-muted"
      />
    </div>

    <template v-else>
      <section class="flex flex-col gap-4">
        <h3 class="text-sm font-medium text-muted">
          {{ t('dashboard.form.sharedSection') }}
        </h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,14rem)_1fr] md:items-stretch">
          <FormMediaDrop
            v-model="form.media"
            :label="t('dashboard.form.mediaLabel')"
            name="media"
            field="cover"
            square
          />

          <div class="flex min-h-0 flex-col gap-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                v-model="publishedAtDate"
                type="date"
                :label="t('dashboard.articles.fieldPublishedAt')"
                name="publishedAt"
              />
              <FormAutocomplete
                v-model="authorId"
                :label="t('dashboard.articles.fieldAuthor')"
                name="authorId"
                :options="authorOptions"
                :placeholder="t('dashboard.articles.authorHint')"
                :create-label="t('dashboard.authors.addAuthor')"
                @create="openCreateAuthor"
              />
            </div>
            <FormCheckbox
              v-model="form.isPublished"
              class="mt-auto"
              :label="t('dashboard.articles.fieldPublished')"
              name="isPublished"
            />
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-sm font-medium text-muted">
            {{ t('dashboard.form.translationsSection') }}
          </h3>
          <FormLangTabs
            v-model="activeLang"
            :languages="languages"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            v-model="current.title"
            :label="t('dashboard.articles.fieldTitle')"
            name="title"
            required
            :locale="activeLocale"
            v-bind="fieldState('title')"
            @blur="onTitleBlur"
          />

          <FormInput
            v-model="current.slug"
            :label="t('dashboard.articles.fieldSlug')"
            name="slug"
            required
            :locale="activeLocale"
            v-bind="fieldState('slug')"
            @blur="validation.states[fieldPath('slug')] = {
              error: current.slug.trim() ? null : t('dashboard.form.required'),
              valid: current.slug.trim() !== '',
              touched: true,
            }"
            @update:model-value="onSlugInput"
          />

          <FormTextarea
            v-model="current.excerpt"
            class="sm:col-span-2"
            :label="t('dashboard.articles.fieldExcerpt')"
            name="excerpt"
            required
            :rows="3"
            :locale="activeLocale"
            v-bind="fieldState('excerpt')"
            @blur="validation.states[fieldPath('excerpt')] = {
              error: current.excerpt.trim() ? null : t('dashboard.form.required'),
              valid: current.excerpt.trim() !== '',
              touched: true,
            }"
          />

          <FormEditor
            v-model="current.body"
            class="sm:col-span-2"
            :label="t('dashboard.articles.fieldBody')"
            name="body"
            required
            :locale="activeLocale"
            v-bind="fieldState('body')"
            @blur="validation.states[fieldPath('body')] = {
              error: current.body.trim() ? null : t('dashboard.form.required'),
              valid: current.body.trim() !== '',
              touched: true,
            }"
          />

          <FormInput
            v-model="current.metaTitle"
            :label="t('dashboard.articles.fieldMetaTitle')"
            name="metaTitle"
            required
            :locale="activeLocale"
            v-bind="fieldState('metaTitle')"
            @blur="validation.states[fieldPath('metaTitle')] = {
              error: current.metaTitle.trim() ? null : t('dashboard.form.required'),
              valid: current.metaTitle.trim() !== '',
              touched: true,
            }"
          />

          <FormInput
            v-model="current.metaKeywords"
            :label="t('dashboard.articles.fieldMetaKeywords')"
            name="metaKeywords"
            :locale="activeLocale"
            v-bind="fieldState('metaKeywords')"
          />

          <FormTextarea
            v-model="current.metaDescription"
            class="sm:col-span-2"
            :label="t('dashboard.articles.fieldMetaDescription')"
            name="metaDescription"
            required
            :rows="2"
            :locale="activeLocale"
            v-bind="fieldState('metaDescription')"
            @blur="validation.states[fieldPath('metaDescription')] = {
              error: current.metaDescription.trim() ? null : t('dashboard.form.required'),
              valid: current.metaDescription.trim() !== '',
              touched: true,
            }"
          />
        </div>
      </section>

      <div class="flex justify-end gap-2 border-t border-default pt-4">
        <UButton
          :label="t('dashboard.form.cancel')"
          color="neutral"
          variant="outline"
          :disabled="saving || pending"
          @click="emit('cancel')"
        />
        <UButton
          :label="mode === 'edit' ? t('dashboard.form.save') : t('dashboard.form.create')"
          :loading="saving"
          :disabled="saving || pending"
          @click="save"
        />
      </div>
    </template>
  </div>
</template>
