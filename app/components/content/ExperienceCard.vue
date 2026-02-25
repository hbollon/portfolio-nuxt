<script setup lang="ts">
const props = defineProps<{
  title: string
  company: string
  period: string
  location: string
  description: string
  technologies: Array<{ name: string; icon?: string; color?: string }>
}>()
</script>

<template>
  <Card class="relative space-y-4">
    <div class="flex flex-col gap-1">
      <h3 class="text-star-white text-xl font-semibold">{{ props.title }}</h3>
      <p class="text-star-gray text-sm">{{ props.company }} · {{ props.location }}</p>
      <span class="text-star-gray font-mono text-xs">{{ props.period }}</span>
    </div>
    <p class="text-star-gray text-sm leading-relaxed">
      {{ props.description }}
    </p>
    <div class="flex flex-wrap gap-2">
      <SkillBadge
        v-for="tech in props.technologies"
        :key="tech.name"
        :label="tech.name"
        :icon="tech.icon"
        :color="tech.color"
      />
    </div>
  </Card>
</template>
