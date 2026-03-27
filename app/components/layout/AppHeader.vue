<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

type NavItem = {
  id: string
  label: string
}

const { t } = useI18n()

// Build nav labels from i18n while keeping section IDs stable.
const navItems = computed<NavItem[]>(() => [
  { id: 'hero', label: t('nav.home') },
  { id: 'about', label: t('nav.about') },
  { id: 'experience', label: t('nav.experience') },
  { id: 'skills', label: t('nav.skills') },
  { id: 'projects', label: t('nav.projects') },
  { id: 'contact', label: t('nav.contact') },
])

// Keep section IDs centralized to drive both scroll spy and anchor links.
const sectionIds = computed(() => navItems.value.map((item) => item.id))

const isScrolled = ref(false)
const activeSection = ref('hero')
const isMenuOpen = ref(false)
const menuToggleRef = ref<HTMLButtonElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 50
}

// Fall back to a position-based check to keep the active state stable
// when IntersectionObserver thresholds are too coarse for short sections.
const updateActiveSection = () => {
  if (typeof window === 'undefined') {
    return
  }

  const middle = window.scrollY + window.innerHeight * 0.35
  for (const id of sectionIds.value) {
    const section = document.getElementById(id)
    if (!section) {
      continue
    }

    const top = section.offsetTop
    const bottom = top + section.offsetHeight
    if (middle >= top && middle < bottom) {
      activeSection.value = id
      return
    }
  }
}

const onResize = () => {
  if (window.innerWidth >= 1024) {
    isMenuOpen.value = false
  }
}

const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  updateScrollState()
  updateActiveSection()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('resize', updateActiveSection, { passive: true })

  // Scroll spy based on section IDs; labels are localized separately.
  const sections = sectionIds.value
    .map((id) => document.getElementById(id))
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
    observer.value?.observe(section)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('resize', updateActiveSection)
  observer.value?.disconnect()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Move focus into the mobile menu on open, back to the toggle on close.
watch(isMenuOpen, async (open) => {
  await nextTick()
  if (open) {
    const firstLink = mobileMenuRef.value?.querySelector('a') as HTMLElement | null
    firstLink?.focus()
  } else {
    menuToggleRef.value?.focus()
  }
})

// Close the mobile menu when the user presses Escape.
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 z-50 w-full" @keydown="onKeydown">
    <div
      class="h-16 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300"
      :class="
        isScrolled ? 'bg-space-void/70 shadow-glow-subtle backdrop-blur-lg' : 'bg-transparent'
      "
    >
      <div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span class="text-gradient">Hugo Bollon</span>
          <span class="text-star-gray text-xs">DevOps Engineer</span>
        </div>

        <nav class="hidden items-center gap-6 text-sm lg:flex" aria-label="Main navigation">
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
          ref="menuToggleRef"
          class="border-star-gray/20 text-star-white flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMenu"
        >
          <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <nav
      id="mobile-menu"
      ref="mobileMenuRef"
      class="overflow-hidden transition-[opacity,transform] duration-300 ease-out lg:hidden"
      :class="
        isMenuOpen
          ? 'pointer-events-auto scale-y-100 opacity-100'
          : 'pointer-events-none scale-y-0 opacity-0'
      "
      style="transform-origin: top"
      aria-label="Mobile navigation"
    >
      <div class="border-star-gray/10 bg-space-void/90 border-t px-4 py-6 backdrop-blur-lg">
        <div class="flex flex-col gap-4">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            class="text-star-gray hover:text-star-white text-base transition"
            :tabindex="isMenuOpen ? 0 : -1"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>
        </div>
        <div class="mt-6">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  </header>
</template>
