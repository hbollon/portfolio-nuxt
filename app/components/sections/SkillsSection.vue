<script setup lang="ts">
import { computed } from 'vue'
import type { Technology, TechnologyCategory } from '../../../shared/types/strapi'

const props = defineProps<{
  technologies: Technology[]
}>()

const { t } = useI18n()

const categories = computed(() => {
  const groups = new Map<TechnologyCategory, Technology[]>()

  for (const tech of props.technologies) {
    const items = groups.get(tech.category) ?? []
    items.push(tech)
    groups.set(tech.category, items)
  }

  const orderedCategories: TechnologyCategory[] = [
    'language',
    'framework',
    'cloud',
    'database',
    'tool',
    'other',
  ]

  const categoryLabelMap: Record<TechnologyCategory, string> = {
    language: t('skills.categories.languages'),
    framework: t('skills.categories.frameworks'),
    tool: t('skills.categories.tooling'),
    cloud: t('skills.categories.platforms'),
    database: t('skills.categories.databases'),
    other: t('skills.categories.other'),
  }

  return orderedCategories
    .map((category) => {
      const items = groups.get(category) ?? []
      const sortedItems = [...items].sort((a, b) => {
        const orderDiff = (a.order ?? 0) - (b.order ?? 0)
        return orderDiff !== 0 ? orderDiff : a.name.localeCompare(b.name)
      })

      return {
        label: categoryLabelMap[category],
        items: sortedItems,
      }
    })
    .filter((category) => category.items.length > 0)
})
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

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ScrollReveal
            v-for="(category, index) in categories"
            :key="category.label"
            :delay="150 + index * 100"
          >
            <Card class="flex h-full flex-col space-y-6">
              <div class="space-y-2">
                <h3 class="text-star-white text-lg font-semibold">
                  {{ category.label }}
                </h3>
                <div class="bg-gradient-aurora h-[2px] w-16 rounded-full" />
              </div>
              <div class="flex flex-wrap gap-3">
                <SkillBadge
                  v-for="item in category.items"
                  :key="item.slug"
                  :label="item.name"
                  :icon="item.icon ?? undefined"
                  :color="item.color ?? undefined"
                />
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </Container>
  </Section>
</template>
