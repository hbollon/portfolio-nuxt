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

export const getStrapiMedia = (media?: StrapiMedia | null): string => {
  if (!media?.url) {
    return ''
  }

  return media.url
}
