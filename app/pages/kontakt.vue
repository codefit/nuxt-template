<script setup lang="ts">
useHead({
  title: 'Kontakt — Nuxt',
})

useReveal()

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const pending = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  pending.value = true

  try {
    await $fetch('/api/messages', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
      },
    })

    sent.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  }
  catch (err: unknown) {
    const fetchError = err as { data?: { statusMessage?: string }, statusMessage?: string }
    error.value =
      fetchError?.data?.statusMessage
      || fetchError?.statusMessage
      || 'Odeslání se nepovedlo. Zkuste to znovu.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="page-hero__inner reveal">
        <p class="page-hero__eyebrow">
          Kontakt
        </p>
        <h1 class="page-hero__title">
          Začněme další stránku
        </h1>
        <p class="page-hero__lead">
          Krátká zpráva stačí. Ozveme se s návrhem, jak posunout brand i strukturu dál.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner contact">
        <form
          class="contact__form reveal"
          @submit.prevent="submit"
        >
          <label class="field">
            <span class="field__label">Jméno</span>
            <input
              v-model="form.name"
              class="field__input"
              type="text"
              name="name"
              autocomplete="name"
              required
              :disabled="pending"
            >
          </label>

          <label class="field">
            <span class="field__label">E-mail</span>
            <input
              v-model="form.email"
              class="field__input"
              type="email"
              name="email"
              autocomplete="email"
              required
              :disabled="pending"
            >
          </label>

          <label class="field">
            <span class="field__label">Zpráva</span>
            <textarea
              v-model="form.message"
              class="field__input field__input--area"
              name="message"
              rows="5"
              required
              :disabled="pending"
            />
          </label>

          <button
            class="btn btn--ink"
            type="submit"
            :disabled="pending"
          >
            {{ pending ? 'Odesílám…' : 'Odeslat zprávu' }}
          </button>

          <p
            v-if="sent"
            class="contact__note"
            role="status"
          >
            Děkujeme — zpráva je uložená v databázi.
          </p>

          <p
            v-if="error"
            class="contact__error"
            role="alert"
          >
            {{ error }}
          </p>
        </form>

        <aside class="contact__aside reveal">
          <h2 class="contact__aside-title">
            Rychlé odkazy
          </h2>
          <p class="section__text">
            Projděte si zbytek webu a vraťte se, až budete připraveni.
          </p>
          <div class="cta-row section__cta">
            <NuxtLink class="btn btn--outline" to="/">
              Domů
            </NuxtLink>
            <NuxtLink class="btn btn--outline" to="/postup">
              Postup
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>
