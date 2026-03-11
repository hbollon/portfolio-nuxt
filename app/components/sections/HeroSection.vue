<script setup lang="ts">
import { computed } from 'vue'
import type { Homepage } from '../../../shared/types/strapi'

defineProps<{
  homepage: Homepage
}>()

const { t } = useI18n()
const { y } = useWindowScroll()
const reducedMotion = usePreferredReducedMotion()

const phrases = computed(() => [
  t('hero.typedPhrases.0'),
  t('hero.typedPhrases.1'),
  t('hero.typedPhrases.2'),
])

// Light parallax for the hero accent, disabled for reduced motion.
const orbStyle = computed(() => {
  if (reducedMotion.value === 'reduce') {
    return { transform: 'translate3d(0, 0, 0)' }
  }

  return { transform: `translate3d(0, ${y.value * 0.15}px, 0)` }
})
</script>

<template>
  <Section id="hero" class="relative overflow-hidden">
    <ParticlesBackground />
    <div
      class="bg-gradient-aurora pointer-events-none absolute top-16 right-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
      :style="orbStyle"
      aria-hidden="true"
    />
    <Container class="relative z-10">
      <div class="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span class="text-star-gray text-sm tracking-[0.3em] uppercase">
          {{ homepage.appTitle }}
        </span>
        <h1 class="text-star-white text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          {{ homepage.heroTitle }}
          <span class="text-gradient block">{{ homepage.heroSubtitle }}</span>
        </h1>
        <p class="text-star-gray max-w-2xl text-base leading-relaxed md:text-lg">
          {{ homepage.heroDescription }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <Button tag="a" :href="homepage.heroCtaLink" size="lg">
            {{ homepage.heroCtaText }}
          </Button>
          <Button tag="a" href="#projects" variant="secondary" size="lg">
            {{ t('hero.ctaSecondary') }}
          </Button>
        </div>
        <div class="text-star-gray flex items-center gap-1 text-sm">
          <span>{{ t('hero.typedPrefix') }}</span>
          <TypedText :phrases="phrases" />
          <span>{{ t('hero.typedSuffix') }}</span>
        </div>
        <a
          href="#about"
          class="text-star-gray hover:text-star-white mt-8 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition"
        >
          <Icon name="mdi:chevron-down" class="animate-float h-5 w-5" />
          {{ t('hero.scrollHint') }}
        </a>
      </div>
    </Container>
  </Section>
</template>
