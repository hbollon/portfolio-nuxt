<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'

const props = withDefaults(
  defineProps<{
    phrases: string[]
    duration?: number
  }>(),
  {
    duration: 2.4,
  }
)

const current = ref('')
const prefersReducedMotion = ref(false)
let timeline: gsap.core.Timeline | null = null

const cycle = () => {
  if (props.phrases.length === 0) {
    current.value = ''
    return
  }

  // Keep the timeline lightweight: switch text, hold, then repeat.
  timeline?.kill()
  timeline = gsap.timeline({ repeat: -1 })

  for (const phrase of props.phrases) {
    timeline
      .to({}, { duration: 0.2 })
      .call(() => {
        current.value = phrase
      })
      .to({}, { duration: props.duration })
  }
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) {
    current.value = props.phrases[0] ?? ''
    return
  }

  cycle()
})

watch(
  () => props.phrases,
  (value) => {
    if (prefersReducedMotion.value) {
      current.value = value[0] ?? ''
      return
    }

    // Rebuild the timeline when phrases change to avoid stale text.
    cycle()
  }
)

onUnmounted(() => {
  // Ensure GSAP timelines are released on unmount.
  timeline?.kill()
  timeline = null
})
</script>

<template>
  <span class="inline-flex min-h-[1em] items-center">
    {{ current }}
  </span>
</template>
