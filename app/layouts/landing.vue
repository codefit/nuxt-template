<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'landing-html',
  },
  bodyAttrs: {
    class: 'landing-body',
  },
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
    },
  ],
})
</script>

<template>
  <div class="landing-shell min-h-dvh bg-[#f3f3f1] text-neutral-900 antialiased lg:h-dvh lg:overflow-hidden">
    <slot />
  </div>
</template>

<style>
html.landing-html,
html.landing-html body.landing-body {
  height: 100%;
}

@media (min-width: 1024px) {
  html.landing-html,
  html.landing-html body.landing-body {
    overflow: hidden;
  }
}

.landing-shell {
  font-family: Manrope, ui-sans-serif, system-ui, sans-serif;
}
</style>
