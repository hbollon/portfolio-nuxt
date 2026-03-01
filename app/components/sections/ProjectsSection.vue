<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '../../../shared/types/strapi'
import { getStrapiMedia } from '../../utils/strapi'

const props = defineProps<{
  projects: Project[]
}>()

const { t } = useI18n()

const projectCards = computed(() =>
  props.projects.map((project) => ({
    title: project.title,
    description: project.shortDescription,
    imageUrl: getStrapiMedia(project.thumbnail),
    technologies: project.technologies ?? [],
    links: project.links ?? [],
    status: project.projectStatus ?? undefined,
  }))
)
</script>

<template>
  <Section id="projects">
    <Container>
      <div class="space-y-10">
        <ScrollReveal>
          <div class="space-y-3">
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ t('projects.title') }}
            </h2>
            <p class="text-star-gray max-w-2xl text-base leading-relaxed">
              {{ t('projects.subtitle') }}
            </p>
          </div>
        </ScrollReveal>

        <div class="grid gap-8 lg:grid-cols-2">
          <ScrollReveal
            v-for="(project, index) in projectCards"
            :key="project.title"
            :delay="150 + index * 100"
          >
            <ProjectCard v-bind="project" />
          </ScrollReveal>
        </div>
      </div>
    </Container>
  </Section>
</template>
