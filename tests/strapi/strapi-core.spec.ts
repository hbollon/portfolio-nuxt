/// <reference types="vitest" />
import { describe, expect, it, vi } from 'vitest'

import { buildUrl, createStrapiClient } from '../../app/utils/strapi-core'

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

  it('passes query parameters', async () => {
    fetchMock.mockResolvedValueOnce({ data: [] })

    const client = createStrapiClient({ baseUrl: 'https://api.example.com' })
    await client.get('/projects', { query: { locale: 'fr', sort: ['order:asc'] } })

    const [, options] = fetchMock.mock.calls[
      fetchMock.mock.calls.length - 1
    ] as unknown as FetchArgs
    const typedOptions = options as { query?: Record<string, unknown> }
    expect(typedOptions?.query).toEqual({ locale: 'fr', sort: ['order:asc'] })
  })
})
