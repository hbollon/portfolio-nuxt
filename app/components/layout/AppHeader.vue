<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type NavItem = {
  id: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const isScrolled = ref(false)
const activeSection = ref('hero')
const isMenuOpen = ref(false)

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 50
}

const onResize = () => {
  if (window.innerWidth >= 1024) {
    isMenuOpen.value = false
  }
}

const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  const sections = navItems
    .map((item) => document.getElementById(item.id))
    .filter((section): section is HTMLElement => Boolean(section))

  observer.value = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible.length > 0 && visible[0]?.target) {
        activeSection.value = (visible[0].target as HTMLElement).id
      }
    },
    { threshold: [0.2, 0.4, 0.6] }
  )

  for (const section of sections) {
    observer.value.observe(section)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', onResize)
  observer.value?.disconnect()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 left-0 z-50 w-full transition-all duration-300"
    :class="isScrolled ? 'bg-space-void/70 shadow-glow-subtle backdrop-blur-lg' : 'bg-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 text-lg font-semibold tracking-tight">
        <span class="text-gradient">Hugo Bollon</span>
        <span class="text-star-gray text-xs">DevOps Engineer</span>
      </div>

      <nav class="hidden items-center gap-6 text-sm lg:flex">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="text-star-gray hover:text-star-white relative transition"
          :class="activeSection === item.id ? 'text-star-white' : ''"
        >
          {{ item.label }}
          <span
            class="bg-gradient-nebula absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-opacity"
            :class="activeSection === item.id ? 'opacity-100' : 'opacity-0'"
          />
        </a>
      </nav>

      <div class="hidden lg:flex">
        <LanguageSwitcher />
      </div>

      <button
        class="border-star-gray/20 text-star-white flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="h-5 w-5" />
      </button>
    </div>

    <div
      class="lg:hidden"
      :class="isMenuOpen ? 'max-h-[520px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'"
    >
      <div class="border-star-gray/10 bg-space-void/90 border-t px-4 py-6 backdrop-blur-lg">
        <div class="flex flex-col gap-4">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            class="text-star-gray hover:text-star-white text-base transition"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>
        </div>
        <div class="mt-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>
