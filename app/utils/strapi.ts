import type { StrapiMedia, StrapiMediaFormat } from '../../shared/types/strapi'

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

// Returns the CDN base URL when configured, stripping any trailing slash.
const getCdnBase = (): string => {
  const config = useRuntimeConfig()
  const cdn = (config.public.strapiMediaCdnUrl as string) || ''
  return cdn.replace(/\/$/, '')
}

// Rewrites a Strapi media URL to use the CDN when available.
const rewriteUrl = (url: string): string => {
  const cdn = getCdnBase()
  if (!cdn || !url) {
    return url
  }

  // If the URL is already absolute with a different host, replace the origin.
  try {
    const parsed = new URL(url)
    return `${cdn}${parsed.pathname}`
  } catch {
    // Relative URL — simply prepend the CDN base.
    return `${cdn}${url.startsWith('/') ? '' : '/'}${url}`
  }
}

export const getStrapiMedia = (media?: StrapiMedia | null): string => {
  if (!media?.url) {
    return ''
  }

  return rewriteUrl(media.url)
}

// Selects a specific format variant (e.g. "small", "thumbnail") with fallback to the original URL.
export const getStrapiMediaVariant = (media?: StrapiMedia | null, format?: string): string => {
  if (!media?.url) {
    return ''
  }

  if (format && media.formats?.[format]) {
    return rewriteUrl(media.formats[format].url)
  }

  return rewriteUrl(media.url)
}

// Extracts width/height from a media object or a specific format variant.
export const getStrapiMediaDimensions = (
  media?: StrapiMedia | null,
  format?: string
): { width: number | null; height: number | null } => {
  if (!media) {
    return { width: null, height: null }
  }

  if (format && media.formats?.[format]) {
    const f: StrapiMediaFormat = media.formats[format]
    return { width: f.width ?? null, height: f.height ?? null }
  }

  return { width: media.width ?? null, height: media.height ?? null }
}
