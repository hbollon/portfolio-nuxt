<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    as?: 'div' | 'section' | 'article'
  }>(),
  {
    delay: 0,
    as: 'div',
  }
)

const isVisible = ref(false)
const elementRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    isVisible.value = true
    return
  }

  if (!elementRef.value) {
    return
  }

  // Use IntersectionObserver to trigger the reveal once per element.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 }
  )

  observer.observe(elementRef.value)
})
</script>

<template>
  <component
    :is="props.as"
    ref="elementRef"
    class="transition-[transform,opacity] duration-[600ms] ease-out"
    :style="{ transitionDelay: `${props.delay}ms` }"
    :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
  >
    <slot />
  </component>
</template>
