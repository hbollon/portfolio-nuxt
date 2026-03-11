<script setup lang="ts">
import { computed } from 'vue'
import type { About, SocialPlatform } from '../../../shared/types/strapi'
import { renderMarkdown } from '../../utils/markdown'
import { getStrapiMedia } from '../../utils/strapi'

const props = defineProps<{
  about: About
}>()

const { t } = useI18n()

const profileImage = computed(() => getStrapiMedia(props.about.profilePicture))
const resumeUrl = computed(() => getStrapiMedia(props.about.resume))
const bioHtml = computed(() => renderMarkdown(props.about.bio))

const githubLink = computed(() =>
  props.about.socialLinks?.find((link) => link.platform === 'github')
)

const primarySocial = computed(() => githubLink.value ?? props.about.socialLinks?.[0])

const socialIconMap: Record<SocialPlatform, string> = {
  github: 'mdi:github',
  linkedin: 'mdi:linkedin',
  twitter: 'mdi:twitter',
  email: 'mdi:email',
  website: 'mdi:web',
}

const primarySocialIcon = computed(() => {
  if (!primarySocial.value) {
    return 'mdi:link-variant'
  }

  return socialIconMap[primarySocial.value.platform]
})
</script>

<template>
  <Section id="about" tone="alt">
    <Container>
      <div class="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-6">
          <ScrollReveal>
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ props.about.title }}
            </h2>
          </ScrollReveal>
          <ScrollReveal :delay="150">
            <p class="text-star-gray max-w-prose text-base leading-relaxed">
              {{ props.about.subtitle }}
            </p>
          </ScrollReveal>
          <ScrollReveal :delay="250">
            <div class="flex flex-wrap gap-3">
              <SkillBadge
                v-for="skill in props.about.highlightedSkills ?? []"
                :key="skill.slug"
                :label="skill.name"
                :icon="skill.icon ?? undefined"
                :color="skill.color ?? undefined"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal :delay="350">
            <div class="flex flex-wrap gap-4">
              <Button v-if="resumeUrl" tag="a" :href="resumeUrl" variant="secondary">
                <Icon name="mdi:file-document-outline" class="h-5 w-5" />
                {{ t('about.resume') }}
              </Button>
              <Button
                v-if="primarySocial"
                tag="a"
                :href="primarySocial.url"
                variant="primary"
                class="shadow-glow-purple"
              >
                <Icon :name="primarySocialIcon" class="h-5 w-5" />
                {{ githubLink ? t('about.github') : primarySocial.label }}
              </Button>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal :delay="150">
          <Card class="flex h-full flex-col justify-between">
            <div class="space-y-4">
              <span class="text-star-gray mb-5 inline-block text-sm tracking-[0.25em] uppercase">
                {{ t('about.profileLabel') }}
              </span>
              <div class="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div
                  v-if="profileImage"
                  class="border-star-gray/20 mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border lg:mx-0"
                >
                  <img
                    :src="profileImage"
                    :alt="props.about.title"
                    class="h-full w-full object-cover"
                  />
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  class="markdown text-star-gray w-full min-w-0 flex-1 text-sm leading-relaxed"
                  v-html="bioHtml"
                />
                <!-- eslint-enable vue/no-v-html -->
              </div>
            </div>
            <div class="border-star-gray/10 mt-6 border-t pt-6">
              <div class="flex flex-wrap gap-3">
                <SocialLink
                  v-for="link in props.about.socialLinks ?? []"
                  :key="link.url"
                  :href="link.url"
                  :icon="socialIconMap[link.platform]"
                  :label="link.label"
                  :show-label="true"
                />
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </Container>
  </Section>
</template>
