<script setup lang="ts">
import { computed } from 'vue'
import type { Education, Experience } from '../../../shared/types/strapi'
import { renderMarkdown } from '../../utils/markdown'
import { formatStrapiDate, getStrapiMedia } from '../../utils/strapi'

const props = defineProps<{
  experiences: Experience[]
  educations: Education[]
}>()

const { locale, t } = useI18n()

const timelineItems = computed(() => {
  const experienceItems = props.experiences.map((item) => {
    const isCurrent = item.isCurrent ?? !item.endDate

    return {
      title: item.position,
      company: item.company,
      period: `${formatStrapiDate(item.startDate, locale.value)} — ${
        isCurrent
          ? t('experience.current')
          : formatStrapiDate(item.endDate, locale.value) || t('experience.current')
      }`,
      location: item.location,
      description: renderMarkdown(item.description),
      technologies: item.technologies ?? [],
      logoUrl: getStrapiMedia(item.logo),
      current: isCurrent,
    }
  })

  const educationItems = props.educations.map((item) => ({
    title: item.degree,
    company: item.institution,
    period: `${formatStrapiDate(item.startDate, locale.value)} — ${formatStrapiDate(item.endDate, locale.value)}`,
    location: item.location,
    description: renderMarkdown(item.field),
    details: renderMarkdown(item.description) || undefined,
    technologies: [],
    logoUrl: getStrapiMedia(item.logo),
  }))

  return [...experienceItems, ...educationItems]
})
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
