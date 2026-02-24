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
    return (await $fetch(buildUrl(path), {
      baseURL: config.baseUrl,
      headers: {
        ...buildAuthHeaders(config.token),
        ...(options.headers ?? {}),
      },
      query: options.query,
    })) as T
  }

  return {
    get,
  }
}
