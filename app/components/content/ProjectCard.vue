<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Project, ProjectLink, Technology } from '../../../shared/types/strapi'
import {
  extractGithubRepoPath,
  fetchGithubRepoStats,
  type GithubRepoStats,
} from '../../composables/useGithubRepoStats'

const props = defineProps<{
  title: string
  description: string
  technologies: Technology[]
  links: ProjectLink[]
  status?: Project['projectStatus']
}>()

const linkIconMap: Record<NonNullable<ProjectLink['type']>, string> = {
  github: 'mdi:github',
  live: 'mdi:open-in-new',
  demo: 'mdi:play-circle',
  article: 'mdi:book-open-variant',
}

const statusColorMap: Record<NonNullable<Project['projectStatus']>, string> = {
  completed: '#22c55e',
  in_progress: '#38bdf8',
  archived: '#94a3b8',
}

const { t } = useI18n()

const statusLabel = computed(() => (props.status ? t(`projects.status.${props.status}`) : ''))

const statusColor = computed(() => (props.status ? statusColorMap[props.status] : undefined))

const githubLink = computed(() => props.links.find((link) => link.type === 'github'))
const githubRepoPath = computed(() => {
  const url = githubLink.value?.url
  return url ? extractGithubRepoPath(url) : null
})

const githubStats = ref<GithubRepoStats | null>(null)
const isStatsLoading = ref(false)

const statItems = computed(() => {
  if (!githubStats.value) {
    return []
  }

  return [
    {
      label: t('projects.metrics.stars'),
      icon: 'mdi:star-outline',
      value: githubStats.value.stars,
    },
    {
      label: t('projects.metrics.forks'),
      icon: 'mdi:source-fork',
      value: githubStats.value.forks,
    },
    {
      label: t('projects.metrics.issues'),
      icon: 'mdi:alert-circle-outline',
      value: githubStats.value.issues,
    },
    {
      label: t('projects.metrics.pullRequests'),
      icon: 'mdi:source-pull',
      value: githubStats.value.pullRequests,
    },
  ]
})

const placeholderStatItems = computed(() => [
  { label: t('projects.metrics.stars'), icon: 'mdi:star-outline' },
  { label: t('projects.metrics.forks'), icon: 'mdi:source-fork' },
  { label: t('projects.metrics.issues'), icon: 'mdi:alert-circle-outline' },
  { label: t('projects.metrics.pullRequests'), icon: 'mdi:source-pull' },
])

const unavailableMetricsLabel = computed(() => {
  if (!githubRepoPath.value) {
    return t('projects.metrics.noRepository')
  }

  return t('projects.metrics.unavailable')
})

const compactNumber = (value: number) =>
  new Intl.NumberFormat(undefined, { notation: 'compact' }).format(value)

const displayedStats = computed(() => {
  if (statItems.value.length > 0) {
    return statItems.value.map((item) => ({
      ...item,
      displayValue: compactNumber(item.value),
    }))
  }

  return placeholderStatItems.value.map((item) => ({
    ...item,
    displayValue: '--',
  }))
})

const loadStats = async () => {
  if (!import.meta.client || !githubRepoPath.value) {
    githubStats.value = null
    return
  }

  isStatsLoading.value = true
  githubStats.value = await fetchGithubRepoStats(githubRepoPath.value)
  isStatsLoading.value = false
}

onMounted(loadStats)

watch(githubRepoPath, () => {
  loadStats()
})
</script>

<template>
  <Card class="group flex h-full flex-col overflow-hidden">
    <div class="from-electric-blue/10 to-nebula-purple/10 rounded-xl bg-gradient-to-r p-4">
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div
          v-for="stat in displayedStats"
          :key="stat.label"
          class="border-star-gray/10 bg-space-black/30 flex items-center gap-2 rounded-lg border px-3 py-2"
        >
          <Icon :name="stat.icon" class="text-cosmic-cyan h-4 w-4" />
          <div>
            <div class="text-star-gray text-[10px] tracking-wide uppercase">{{ stat.label }}</div>
            <div class="text-star-white text-sm font-semibold">{{ stat.displayValue }}</div>
          </div>
        </div>
      </div>
      <div v-if="isStatsLoading && statItems.length === 0" class="text-star-gray mt-3 text-xs">
        {{ t('projects.metrics.loading') }}
      </div>
      <div v-else-if="statItems.length === 0" class="text-star-gray mt-3 text-xs">
        {{ unavailableMetricsLabel }}
      </div>
    </div>
    <div class="mt-4 flex flex-1 flex-col space-y-4">
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-star-white text-xl font-semibold">{{ props.title }}</h3>
          <Badge v-if="props.status" :label="statusLabel" icon="mdi:circle" :color="statusColor" />
        </div>
        <p class="text-star-gray mt-2 text-sm leading-relaxed">
          {{ props.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <SkillBadge
          v-for="tech in props.technologies"
          :key="tech.name"
          :label="tech.name"
          :icon="tech.icon ?? undefined"
          :color="tech.color ?? undefined"
        />
      </div>
      <div class="mt-auto flex flex-wrap gap-4">
        <a
          v-for="link in props.links"
          :key="link.url"
          :href="link.url"
          class="text-star-gray hover:text-star-white inline-flex items-center gap-2 text-sm transition"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon :name="link.type ? linkIconMap[link.type] : 'mdi:link-variant'" class="h-4 w-4" />
          {{ link.label }}
        </a>
      </div>
    </div>
  </Card>
</template>
