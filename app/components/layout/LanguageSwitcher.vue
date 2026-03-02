<script setup lang="ts">
import { computed } from 'vue'

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localeCookie = useCookie<string>('i18n_redirected', { path: '/' })

type LocaleCode = 'en' | 'fr'

const availableLocales: Array<{ code: LocaleCode; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

// Avoid hydration mismatches by stripping hashes from locale switch links.
const localeLinks = computed(() =>
  availableLocales.map((item) => {
    const rawHref = switchLocalePath(item.code) ?? '/'
    const cleanedHref = rawHref.split('#')[0] ?? '/'
    const normalized =
      cleanedHref === '/' || cleanedHref.endsWith('/') ? cleanedHref : `${cleanedHref}/`

    return {
      ...item,
      href: normalized,
    }
  })
)

const setLocaleCookie = (code: string) => {
  localeCookie.value = code
}
</script>

<template>
  <div
    class="border-star-gray/20 bg-space-void/50 flex items-center gap-2 rounded-full border px-2 py-1"
  >
    <a
      v-for="item in localeLinks"
      :key="item.code"
      :href="item.href"
      class="rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase transition"
      :class="
        locale === item.code
          ? 'bg-gradient-nebula text-star-white shadow-glow-subtle'
          : 'text-star-gray hover:text-star-white'
      "
      @click="setLocaleCookie(item.code)"
    >
      {{ item.label }}
    </a>
  </div>
</template>
