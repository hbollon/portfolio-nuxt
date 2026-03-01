import type {
  About,
  Contact,
  Education,
  Experience,
  Homepage,
  Project,
  SharedSeo,
  StrapiMedia,
  Technology,
} from '../../shared/types/strapi'
import { createStrapiApi } from '../utils/strapi-client'

// Exposes Strapi fetchers bound to runtime configuration.
export const useStrapi = () => {
  if (import.meta.client) {
    const error = async () => {
      throw new Error('Strapi fetchers are server-only')
    }

    return {
      getHomepage: error,
      getAbout: error,
      getContact: error,
      getProjects: error,
      getExperiences: error,
      getEducations: error,
      getTechnologies: error,
    }
  }

  const { strapiUrl, strapiToken } = useRuntimeConfig()
  const api = createStrapiApi({ baseUrl: strapiUrl, token: strapiToken })

  const normalizeLocale = (locale?: string): string | undefined => {
    if (!locale) {
      return locale
    }

    if (locale === 'fr') {
      return 'fr-FR'
    }

    if (locale === 'en-US') {
      return 'en'
    }

    return locale
  }

  const normalizeMedia = (media?: StrapiMedia | null): StrapiMedia | null => {
    if (!media?.url) {
      return media ?? null
    }

    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media
    }

    const baseUrl = strapiUrl.replace(/\/$/, '')
    const path = media.url.replace(/^\//, '')
    return { ...media, url: `${baseUrl}/${path}` }
  }

  const normalizeMediaList = (items?: StrapiMedia[] | null): StrapiMedia[] | null => {
    if (!items) {
      return items ?? null
    }

    const normalized: StrapiMedia[] = []
    for (const item of items) {
      const normalizedItem = normalizeMedia(item)
      if (normalizedItem) {
        normalized.push(normalizedItem)
      }
    }

    return normalized
  }

  const normalizeSeo = (seo?: SharedSeo | null): SharedSeo | null => {
    if (!seo) {
      return seo ?? null
    }

    return {
      ...seo,
      ogImage: normalizeMedia(seo.ogImage),
    }
  }

  const normalizeProject = (project: Project): Project => ({
    ...project,
    thumbnail: normalizeMedia(project.thumbnail) ?? project.thumbnail,
    gallery: normalizeMediaList(project.gallery),
    seo: normalizeSeo(project.seo),
  })

  const getHomepage = async (locale?: string): Promise<Homepage> => {
    const response = await api.getHomepage(normalizeLocale(locale))
    const data = response.data

    return {
      ...data,
      featuredProjects: data.featuredProjects ? data.featuredProjects.map(normalizeProject) : null,
      seo: normalizeSeo(data.seo),
    }
  }

  const getAbout = async (locale?: string): Promise<About> => {
    const response = await api.getAbout(normalizeLocale(locale))
    const data = response.data

    return {
      ...data,
      profilePicture: normalizeMedia(data.profilePicture) ?? data.profilePicture,
      resume: normalizeMedia(data.resume),
    }
  }

  const getContact = async (locale?: string): Promise<Contact> => {
    const response = await api.getContact(normalizeLocale(locale))

    return response.data
  }

  const getProjects = async (locale?: string): Promise<Project[]> => {
    const response = await api.getProjects(normalizeLocale(locale))
    return response.data.map(normalizeProject)
  }

  const getExperiences = async (locale?: string): Promise<Experience[]> => {
    const response = await api.getExperiences(normalizeLocale(locale))
    return response.data.map((item) => ({
      ...item,
      logo: normalizeMedia(item.logo),
    }))
  }

  const getEducations = async (locale?: string): Promise<Education[]> => {
    const response = await api.getEducations(normalizeLocale(locale))
    return response.data.map((item) => ({
      ...item,
      logo: normalizeMedia(item.logo),
    }))
  }

  const getTechnologies = async (): Promise<Technology[]> => {
    const response = await api.getTechnologies()

    return response.data
  }

  return {
    getHomepage,
    getAbout,
    getContact,
    getProjects,
    getExperiences,
    getEducations,
    getTechnologies,
  }
}
