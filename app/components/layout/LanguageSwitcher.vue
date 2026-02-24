<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localeCookie = useCookie<string>('i18n_redirected', { path: '/' })

const availableLocales = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

const setLocaleCookie = (code: string) => {
  localeCookie.value = code
}
</script>

<template>
  <div
    class="border-star-gray/20 bg-space-void/50 flex items-center gap-2 rounded-full border px-2 py-1"
  >
    <NuxtLink
      v-for="item in availableLocales"
      :key="item.code"
      :to="switchLocalePath(item.code)"
      class="rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase transition"
      :class="
        locale === item.code
          ? 'bg-gradient-nebula text-star-white shadow-glow-subtle'
          : 'text-star-gray hover:text-star-white'
      "
      @click="setLocaleCookie(item.code)"
    >
      {{ item.label }}
    </NuxtLink>
  </div>
</template>
