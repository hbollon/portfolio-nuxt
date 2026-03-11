<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    phrases: string[]
    typingSpeed?: number
    deletingSpeed?: number
    holdDuration?: number
    transitionPause?: number
  }>(),
  {
    typingSpeed: 70,
    deletingSpeed: 45,
    holdDuration: 1200,
    transitionPause: 250,
  }
)

const current = ref('')
const prefersReducedMotion = ref(false)
let activeTimer: ReturnType<typeof setTimeout> | undefined

const clearTimer = () => {
  if (activeTimer) {
    clearTimeout(activeTimer)
    activeTimer = undefined
  }
}

const cycle = () => {
  if (props.phrases.length === 0) {
    current.value = ''
    return
  }

  let phraseIndex = 0
  let charIndex = 0
  let isDeleting = false

  const tick = () => {
    const phrase = props.phrases[phraseIndex] ?? ''

    if (!isDeleting) {
      charIndex += 1
      current.value = phrase.slice(0, charIndex)

      if (charIndex >= phrase.length) {
        isDeleting = true
        activeTimer = setTimeout(tick, props.holdDuration)
        return
      }

      activeTimer = setTimeout(tick, props.typingSpeed)
      return
    }

    charIndex -= 1
    current.value = phrase.slice(0, Math.max(charIndex, 0))

    if (charIndex <= 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % props.phrases.length
      activeTimer = setTimeout(tick, props.transitionPause)
      return
    }

    activeTimer = setTimeout(tick, props.deletingSpeed)
  }

  clearTimer()
  current.value = ''
  tick()
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

    cycle()
  },
  { deep: true }
)

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <span class="inline-flex min-h-[1em] items-center">
    <span>{{ current }}</span
    ><span aria-hidden="true" class="animate-terminal-cursor inline-block leading-none">_</span>
  </span>
</template>
