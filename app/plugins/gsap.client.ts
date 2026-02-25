import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return
  }

  // Register ScrollTrigger once on the client to keep GSAP setup centralized.
  gsap.registerPlugin(ScrollTrigger)
})
