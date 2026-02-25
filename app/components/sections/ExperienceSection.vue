<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

// Timeline items are computed to react to locale changes.
const timelineItems = computed(() => [
  {
    type: 'work',
    title: t('experience.items.sre.title'),
    company: t('experience.items.sre.company'),
    period: t('experience.items.sre.period'),
    location: t('experience.items.sre.location'),
    description: t('experience.items.sre.description'),
    technologies: [
      { name: 'Go', icon: 'devicon:go', color: '#00add8' },
      { name: 'Kubernetes', icon: 'devicon:kubernetes', color: '#326ce5' },
      { name: 'Terraform', icon: 'devicon:terraform', color: '#7b42bc' },
    ],
  },
  {
    type: 'work',
    title: t('experience.items.platform.title'),
    company: t('experience.items.platform.company'),
    period: t('experience.items.platform.period'),
    location: t('experience.items.platform.location'),
    description: t('experience.items.platform.description'),
    technologies: [
      { name: 'AWS', icon: 'devicon:amazonwebservices', color: '#ff9900' },
      { name: 'Docker', icon: 'devicon:docker', color: '#2496ed' },
      { name: 'Grafana', icon: 'devicon:grafana', color: '#f46800' },
    ],
  },
  {
    type: 'education',
    title: t('experience.education.msc.title'),
    company: t('experience.education.msc.school'),
    period: t('experience.education.msc.period'),
    location: t('experience.education.msc.location'),
    description: t('experience.education.msc.description'),
    technologies: [
      { name: 'Distributed Systems', icon: 'mdi:server-network', color: '#3b82f6' },
      { name: 'Networking', icon: 'mdi:lan', color: '#06b6d4' },
    ],
  },
])
</script>

<template>
  <Section id="experience">
    <Container>
      <div class="space-y-12">
        <ScrollReveal>
          <div class="space-y-3">
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ t('experience.title') }}
            </h2>
            <p class="text-star-gray max-w-2xl text-base leading-relaxed">
              {{ t('experience.subtitle') }}
            </p>
          </div>
        </ScrollReveal>

        <div class="relative">
          <div
            class="from-nebula-purple via-electric-blue to-cosmic-cyan absolute top-0 left-3 h-full w-px bg-gradient-to-b lg:left-1/2"
          />
          <div class="space-y-10">
            <ScrollReveal
              v-for="(item, index) in timelineItems"
              :key="`${item.title}-${index}`"
              :delay="150 + index * 100"
            >
              <div class="relative lg:grid lg:grid-cols-2">
                <span
                  class="bg-nebula-purple absolute top-6 left-3 h-3 w-3 -translate-x-1/2 rounded-full lg:left-1/2"
                />
                <div
                  class="pl-10"
                  :class="index % 2 === 0 ? 'lg:col-start-1 lg:pr-12' : 'lg:col-start-2 lg:pl-12'"
                >
                  <ExperienceCard v-bind="item" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>
