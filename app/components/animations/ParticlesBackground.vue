<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue'
import { tsParticles } from '@tsparticles/engine'

const prefersReducedMotion = ref(false)
const isCompactViewport = ref(false)
const isLowEndDevice = ref(false)
let animationFrameId = 0

const detectDevice = () => {
  isCompactViewport.value = window.innerWidth < 768
  const nav = navigator as { deviceMemory?: number }
  isLowEndDevice.value =
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4
}

const particleCount = computed(() => (isCompactViewport.value || isLowEndDevice.value ? 50 : 90))

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
      value: particleCount.value,
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

const initParticles = async (attempt = 0) => {
  // ClientOnly renders after mount; retry until the host element exists.
  const container = document.getElementById('particles-bg')
  if (!container) {
    if (attempt < 10) {
      window.requestAnimationFrame(() => {
        void initParticles(attempt + 1)
      })
    }
    return
  }

  // Load after the slim engine is registered in the client plugin.
  await tsParticles.load({ id: 'particles-bg', options: options.value })
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  detectDevice()
  window.addEventListener('resize', detectDevice, { passive: true })

  // Respect user motion preferences (animations disabled but particles remain visible).
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  animationFrameId = window.requestAnimationFrame(async () => {
    await nextTick()
    void initParticles()
  })
})

onUnmounted(() => {
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', detectDevice)
  void tsParticles.domItem(0)?.destroy()
})
</script>

<template>
  <ClientOnly>
    <div class="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div id="particles-bg" class="h-full w-full" />
    </div>
  </ClientOnly>
</template>
