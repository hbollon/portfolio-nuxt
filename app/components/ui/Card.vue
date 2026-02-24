<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    padding?: 'sm' | 'md' | 'lg'
  }>(),
  {
    padding: 'md',
  }
)

const paddingClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    class="glass border-star-gray/10 rounded-2xl border transition duration-200"
    :class="paddingClasses[props.padding]"
  >
    <slot />
  </div>
</template>
