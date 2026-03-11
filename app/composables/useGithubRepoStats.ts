export interface GithubRepoStats {
  stars: number
  forks: number
  issues: number
  pullRequests: number
}

interface GithubRepoResponse {
  stargazers_count: number
  forks_count: number
  open_issues_count: number
}

interface CachedEntry {
  expiresAt: number
  stats: GithubRepoStats
}

const CACHE_TTL_MS = 15 * 60 * 1000
const cache = new Map<string, CachedEntry>()
const inflight = new Map<string, Promise<GithubRepoStats | null>>()

const REPO_URL_REGEX = /^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/i

const getPullRequestsCount = async (repoPath: string): Promise<number> => {
  const response = await fetch(
    `https://api.github.com/repos/${repoPath}/pulls?state=open&per_page=1`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Cannot fetch pull requests for ${repoPath}`)
  }

  const linkHeader = response.headers.get('link')
  const lastPageMatch = linkHeader?.match(/[?&]page=(\d+)>; rel="last"/)

  if (lastPageMatch?.[1]) {
    return Number.parseInt(lastPageMatch[1], 10)
  }

  const firstPage = (await response.json()) as unknown
  return Array.isArray(firstPage) ? firstPage.length : 0
}

export const extractGithubRepoPath = (url: string): string | null => {
  const normalized = url.trim().replace(/\.git$/i, '')
  const match = normalized.match(REPO_URL_REGEX)

  if (!match) {
    return null
  }

  const owner = match[1]?.trim()
  const repo = match[2]?.trim()

  if (!owner || !repo) {
    return null
  }

  return `${owner}/${repo}`
}

export const fetchGithubRepoStats = async (repoPath: string): Promise<GithubRepoStats | null> => {
  const now = Date.now()
  const cached = cache.get(repoPath)

  if (cached && cached.expiresAt > now) {
    return cached.stats
  }

  const pending = inflight.get(repoPath)
  if (pending) {
    return pending
  }

  const request = (async () => {
    try {
      const [repoResponse, pullRequests] = await Promise.all([
        fetch(`https://api.github.com/repos/${repoPath}`, {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }),
        getPullRequestsCount(repoPath),
      ])

      if (!repoResponse.ok) {
        throw new Error(`Cannot fetch repository for ${repoPath}`)
      }

      const data = (await repoResponse.json()) as GithubRepoResponse
      const issues = Math.max((data.open_issues_count ?? 0) - pullRequests, 0)

      const stats: GithubRepoStats = {
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        issues,
        pullRequests,
      }

      cache.set(repoPath, {
        expiresAt: now + CACHE_TTL_MS,
        stats,
      })

      return stats
    } catch {
      return null
    } finally {
      inflight.delete(repoPath)
    }
  })()

  inflight.set(repoPath, request)
  return request
}
