/// <reference types="vitest" />
import { describe, expect, it, vi } from 'vitest'

import { buildUrl, createStrapiClient, serializeQuery } from '../../app/utils/strapi-core'

type FetchArgs = [string, Record<string, unknown>?]

const fetchMock = vi.fn(async () => ({ data: [] }))

vi.stubGlobal('$fetch', fetchMock)

describe('buildUrl', () => {
  it('prefixes /api when missing', () => {
    expect(buildUrl('projects')).toBe('/api/projects')
    expect(buildUrl('/projects')).toBe('/api/projects')
  })

  it('keeps /api prefix when already present', () => {
    expect(buildUrl('/api/projects')).toBe('/api/projects')
  })
})

describe('serializeQuery', () => {
  it('serializes flat params', () => {
    expect(serializeQuery({ locale: 'fr', sort: ['order:asc'] })).toBe(
      'locale=fr&sort[0]=order%3Aasc'
    )
  })

  it('serializes nested populate objects in bracket notation', () => {
    const result = serializeQuery({
      populate: {
        featuredProjects: { populate: ['thumbnail'] },
      },
    })
    expect(result).toBe('populate[featuredProjects][populate][0]=thumbnail')
  })
})

describe('createStrapiClient', () => {
  it('uses base URL and applies token header', async () => {
    fetchMock.mockResolvedValueOnce({ data: [] })

    const client = createStrapiClient({ baseUrl: 'https://api.example.com', token: 'token-123' })
    await client.get('/projects')

    const [url, options] = fetchMock.mock.calls[
      fetchMock.mock.calls.length - 1
    ] as unknown as FetchArgs
    const typedOptions = options as { baseURL?: string; headers?: Record<string, string> }
    expect(url).toBe('/api/projects')
    expect(typedOptions?.baseURL).toBe('https://api.example.com')
    expect(typedOptions?.headers?.Authorization).toBe('Bearer token-123')
  })

  it('omits authorization header when token missing', async () => {
    fetchMock.mockResolvedValueOnce({ data: [] })

    const client = createStrapiClient({ baseUrl: 'https://api.example.com' })
    await client.get('/projects')

    const [, options] = fetchMock.mock.calls[
      fetchMock.mock.calls.length - 1
    ] as unknown as FetchArgs
    const typedOptions = options as { headers?: Record<string, string> }
    expect(typedOptions?.headers?.Authorization).toBeUndefined()
  })

  it('appends query params as qs-serialized string in the URL', async () => {
    fetchMock.mockResolvedValueOnce({ data: [] })

    const client = createStrapiClient({ baseUrl: 'https://api.example.com' })
    await client.get('/projects', { query: { locale: 'fr', sort: ['order:asc'] } })

    const [url] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1] as unknown as FetchArgs
    expect(url).toBe('/api/projects?locale=fr&sort[0]=order%3Aasc')
  })

  it('appends nested populate in bracket notation', async () => {
    fetchMock.mockResolvedValueOnce({ data: [] })

    const client = createStrapiClient({ baseUrl: 'https://api.example.com' })
    await client.get('/homepage', {
      query: {
        populate: {
          featuredProjects: { populate: ['thumbnail'] },
        },
      },
    })

    const [url] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1] as unknown as FetchArgs
    expect(url).toBe('/api/homepage?populate[featuredProjects][populate][0]=thumbnail')
  })
})
