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

const { locale } = useI18n()
const strapi = useStrapi()

const localeKey = computed(() => locale.value)

const [{ data: homepage }, { data: about }, { data: contact }] = await Promise.all([
  useAsyncData<Homepage>(
    () => `homepage-${localeKey.value}`,
    () => strapi.getHomepage(localeKey.value)
  ),
  useAsyncData<About>(
    () => `about-${localeKey.value}`,
    () => strapi.getAbout(localeKey.value)
  ),
  useAsyncData<Contact>(
    () => `contact-${localeKey.value}`,
    () => strapi.getContact(localeKey.value)
  ),
])

const [{ data: projects }, { data: experiences }, { data: educations }] = await Promise.all([
  useAsyncData<Project[]>(
    () => `projects-${localeKey.value}`,
    () => strapi.getProjects(localeKey.value)
  ),
  useAsyncData<Experience[]>(
    () => `experiences-${localeKey.value}`,
    () => strapi.getExperiences(localeKey.value)
  ),
  useAsyncData<Education[]>(
    () => `educations-${localeKey.value}`,
    () => strapi.getEducations(localeKey.value)
  ),
])

const { data: technologies } = await useAsyncData<Technology[]>(
  () => 'technologies',
  () => strapi.getTechnologies()
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
