<script setup lang="ts">
useHead({
  title: 'Nuxt — moderní web bez kompromisů',
})

useReveal()
</script>

<template>
  <main>
    <section class="hero" aria-labelledby="hero-brand">
      <div class="hero__media">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80"
          alt="Světlý open-space workspace s velkými okny"
          width="2400"
          height="1600"
          fetchpriority="high"
        >
      </div>

      <div class="hero__content">
        <p id="hero-brand" class="hero__brand">
          Nuxt
        </p>
        <h1 class="hero__headline">
          Moderní web bez kompromisů
        </h1>
        <p class="hero__lead">
          Rychlý start, čistá architektura a stránky, které působí hotově už od první vteřiny.
        </p>
        <div class="cta-row">
          <NuxtLink class="btn btn--solid" to="/kontakt">
            Začít projekt
          </NuxtLink>
          <NuxtLink class="btn btn--ghost" to="/o-projektu">
            Prohlédnout
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__inner about">
        <div class="reveal">
          <h2 class="section__title">
            Jedna stránka. Jasný dojem.
          </h2>
          <p class="section__text">
            Tato homepage ukazuje, jak Nuxt 4 drží pohromadě obsah, typografii a pohyb —
            bez zbytečných bloků a bez vizuálního šumu.
          </p>
          <div class="cta-row section__cta">
            <NuxtLink class="btn btn--ink" to="/o-projektu">
              Více o projektu
            </NuxtLink>
          </div>
        </div>
        <div class="about__visual reveal">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"
            alt="Práce na notebooku s analytickým dashboardem"
            width="1400"
            height="900"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <section class="section flow">
      <div class="section__inner">
        <div class="reveal">
          <h2 class="section__title">
            Od nápadu k produkci
          </h2>
          <p class="section__text">
            Tři kroky, které stačí k tomu, aby prezentační web působil sebevědomě a připraveně.
          </p>
        </div>
        <ol class="flow__list">
          <li class="flow__item reveal">
            <span class="flow__index">01</span>
            <h3>Definujte příběh</h3>
            <p>Jedna značka, jeden headline a jeden důvod, proč má návštěvník zůstat.</p>
          </li>
          <li class="flow__item reveal">
            <span class="flow__index">02</span>
            <h3>Sestavte rytmus</h3>
            <p>Sekce s jedním úkolem, silným vizuálem a krátkým textem, který dýchá.</p>
          </li>
          <li class="flow__item reveal">
            <span class="flow__index">03</span>
            <h3>Pusťte to živě</h3>
            <p>Nuxt připraví SSR i generování — vy se soustředíte na obsah a dojem.</p>
          </li>
        </ol>
        <div class="cta-row section__cta reveal">
          <NuxtLink class="btn btn--ink" to="/postup">
            Celý postup
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section close">
      <div class="section__inner reveal">
        <h2 class="section__title">
          Připraveno ke startu
        </h2>
        <p class="section__text">
          Spusťte vývojový server a upravte homepage podle svého brandu.
        </p>
        <div class="cta-row">
          <NuxtLink class="btn btn--ink" to="/kontakt">
            Napsat nám
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
