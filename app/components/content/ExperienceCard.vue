<script setup lang="ts">
import type { Technology } from '../../../shared/types/strapi'

const props = defineProps<{
  title: string
  company: string
  period: string
  location: string
  description: string
  technologies: Technology[]
  logoUrl?: string
  current?: boolean
  details?: string
}>()

const { t } = useI18n()
</script>

<template>
  <Card class="relative space-y-4">
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-if="props.logoUrl"
          class="border-star-gray/20 flex h-10 w-10 items-center justify-center rounded-full border"
        >
          <img
            :src="props.logoUrl"
            :alt="props.company"
            class="h-8 w-8 rounded-full object-contain"
            loading="lazy"
          />
        </div>
        <div>
          <h3 class="text-star-white text-xl font-semibold">{{ props.title }}</h3>
          <p class="text-star-gray text-sm">{{ props.company }} · {{ props.location }}</p>
        </div>
      </div>
      <div class="text-star-gray flex flex-wrap items-center gap-2 font-mono text-xs">
        <span>{{ props.period }}</span>
        <Badge
          v-if="props.current"
          :label="t('experience.current')"
          icon="mdi:clock"
          color="#38bdf8"
        />
      </div>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div class="markdown text-star-gray text-sm leading-relaxed" v-html="props.description" />
    <div
      v-if="props.details"
      class="markdown text-star-gray text-sm leading-relaxed"
      v-html="props.details"
    />
    <!-- eslint-enable vue/no-v-html -->
    <div class="flex flex-wrap gap-2">
      <SkillBadge
        v-for="tech in props.technologies"
        :key="tech.name"
        :label="tech.name"
        :icon="tech.icon ?? undefined"
        :color="tech.color ?? undefined"
      />
    </div>
  </Card>
</template>
