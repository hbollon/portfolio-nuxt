import { describe, expect, it, vi } from 'vitest'

import { createStrapiApi } from '../../app/utils/strapi-client'

const getMock = vi.fn(async () => ({ data: [] }))

vi.mock('../../app/utils/strapi-core', () => ({
  createStrapiClient: () => ({
    get: getMock,
  }),
}))

describe('createStrapiApi', () => {
  it('builds homepage query with locale and population', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com', token: 'token' })
    await api.getHomepage('fr')

    expect(getMock).toHaveBeenCalledWith('/homepage', {
      query: {
        locale: 'fr',
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
  })

  it('builds about query without locale', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com' })
    await api.getAbout()

    expect(getMock).toHaveBeenCalledWith('/about', {
      query: {
        populate: ['profilePicture', 'resume', 'socialLinks', 'highlightedSkills'],
      },
    })
  })

  it('sorts collections by order', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com' })
    await api.getProjects('en')

    expect(getMock).toHaveBeenCalledWith('/projects', {
      query: {
        locale: 'en',
        populate: ['thumbnail', 'technologies', 'links'],
        sort: ['order:asc'],
      },
    })
  })

  it('builds contact query with locale and population', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com', token: 'token' })
    await api.getContact('fr')

    expect(getMock).toHaveBeenCalledWith('/contact', {
      query: {
        locale: 'fr',
        populate: ['contactMethods'],
      },
    })
  })

  it('builds experiences query with locale, population and sort', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com' })
    await api.getExperiences('en')

    expect(getMock).toHaveBeenCalledWith('/experiences', {
      query: {
        locale: 'en',
        populate: ['logo', 'technologies'],
        sort: ['order:asc'],
      },
    })
  })

  it('builds educations query with locale, population and sort', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com' })
    await api.getEducations('fr')

    expect(getMock).toHaveBeenCalledWith('/educations', {
      query: {
        locale: 'fr',
        populate: ['logo'],
        sort: ['order:asc'],
      },
    })
  })

  it('builds technologies query without locale but with sort', async () => {
    const api = createStrapiApi({ baseUrl: 'https://api.example.com' })
    await api.getTechnologies()

    expect(getMock).toHaveBeenCalledWith('/technologies', {
      query: {
        pagination: { pageSize: 200 },
        sort: ['order:asc'],
      },
    })
  })
})
