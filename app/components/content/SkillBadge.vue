<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    icon?: string
    color?: string
  }>(),
  {
    icon: undefined,
    color: 'var(--color-cosmic-cyan)',
  }
)
</script>

<template>
  <Badge :label="props.label" :icon="props.icon" :color="props.color" />
</template>
