<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  imageUrl?: string
  technologies: Array<{ name: string; icon?: string; color?: string }>
  links: Array<{ label: string; url: string; icon: string }>
}>()
</script>

<template>
  <Card class="group overflow-hidden">
    <div v-if="props.imageUrl" class="overflow-hidden rounded-xl">
      <img
        :src="props.imageUrl"
        :alt="props.title"
        class="h-48 w-full object-cover transition duration-200 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div class="space-y-4">
      <div>
        <h3 class="text-star-white text-xl font-semibold">{{ props.title }}</h3>
        <p class="text-star-gray mt-2 text-sm leading-relaxed">
          {{ props.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <SkillBadge
          v-for="tech in props.technologies"
          :key="tech.name"
          :label="tech.name"
          :icon="tech.icon"
          :color="tech.color"
        />
      </div>
      <div class="flex flex-wrap gap-4">
        <a
          v-for="link in props.links"
          :key="link.url"
          :href="link.url"
          class="text-star-gray hover:text-star-white inline-flex items-center gap-2 text-sm transition"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon :name="link.icon" class="h-4 w-4" />
          {{ link.label }}
        </a>
      </div>
    </div>
  </Card>
</template>
