<script setup lang="ts">
const { t } = useI18n()

const links = [
  { label: 'GitHub', href: 'https://github.com/hbollon', icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hugobollon/', icon: 'mdi:linkedin' },
  { label: 'Email', href: 'mailto:hugo@hugobollon.dev', icon: 'mdi:email' },
]
</script>

<template>
  <Section id="contact" tone="alt">
    <Container>
      <div class="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
        <ScrollReveal>
          <div class="space-y-4">
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ t('contact.title') }}
            </h2>
            <p class="text-star-gray max-w-xl text-base leading-relaxed">
              {{ t('contact.description') }}
            </p>
            <div class="flex flex-wrap gap-3">
              <Badge :label="t('contact.status')" icon="mdi:check-circle" color="#22c55e" />
              <Badge :label="t('contact.location')" icon="mdi:map-marker" color="#3b82f6" />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal :delay="150">
          <Card class="space-y-4">
            <h3 class="text-star-white text-lg font-semibold">
              {{ t('contact.cta') }}
            </h3>
            <div class="space-y-3">
              <SocialLink
                v-for="link in links"
                :key="link.href"
                :href="link.href"
                :icon="link.icon"
                :label="link.label"
                :show-label="true"
              />
            </div>
            <Button class="w-full" variant="primary" size="lg">
              {{ t('contact.ctaButton') }}
            </Button>
          </Card>
        </ScrollReveal>
      </div>
    </Container>
  </Section>
</template>
