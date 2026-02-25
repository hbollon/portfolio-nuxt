// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxt/image', '@vueuse/nuxt', '@nuxtjs/sitemap', '@nuxt/icon'],

  css: ['~/assets/css/main.css', '~/assets/css/animations.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  vite: {
    // https://github.com/tailwindlabs/tailwindcss/discussions/19655
    // @ts-expect-error - Vite plugin type mismatch between Nuxt and Tailwind
    plugins: tailwindcss(),
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  nitro: {
    prerender: {
      routes: ['/', '/fr/'],
    },
  },

  runtimeConfig: {
    strapiUrl: process.env.STRAPI_URL || '',
    strapiToken: process.env.STRAPI_TOKEN || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap',
        },
      ],
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://hugobollon.dev',
    name: 'Hugo Bollon',
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
    ],
    defaultLocale: 'en',
    // Keep English as the default without auto-redirecting based on browser language.
    detectBrowserLanguage: false,
    strategy: 'prefix_except_default',
    langDir: '../locales',
    vueI18n: './i18n.config.ts',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://hugobollon.dev',
  },

  image: {
    provider: 'none',
  },

  sitemap: {
    autoI18n: true,
    xsl: false,
    credits: false,
    sitemapName: 'sitemap.xml',
  },
})
