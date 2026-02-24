<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id?: string
    tone?: 'default' | 'alt'
  }>(),
  {
    tone: 'default',
  }
)
</script>

<template>
  <section
    :id="props.id"
    :class="['py-20 md:py-32', props.tone === 'alt' ? 'bg-space-deep/60' : 'bg-space-black']"
  >
    <slot />
  </section>
</template>
