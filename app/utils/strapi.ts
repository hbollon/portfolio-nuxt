import type { StrapiMedia } from '../../shared/types/strapi'

// Formats an ISO date into a compact month/year label.
export const formatStrapiDate = (value?: string | null, locale = 'en-US'): string => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
  }).format(date)
}

// Returns an absolute media URL, handling Strapi relative paths and CDN URLs.
export const getStrapiMedia = (media?: StrapiMedia | null): string => {
  if (!media?.url) {
    return ''
  }

  if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
    return media.url
  }

  const baseUrl = useRuntimeConfig().strapiUrl
  return `${baseUrl.replace(/\/$/, '')}/${media.url.replace(/^\//, '')}`
}
