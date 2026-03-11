<script setup lang="ts">
import { computed } from 'vue'
import type { Contact } from '../../../shared/types/strapi'

const props = defineProps<{
  contact: Contact
}>()

const { t } = useI18n()

const contactLinks = computed(() => {
  const methods = props.contact.contactMethods ?? []
  if (methods.length === 0) {
    return [
      { label: props.contact.email, href: `mailto:${props.contact.email}`, icon: 'mdi:email' },
    ]
  }

  return methods.map((method) => {
    const rawValue = method.value.trim()
    const lowerValue = rawValue.toLowerCase()
    const href =
      lowerValue.startsWith('http') ||
      lowerValue.startsWith('mailto:') ||
      lowerValue.startsWith('tel:')
        ? rawValue
        : rawValue.includes('@')
          ? `mailto:${rawValue}`
          : rawValue.startsWith('+')
            ? `tel:${rawValue}`
            : rawValue

    return {
      label: method.method,
      href,
      icon: method.icon ?? 'mdi:link-variant',
    }
  })
})

const availabilityLabel = computed(() =>
  props.contact.availableForWork ? t('contact.status') : t('contact.unavailable')
)
</script>

<template>
  <Section id="contact" tone="alt">
    <Container>
      <div class="grid gap-10 lg:grid-cols-[1fr,0.9fr]">
        <ScrollReveal>
          <div class="space-y-4">
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ props.contact.title }}
            </h2>
            <p class="text-star-gray max-w-xl text-base leading-relaxed">
              {{ props.contact.description }}
            </p>
            <div class="flex flex-wrap gap-3">
              <Badge
                :label="availabilityLabel"
                :icon="props.contact.availableForWork ? 'mdi:check-circle' : 'mdi:close-circle'"
                :color="props.contact.availableForWork ? '#22c55e' : '#f97316'"
              />
              <Badge :label="t('contact.location')" icon="mdi:map-marker" color="#3b82f6" />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal :delay="150">
          <Card class="space-y-4">
            <h3 class="text-star-white text-lg font-semibold">
              {{ t('contact.cta') }}
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <SocialLink
                v-for="link in contactLinks"
                :key="link.href"
                :href="link.href"
                :icon="link.icon"
                :label="link.label"
                :show-label="true"
              />
            </div>
            <Button
              class="w-full"
              variant="primary"
              size="lg"
              tag="a"
              :href="`mailto:${props.contact.email}`"
            >
              {{ t('contact.ctaButton') }}
            </Button>
          </Card>
        </ScrollReveal>
      </div>
    </Container>
  </Section>
</template>
