import { createStrapiClient } from './strapi-core'
import type {
  About,
  Contact,
  Education,
  Experience,
  Homepage,
  Project,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  Technology,
} from '../../shared/types/strapi'

export interface StrapiClientOptions {
  baseUrl: string
  token?: string
}

// Builds typed Strapi fetchers with the exact query shapes expected by the API.
export const createStrapiApi = (options: StrapiClientOptions) => {
  const client = createStrapiClient(options)

  const getHomepage = async (locale?: string): Promise<StrapiSingleResponse<Homepage>> => {
    return await client.get<StrapiSingleResponse<Homepage>>('/homepage', {
      query: {
        ...(locale ? { locale } : {}),
        populate: {
          featuredProjects: {
            populate: ['thumbnail', 'technologies', 'links'],
          },
          seo: {
            populate: ['ogImage'],
          },
        },
      },
    })
  }

  const getAbout = async (locale?: string): Promise<StrapiSingleResponse<About>> => {
    return await client.get<StrapiSingleResponse<About>>('/about', {
      query: {
        ...(locale ? { locale } : {}),
        populate: ['profilePicture', 'resume', 'socialLinks', 'highlightedSkills'],
      },
    })
  }

  const getContact = async (locale?: string): Promise<StrapiSingleResponse<Contact>> => {
    return await client.get<StrapiSingleResponse<Contact>>('/contact', {
      query: {
        ...(locale ? { locale } : {}),
        populate: ['contactMethods'],
      },
    })
  }

  const getProjects = async (locale?: string): Promise<StrapiCollectionResponse<Project>> => {
    return await client.get<StrapiCollectionResponse<Project>>('/projects', {
      query: {
        ...(locale ? { locale } : {}),
        populate: ['thumbnail', 'technologies', 'links'],
        sort: ['order:asc'],
      },
    })
  }

  const getExperiences = async (locale?: string): Promise<StrapiCollectionResponse<Experience>> => {
    return await client.get<StrapiCollectionResponse<Experience>>('/experiences', {
      query: {
        ...(locale ? { locale } : {}),
        populate: ['logo', 'technologies'],
        sort: ['order:asc'],
      },
    })
  }

  const getEducations = async (locale?: string): Promise<StrapiCollectionResponse<Education>> => {
    return await client.get<StrapiCollectionResponse<Education>>('/educations', {
      query: {
        ...(locale ? { locale } : {}),
        populate: ['logo'],
        sort: ['order:asc'],
      },
    })
  }

  const getTechnologies = async (): Promise<StrapiCollectionResponse<Technology>> => {
    return await client.get<StrapiCollectionResponse<Technology>>('/technologies', {
      query: {
        sort: ['order:asc'],
      },
    })
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
