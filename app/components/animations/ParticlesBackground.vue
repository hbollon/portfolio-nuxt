<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { tsParticles } from '@tsparticles/engine'

const prefersReducedMotion = ref(false)
let animationFrameId = 0

const options = computed(() => ({
  fullScreen: {
    enable: false,
  },
  fpsLimit: 60,
  detectRetina: true,
  background: {
    color: 'transparent',
  },
  particles: {
    number: {
      value: prefersReducedMotion.value ? 0 : 90,
      density: { enable: true, width: 1200, height: 800 },
    },
    color: { value: ['#f8fafc', '#a855f7', '#3b82f6', '#06b6d4'] },
    opacity: {
      value: { min: 0.1, max: 0.8 },
      animation: { enable: !prefersReducedMotion.value, speed: 0.6, minimumValue: 0.1 },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: !prefersReducedMotion.value,
      speed: 0.4,
      direction: 'none' as const,
      outModes: { default: 'out' as const },
    },
    links: {
      enable: false,
    },
  },
}))

const initParticles = async () => {
  // Load after the slim engine is registered in the client plugin.
  await tsParticles.load({ id: 'particles-bg', options: options.value })
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  animationFrameId = window.requestAnimationFrame(() => {
    void initParticles()
  })
})

onUnmounted(() => {
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
  void tsParticles.domItem(0)?.destroy()
})
</script>

<template>
  <ClientOnly>
    <div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div id="particles-bg" class="h-full w-full" />
    </div>
  </ClientOnly>
</template>
