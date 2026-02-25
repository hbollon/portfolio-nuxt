<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const projects = computed(() => [
  {
    title: t('projects.items.edge.title'),
    description: t('projects.items.edge.description'),
    imageUrl:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
    technologies: [
      { name: 'Go', icon: 'devicon:go', color: '#00add8' },
      { name: 'Kubernetes', icon: 'devicon:kubernetes', color: '#326ce5' },
      { name: 'Grafana', icon: 'devicon:grafana', color: '#f46800' },
    ],
    links: [
      { label: t('projects.links.caseStudy'), url: '#', icon: 'mdi:book-open-variant' },
      { label: t('projects.links.github'), url: 'https://github.com/hbollon', icon: 'mdi:github' },
    ],
  },
  {
    title: t('projects.items.observability.title'),
    description: t('projects.items.observability.description'),
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    technologies: [
      { name: 'Prometheus', icon: 'devicon:prometheus', color: '#e6522c' },
      { name: 'Terraform', icon: 'devicon:terraform', color: '#7b42bc' },
      { name: 'AWS', icon: 'devicon:amazonwebservices', color: '#ff9900' },
    ],
    links: [
      { label: t('projects.links.live'), url: '#', icon: 'mdi:open-in-new' },
      { label: t('projects.links.github'), url: 'https://github.com/hbollon', icon: 'mdi:github' },
    ],
  },
])
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
            v-for="(project, index) in projects"
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
