<script setup lang="ts">
useHead({
  title: 'O projektu — Nuxt',
})

useReveal()
</script>

<template>
  <main>
    <section class="page-hero">
      <div class="page-hero__inner reveal">
        <p class="page-hero__eyebrow">
          O projektu
        </p>
        <h1 class="page-hero__title">
          Proč tahle stránka drží pohromadě
        </h1>
        <p class="page-hero__lead">
          Méně prvků, silnější značka a jeden vizuální rytmus — přesně to, na čem Nuxt
          exceluje při stavbě prezentačních webů.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="section__inner about">
        <div class="reveal">
          <h2 class="section__title">
            Brand jako první signál
          </h2>
          <p class="section__text">
            Hero nestavíme jako dashboard. Jméno Nuxt je dominantní, headline ho doplňuje
            a CTA vede dál — bez badgeů, statistik a rušivých překryvů.
          </p>
        </div>
        <div class="about__visual reveal">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
            alt="Světlá kancelář s velkým oknem a zelenými rostlinami"
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
            Co je záměr
          </h2>
          <p class="section__text">
            Každá sekce má jeden úkol. Text je krátký. Vizuál nese atmosféru, ne dekoraci.
          </p>
        </div>
        <ol class="flow__list">
          <li class="flow__item reveal">
            <span class="flow__index">A</span>
            <h3>Kompozice</h3>
            <p>První viewport čte jako jeden celek — značka, headline, věta, CTA.</p>
          </li>
          <li class="flow__item reveal">
            <span class="flow__index">B</span>
            <h3>Pohyb</h3>
            <p>Reveal a page transition dodávají přítomnost, ne šum.</p>
          </li>
          <li class="flow__item reveal">
            <span class="flow__index">C</span>
            <h3>Navigace</h3>
            <p>Podstránky propojujeme přes NuxtLink — rychle a bez reloadu.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section close">
      <div class="section__inner reveal">
        <h2 class="section__title">
          Další krok
        </h2>
        <p class="section__text">
          Podívejte se, jak z nápadu vzniká hotová stránka.
        </p>
        <div class="cta-row">
          <NuxtLink class="btn btn--ink" to="/postup">
            Přejít na postup
          </NuxtLink>
          <NuxtLink class="btn btn--outline" to="/">
            Zpět domů
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
