<script setup lang="ts">

const route = useRoute()
const isHome = computed(() => route.path === '/')

</script>

<template>
    <header :class="['nav', { 'nav--overlay': isHome }]">
        <NuxtLink class="nav__mark" to="/">
            Nuxt
        </NuxtLink>
        <div class="nav__right">
            <nav class="nav__links" aria-label="Hlavní navigace">
            <NuxtLink to="/">
                Domů
            </NuxtLink>
            <NuxtLink to="/o-projektu">
                O projektu
            </NuxtLink>
            <NuxtLink to="/postup">
                Postup
            </NuxtLink>
            <NuxtLink to="/kontakt">
                Kontakt
            </NuxtLink>
            </nav>
            <ThemeToggle />
        </div>
    </header>
</template>