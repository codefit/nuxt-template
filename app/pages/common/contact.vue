<script setup lang="ts">
import { site } from '#shared/config/site'
import { RECAPTCHA_ACTIONS } from '#shared/types/recaptcha'

const { t } = useI18n()
const localePath = useLocalePath()
const {
  enabled: recaptchaEnabled,
  preload: preloadRecaptcha,
  execute: executeRecaptcha,
} = useRecaptcha()

usePageSeo({
  title: t('contact.seoTitle'),
  description: t('contact.seoDescription'),
})

onMounted(() => {
  void preloadRecaptcha()
})

const form = reactive({
  name: '',
  email: '',
  message: '',
  gdpr: false,
})

const pending = ref(false)
const sent = ref(false)
const error = ref('')

const details = computed(() => [
  {
    icon: 'i-lucide-mail',
    label: t('contact.email'),
    value: site.legal.email,
    href: `mailto:${site.legal.email}`,
  },
  {
    icon: 'i-lucide-phone',
    label: t('contact.phone'),
    value: site.legal.phone,
    href: `tel:${site.legal.phone.replace(/\s/g, '')}`,
  },
  {
    icon: 'i-lucide-map-pin',
    label: t('contact.address'),
    value: site.legal.address,
    href: '',
  },
])

async function submit() {
  if (pending.value) {
    return
  }

  if (!form.gdpr) {
    error.value = t('contact.gdprRequired')
    return
  }

  if (!recaptchaEnabled.value) {
    error.value = t('contact.recaptchaConfig')
    return
  }

  error.value = ''
  pending.value = true

  try {
    const recaptchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.contact)

    await $fetch('/api/messages', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        gdpr: true,
        recaptchaToken,
      },
    })

    sent.value = true
    form.name = ''
    form.email = ''
    form.message = ''
    form.gdpr = false
  }
  catch (err: unknown) {
    const fetchError = err as {
      data?: { message?: string, statusMessage?: string }
      message?: string
      statusMessage?: string
    }
    error.value =
      fetchError?.data?.message
      || fetchError?.data?.statusMessage
      || fetchError?.message
      || fetchError?.statusMessage
      || t('contact.error')
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="t('contact.eyebrow')"
      :title="t('contact.title')"
      :lead="t('contact.lead')"
    />

    <section class="py-12 sm:py-16">
      <SiteContainer class="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-6">
          <p class="text-muted max-w-md text-sm leading-relaxed">
            {{ t('contact.aside') }}
          </p>

          <ul class="space-y-4">
            <li
              v-for="item in details"
              :key="item.label"
              class="flex items-start gap-3"
            >
              <div class="bg-elevated text-highlighted flex size-10 shrink-0 items-center justify-center rounded-lg">
                <UIcon
                  :name="item.icon"
                  class="size-5"
                />
              </div>
              <div class="min-w-0">
                <p class="text-muted text-xs font-medium tracking-wide uppercase">
                  {{ item.label }}
                </p>
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="text-highlighted hover:text-primary text-sm font-medium transition-colors"
                >
                  {{ item.value }}
                </a>
                <p
                  v-else
                  class="text-highlighted text-sm font-medium"
                >
                  {{ item.value }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <UCard>
          <form
            class="grid gap-4"
            @submit.prevent="submit"
          >
            <UFormField
              :label="t('contact.name')"
              name="name"
              required
            >
              <UInput
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                required
                :disabled="pending"
                class="w-full"
              />
            </UFormField>

            <UFormField
              :label="t('contact.email')"
              name="email"
              required
            >
              <UInput
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                :disabled="pending"
                class="w-full"
              />
            </UFormField>

            <UFormField
              :label="t('contact.message')"
              name="message"
              required
            >
              <UTextarea
                v-model="form.message"
                name="message"
                :rows="5"
                required
                :disabled="pending"
                class="w-full"
                autoresize
              />
            </UFormField>

            <UCheckbox
              v-model="form.gdpr"
              name="gdpr"
              required
              :disabled="pending"
            >
              <template #label>
                <span class="text-sm">
                  {{ t('contact.gdprLabel') }}
                  <NuxtLink
                    :to="localePath('common-gdpr')"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary underline underline-offset-2"
                    @click.stop
                  >
                    {{ t('nav.gdpr') }}
                  </NuxtLink>
                </span>
              </template>
            </UCheckbox>

            <div class="w-fit">
              <UTooltip
                :text="t('contact.gdprRequired')"
                :disabled="form.gdpr"
                :delay-duration="0"
                arrow
                :content="{
                  side: 'top',
                  align: 'start',
                  sideOffset: 4,
                  collisionPadding: 16,
                  avoidCollisions: true,
                }"
                :ui="{
                  content: 'h-auto max-w-xs bg-inverted text-inverted ring-0 shadow-md',
                  text: 'whitespace-normal',
                  arrow: 'fill-inverted',
                }"
              >
                <span class="inline-flex">
                  <UButton
                    type="submit"
                    :label="pending ? t('contact.pending') : t('contact.submit')"
                    icon="i-lucide-send"
                    :loading="pending"
                    :disabled="pending || !form.gdpr"
                  />
                </span>
              </UTooltip>
            </div>

            <p class="text-muted text-xs leading-relaxed">
              {{ t('contact.recaptchaNotice') }}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline underline-offset-2"
              >{{ t('contact.recaptchaPrivacy') }}</a>
              {{ t('contact.recaptchaAnd') }}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline underline-offset-2"
              >{{ t('contact.recaptchaTerms') }}</a>{{ t('contact.recaptchaSuffix') }}
            </p>

            <UAlert
              v-if="sent"
              color="success"
              variant="subtle"
              icon="i-lucide-check-circle"
              :title="t('contact.success')"
            />

            <UAlert
              v-if="error"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              :title="error"
            />
          </form>
        </UCard>
      </SiteContainer>
    </section>
  </div>
</template>
