<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    color?: string
    icon?: string
  }>(),
  {
    color: 'var(--color-nebula-purple)',
    icon: undefined,
  }
)
</script>

<template>
  <span
    class="border-star-gray/10 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm transition duration-200 hover:scale-110"
    :style="{
      backgroundColor: `color-mix(in srgb, ${props.color} 15%, transparent)`,
      color: 'var(--color-star-white)',
      boxShadow: `0 0 12px ${props.color}33`,
    }"
  >
    <Icon v-if="props.icon" :name="props.icon" class="h-4 w-4" aria-hidden="true" />
    <span>{{ props.label }}</span>
  </span>
</template>
