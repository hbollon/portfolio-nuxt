<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const categories = computed(() => [
  {
    label: t('skills.categories.languages'),
    items: [
      { label: 'Go', icon: 'devicon:go', color: '#00add8' },
      { label: 'TypeScript', icon: 'devicon:typescript', color: '#3178c6' },
      { label: 'Python', icon: 'devicon:python', color: '#3776ab' },
    ],
  },
  {
    label: t('skills.categories.platforms'),
    items: [
      { label: 'Kubernetes', icon: 'devicon:kubernetes', color: '#326ce5' },
      { label: 'AWS', icon: 'devicon:amazonwebservices', color: '#ff9900' },
      { label: 'Terraform', icon: 'devicon:terraform', color: '#7b42bc' },
    ],
  },
  {
    label: t('skills.categories.tooling'),
    items: [
      { label: 'Grafana', icon: 'devicon:grafana', color: '#f46800' },
      { label: 'Prometheus', icon: 'devicon:prometheus', color: '#e6522c' },
      { label: 'Docker', icon: 'devicon:docker', color: '#2496ed' },
    ],
  },
])
</script>

<template>
  <Section id="skills" tone="alt">
    <Container>
      <div class="space-y-10">
        <ScrollReveal>
          <div class="space-y-3">
            <h2 class="text-star-white text-3xl font-bold md:text-4xl">
              {{ t('skills.title') }}
            </h2>
            <p class="text-star-gray max-w-2xl text-base leading-relaxed">
              {{ t('skills.subtitle') }}
            </p>
          </div>
        </ScrollReveal>

        <div class="grid gap-8 lg:grid-cols-3">
          <ScrollReveal
            v-for="(category, index) in categories"
            :key="category.label"
            :delay="150 + index * 100"
          >
            <Card class="space-y-6">
              <div class="space-y-2">
                <h3 class="text-star-white text-lg font-semibold">
                  {{ category.label }}
                </h3>
                <div class="bg-gradient-aurora h-[2px] w-16 rounded-full" />
              </div>
              <div class="flex flex-wrap gap-3">
                <SkillBadge
                  v-for="item in category.items"
                  :key="item.label"
                  :label="item.label"
                  :icon="item.icon"
                  :color="item.color"
                />
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </Container>
  </Section>
</template>
