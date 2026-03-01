<script setup lang="ts">
import { computed } from 'vue'
import type { Project, ProjectLink, Technology } from '../../../shared/types/strapi'

const props = defineProps<{
  title: string
  description: string
  imageUrl?: string
  technologies: Technology[]
  links: ProjectLink[]
  status?: Project['projectStatus']
}>()

const linkIconMap: Record<NonNullable<ProjectLink['type']>, string> = {
  github: 'mdi:github',
  live: 'mdi:open-in-new',
  demo: 'mdi:play-circle',
  article: 'mdi:book-open-variant',
}

const statusColorMap: Record<NonNullable<Project['projectStatus']>, string> = {
  completed: '#22c55e',
  in_progress: '#38bdf8',
  archived: '#94a3b8',
}

const { t } = useI18n()

const statusLabel = computed(() => (props.status ? t(`projects.status.${props.status}`) : ''))

const statusColor = computed(() => (props.status ? statusColorMap[props.status] : undefined))
</script>

<template>
  <Card class="group flex h-full flex-col overflow-hidden">
    <div
      v-if="props.imageUrl"
      class="bg-nebula-ink/40 overflow-hidden rounded-xl px-2 py-3 sm:px-3"
    >
      <img
        :src="props.imageUrl"
        :alt="props.title"
        class="h-40 w-full object-contain transition duration-200 group-hover:scale-[1.02] sm:h-44"
        loading="lazy"
      />
    </div>
    <div class="mt-2 flex flex-1 flex-col space-y-4">
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-star-white text-xl font-semibold">{{ props.title }}</h3>
          <Badge v-if="props.status" :label="statusLabel" icon="mdi:circle" :color="statusColor" />
        </div>
        <p class="text-star-gray mt-2 text-sm leading-relaxed">
          {{ props.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <SkillBadge
          v-for="tech in props.technologies"
          :key="tech.name"
          :label="tech.name"
          :icon="tech.icon ?? undefined"
          :color="tech.color ?? undefined"
        />
      </div>
      <div class="mt-auto flex flex-wrap gap-4">
        <a
          v-for="link in props.links"
          :key="link.url"
          :href="link.url"
          class="text-star-gray hover:text-star-white inline-flex items-center gap-2 text-sm transition"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon :name="link.type ? linkIconMap[link.type] : 'mdi:link-variant'" class="h-4 w-4" />
          {{ link.label }}
        </a>
      </div>
    </div>
  </Card>
</template>
