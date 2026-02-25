import { loadSlim } from '@tsparticles/slim'
import { tsParticles } from '@tsparticles/engine'

export default defineNuxtPlugin(async () => {
  if (typeof window === 'undefined') {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return
  }

  // Load the slim engine once; the component only provides options and mounting.
  await loadSlim(tsParticles)
})
