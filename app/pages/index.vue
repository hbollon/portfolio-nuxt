<script setup lang="ts">
import type {
  About,
  Contact,
  Education,
  Experience,
  Homepage,
  Project,
  Technology,
} from '../../shared/types/strapi'
import { buildFallbackData } from '../utils/fallback-content'
import enContent from '../../locales/content/en'
import frContent from '../../locales/content/fr'

const { locale } = useI18n()

const strapi = useStrapi()
const runtimeConfig = useRuntimeConfig()

const localeKey = computed(() => locale.value)
const hasStrapiConfig = computed(() => runtimeConfig.public.strapiEnabled)
const fallbackData = computed(() => {
  const content = localeKey.value === 'fr' ? frContent : enContent
  return buildFallbackData(content, localeKey.value)
})

const { data: homepage } = await useAsyncData<Homepage>(
  () => `homepage-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getHomepage(localeKey.value)
      : fallbackData.value.homepage
)

const { data: about } = await useAsyncData<About>(
  () => `about-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getAbout(localeKey.value)
      : fallbackData.value.about
)

const { data: contact } = await useAsyncData<Contact>(
  () => `contact-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getContact(localeKey.value)
      : fallbackData.value.contact
)

const { data: projects } = await useAsyncData<Project[]>(
  () => `projects-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getProjects(localeKey.value)
      : fallbackData.value.projects
)

const { data: experiences } = await useAsyncData<Experience[]>(
  () => `experiences-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getExperiences(localeKey.value)
      : fallbackData.value.experiences
)

const { data: educations } = await useAsyncData<Education[]>(
  () => `educations-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getEducations(localeKey.value)
      : fallbackData.value.educations
)

const { data: technologies } = await useAsyncData<Technology[]>(
  () => `technologies-${localeKey.value}`,
  async () =>
    import.meta.server && hasStrapiConfig.value
      ? await strapi.getTechnologies()
      : fallbackData.value.technologies
)

const featuredProjects = computed(() =>
  homepage.value?.featuredProjects?.length
    ? homepage.value.featuredProjects
    : (projects.value ?? [])
)

useSeo(homepage.value?.seo)
</script>

<template>
  <main>
    <HeroSection v-if="homepage" :homepage="homepage" />
    <AboutSection v-if="about" :about="about" />
    <ExperienceSection
      v-if="experiences && educations"
      :experiences="experiences"
      :educations="educations"
    />
    <SkillsSection v-if="technologies" :technologies="technologies" />
    <ProjectsSection v-if="featuredProjects.length" :projects="featuredProjects" />
    <ContactSection v-if="contact" :contact="contact" />
  </main>
</template>
