import type { SharedSeo } from '../../shared/types/strapi'
import { getStrapiMedia } from '../utils/strapi'

const DEFAULT_TITLE = 'Hugo Bollon — DevOps Engineer & Fullstack Dev'
const DEFAULT_DESCRIPTION =
  'DevOps Engineer and Fullstack Developer focused on Go, cloud-native infrastructure, and scalable systems.'

const localeToOg = (locale: string): string => {
  return locale === 'fr' ? 'fr_FR' : 'en_US'
}

// Provides a consistent SEO baseline while allowing per-page overrides.
export const useSeo = (seo?: SharedSeo | null) => {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = runtimeConfig.public.siteUrl || 'https://hugobollon.dev'

  const metaTitle = seo?.metaTitle ?? DEFAULT_TITLE
  const metaDescription = seo?.metaDescription ?? DEFAULT_DESCRIPTION
  const ogImage = seo?.ogImage
    ? getStrapiMedia(seo.ogImage)
    : `${siteUrl.replace(/\/$/, '')}/og-image.jpg`
  const canonical = `${siteUrl.replace(/\/$/, '')}${route.path}`

  // Centralize all meta tags so every page can share the same SEO rules.
  useHead({
    title: metaTitle,
    htmlAttrs: {
      lang: locale.value,
    },
    meta: [
      { name: 'description', content: metaDescription },
      { property: 'og:title', content: metaTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: localeToOg(locale.value) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metaTitle },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: ogImage },
    ],
    link: [{ rel: 'canonical', href: canonical }],
  })
}
