import qs from 'qs'

export interface StrapiFetchOptions {
  query?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface StrapiClientConfig {
  baseUrl: string
  token?: string
}

// Ensures all paths are routed through the Strapi REST namespace.
export const buildUrl = (path: string): string => {
  if (path.startsWith('/api/')) {
    return path
  }

  if (path.startsWith('/')) {
    return `/api${path}`
  }

  return `/api/${path}`
}

// Serializes query params using qs to support nested objects (populate, filters).
export const serializeQuery = (query: Record<string, unknown>): string => {
  return qs.stringify(query, { encodeValuesOnly: true })
}

// Adds the bearer token only when provided.
const buildAuthHeaders = (token?: string): Record<string, string> => {
  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

// Creates a minimal Strapi REST client with base URL and auth handling.
export const createStrapiClient = (config: StrapiClientConfig) => {
  const get = async <T>(path: string, options: StrapiFetchOptions = {}): Promise<T> => {
    const basePath = buildUrl(path)
    const urlPath =
      options.query && Object.keys(options.query).length > 0
        ? `${basePath}?${serializeQuery(options.query)}`
        : basePath

    return (await $fetch(urlPath, {
      baseURL: config.baseUrl,
      headers: {
        ...buildAuthHeaders(config.token),
        ...(options.headers ?? {}),
      },
    })) as T
  }

  return {
    get,
  }
}
