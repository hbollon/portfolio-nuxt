<script setup lang="ts">
const { t } = useI18n()

const highlights = [
  { label: 'Go', icon: 'devicon:go', color: '#00add8' },
  { label: 'Kubernetes', icon: 'devicon:kubernetes', color: '#326ce5' },
  { label: 'AWS', icon: 'devicon:amazonwebservices', color: '#ff9900' },
]
</script>

<template>
  <Section id="about" tone="alt">
    <Container>
      <div class="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="space-y-6">
          <ScrollReveal>
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ t('about.title') }}
            </h2>
          </ScrollReveal>
          <ScrollReveal :delay="150">
            <p class="text-star-gray max-w-prose text-base leading-relaxed">
              {{ t('about.description') }}
            </p>
          </ScrollReveal>
          <ScrollReveal :delay="250">
            <div class="flex flex-wrap gap-3">
              <SkillBadge
                v-for="item in highlights"
                :key="item.label"
                :label="item.label"
                :icon="item.icon"
                :color="item.color"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal :delay="350">
            <div class="flex flex-wrap gap-4">
              <Button tag="a" href="#" variant="secondary">
                {{ t('about.resume') }}
              </Button>
              <Button tag="a" href="https://github.com/hbollon" variant="ghost">
                {{ t('about.github') }}
              </Button>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal :delay="150">
          <Card class="flex h-full flex-col justify-between">
            <div class="space-y-4">
              <span class="text-star-gray text-sm tracking-[0.25em] uppercase">
                {{ t('about.profileLabel') }}
              </span>
              <h3 class="text-star-white text-xl font-semibold">
                {{ t('about.profileTitle') }}
              </h3>
              <p class="text-star-gray text-sm leading-relaxed">
                {{ t('about.profileBody') }}
              </p>
            </div>
            <div class="border-star-gray/10 mt-6 border-t pt-6">
              <p class="text-star-gray font-mono text-xs">
                {{ t('about.location') }}
              </p>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </Container>
  </Section>
</template>
