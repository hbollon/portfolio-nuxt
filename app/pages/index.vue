<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen">
    <section class="px-4 py-24">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-3xl font-bold">{{ t('app.title') }}</h1>
        <p class="text-star-gray mt-4">{{ t('app.tagline') }}</p>
      </div>
    </section>
  </main>
</template>
