<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href: string
    icon: string
    label: string
    showLabel?: boolean
    external?: boolean
  }>(),
  {
    showLabel: false,
    external: true,
  }
)

// Keep external links safe by default while allowing internal overrides.
const relValue = props.external ? 'noopener noreferrer' : undefined
const targetValue = props.external ? '_blank' : undefined
</script>

<template>
  <a
    :href="props.href"
    :rel="relValue"
    :target="targetValue"
    class="text-star-gray hover:text-star-white border-star-gray/15 hover:border-nebula-purple/40 bg-space-black/20 inline-flex items-center gap-2 rounded-xl border px-3 py-2 break-words transition"
    :aria-label="props.label"
  >
    <span
      class="border-star-gray/20 bg-space-void/80 flex h-8 w-8 items-center justify-center rounded-full border transition"
    >
      <Icon :name="props.icon" class="h-4 w-4" />
    </span>
    <span v-if="props.showLabel" class="text-sm leading-snug font-medium">
      {{ props.label }}
    </span>
  </a>
</template>
