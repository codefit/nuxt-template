<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <Main>
      <slot />
    </Main>
    <Footer />
    <Consent />
  </div>
</template>
