import { loadSlim } from '@tsparticles/slim'
import { tsParticles } from '@tsparticles/engine'

export default defineNuxtPlugin(async () => {
  if (typeof window === 'undefined') {
    return
  }

  // Load the slim engine once; motion preferences are handled by component options.
  await loadSlim(tsParticles)
})
