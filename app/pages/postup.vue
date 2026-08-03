<script setup lang="ts">
useHead({
  title: 'Postup — Nuxt',
})

useReveal()
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="page-hero__inner reveal">
        <p class="page-hero__eyebrow">
          Postup
        </p>
        <h1 class="page-hero__title">
          Od nápadu k produkci
        </h1>
        <p class="page-hero__lead">
          Tři jasné kroky. Žádný chaos v wireframech, žádné zbytečné vrstvy —
          jen rytmus, který se dobře čte.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner steps">
        <article class="step reveal">
          <span class="flow__index">01</span>
          <h2 class="step__title">
            Definujte příběh
          </h2>
          <p class="section__text">
            Jedna značka, jeden headline a jeden důvod zůstat. Všechno ostatní
            patří až pod první viewport — nebo na samostatnou podstránku.
          </p>
        </article>

        <article class="step reveal">
          <span class="flow__index">02</span>
          <h2 class="step__title">
            Sestavte rytmus
          </h2>
          <p class="section__text">
            Sekce s jedním úkolem, silným vizuálem a krátkým textem.
            Mezi stránkami přecházíte přes NuxtLink s plynulou page transition.
          </p>
        </article>

        <article class="step reveal">
          <span class="flow__index">03</span>
          <h2 class="step__title">
            Pusťte to živě
          </h2>
          <p class="section__text">
            Nuxt připraví SSR i generování. Vy se soustředíte na obsah,
            dojem a další iteraci brandu.
          </p>
        </article>
      </div>
    </section>

    <section class="section flow close">
      <div class="section__inner reveal">
        <h2 class="section__title">
          Chcete začít?
        </h2>
        <p class="section__text">
          Napište nám — rádi pomůžeme s další verzí homepage.
        </p>
        <div class="cta-row">
          <NuxtLink class="btn btn--ink" to="/kontakt">
            Přejít na kontakt
          </NuxtLink>
          <NuxtLink class="btn btn--outline" to="/o-projektu">
            O projektu
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
