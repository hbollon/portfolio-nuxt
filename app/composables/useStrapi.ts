import type {
  About,
  Contact,
  Education,
  Experience,
  Homepage,
  Project,
  Technology,
} from '../../shared/types/strapi'
import { createStrapiApi } from '../utils/strapi-client'

// Exposes Strapi fetchers bound to runtime configuration.
export const useStrapi = () => {
  const { strapiUrl, strapiToken } = useRuntimeConfig()
  const api = createStrapiApi({ baseUrl: strapiUrl, token: strapiToken })

  const getHomepage = async (locale?: string): Promise<Homepage> => {
    const response = await api.getHomepage(locale)

    return response.data
  }

  const getAbout = async (locale?: string): Promise<About> => {
    const response = await api.getAbout(locale)

    return response.data
  }

  const getContact = async (locale?: string): Promise<Contact> => {
    const response = await api.getContact(locale)

    return response.data
  }

  const getProjects = async (locale?: string): Promise<Project[]> => {
    const response = await api.getProjects(locale)

    return response.data
  }

  const getExperiences = async (locale?: string): Promise<Experience[]> => {
    const response = await api.getExperiences(locale)

    return response.data
  }

  const getEducations = async (locale?: string): Promise<Education[]> => {
    const response = await api.getEducations(locale)

    return response.data
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
