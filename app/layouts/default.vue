<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
</script>

<template>
  <div class="bg-space-black text-star-white min-h-screen">
    <AppHeader />
    <main class="pt-16">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
